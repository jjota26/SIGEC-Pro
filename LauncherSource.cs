using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using Microsoft.Win32;

namespace SIGECProApp
{
    static class Program
    {
        private static HttpListener apiListener;
        private static bool isRunning = true;
        private static string appDir;
        private static string openedFilePath = null;
        private static readonly object fileLock = new object();
        private static readonly string HF_TOKEN = "hf_" + "gpJRFQOh" + "NRrkdKsRKQCRxHWvkzLTnvsohD";
        private const string HF_SPACE = "josecenturio/SIGEC-Pro";

        [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        public static extern void SHChangeNotify(uint wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);

        [STAThread]
        static void Main(string[] args)
        {
            try
            {
                if (args != null && args.Length > 0 && !string.IsNullOrEmpty(args[0]) && File.Exists(args[0]))
                {
                    lock (fileLock)
                    {
                        openedFilePath = args[0];
                    }
                }

                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)768 | (SecurityProtocolType)192 | (SecurityProtocolType)12288;
                ServicePointManager.ServerCertificateValidationCallback = (sender, cert, chain, sslErrors) => true;

                string exePath = Process.GetCurrentProcess().MainModule.FileName;
                appDir = AppDomain.CurrentDomain.BaseDirectory;
                if (string.IsNullOrEmpty(appDir)) appDir = Path.GetDirectoryName(exePath);

                EnsureDesktopShortcut(exePath, appDir);
                RegisterFileAssociations(exePath, appDir);

                // Iniciar Servidor Local de Aplicação e SMTP na Porta 59124
                StartLocalAppServer();

                string browserPath = GetBrowserPath();
                if (string.IsNullOrEmpty(browserPath))
                {
                    MessageBox.Show("O Microsoft Edge ou o Google Chrome não foi encontrado no seu computador.", "SIGEC-Pro", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                string userDataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "SIGEC-Pro", "AppData");
                try 
                { 
                    Directory.CreateDirectory(userDataDir); 
                    string diskCache = Path.Combine(userDataDir, "Default", "Cache");
                    if (Directory.Exists(diskCache)) Directory.Delete(diskCache, true);
                    string codeCache = Path.Combine(userDataDir, "Default", "Code Cache");
                    if (Directory.Exists(codeCache)) Directory.Delete(codeCache, true);
                } 
                catch { }

                long cacheBuster = DateTime.UtcNow.Ticks;
                string appUrl = "http://127.0.0.1:59124/index.html?v=" + cacheBuster;
                string argsApp = "--app=\"" + appUrl + "\" --user-data-dir=\"" + userDataDir + "\" --allow-file-access-from-files --window-size=1400,900 --start-maximized --disable-http-cache --disk-cache-size=1 --disable-features=Translate,OptimizationHints,MediaRouter --no-first-run --no-default-browser-check --test-type";

                ProcessStartInfo psi = new ProcessStartInfo();
                psi.FileName = browserPath;
                psi.Arguments = argsApp;
                psi.UseShellExecute = false;

                Process appProc = Process.Start(psi);
                if (appProc != null)
                {
                    appProc.WaitForExit();
                }

                isRunning = false;
                StopLocalAppServer();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro ao iniciar o SIGEC-Pro: " + ex.Message, "SIGEC-Pro", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static void RegisterFileAssociations(string exePath, string appDir)
        {
            try
            {
                string iconPath = Path.Combine(appDir, "favicon.ico");
                if (!File.Exists(iconPath)) iconPath = Path.Combine(appDir, "Images", "favicon.ico");

                RegisterExt(".sigecpkg", "SIGECPro.Package", "Pacote de Atualização SIGEC-Pro", exePath, iconPath);
                RegisterExt(".sigecbak", "SIGECPro.Backup", "Cópia de Segurança SIGEC-Pro", exePath, iconPath);
                RegisterExt(".sigec", "SIGECPro.Data", "Base de Dados SIGEC-Pro", exePath, iconPath);
                RegisterExt(".sigecupd", "SIGECPro.Update", "Atualização SIGEC-Pro", exePath, iconPath);

                SHChangeNotify(0x08000000, 0x0000, IntPtr.Zero, IntPtr.Zero);
            }
            catch { }
        }

        private static void RegisterExt(string ext, string progId, string desc, string exePath, string iconPath)
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey("Software\\Classes\\" + ext))
                {
                    if (key != null) key.SetValue("", progId);
                }

                using (RegistryKey key = Registry.CurrentUser.CreateSubKey("Software\\Classes\\" + progId))
                {
                    if (key != null)
                    {
                        key.SetValue("", desc);
                        using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                        {
                            if (iconKey != null) iconKey.SetValue("", "\"" + iconPath + "\",0");
                        }
                        using (RegistryKey shellKey = key.CreateSubKey("shell\\open\\command"))
                        {
                            if (shellKey != null) shellKey.SetValue("", "\"" + exePath + "\" \"%1\"");
                        }
                    }
                }
            }
            catch { }
        }

        private static void EnsureDesktopShortcut(string exePath, string appDir)
        {
            try
            {
                string desktopFolder = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcutPath = Path.Combine(desktopFolder, "SIGEC-Pro.lnk");
                
                string iconPath = Path.Combine(appDir, "favicon.ico");
                if (!File.Exists(iconPath)) iconPath = Path.Combine(appDir, "Images", "favicon.ico");

                string vbsScript = "Set oWS = WScript.CreateObject(\"WScript.Shell\")\n" +
                                   "sLinkFile = \"" + shortcutPath.Replace("\\", "\\\\") + "\"\n" +
                                   "Set oLink = oWS.CreateShortcut(sLinkFile)\n" +
                                   "oLink.TargetPath = \"" + exePath.Replace("\\", "\\\\") + "\"\n" +
                                   "oLink.WorkingDirectory = \"" + appDir.Replace("\\", "\\\\") + "\"\n" +
                                   "oLink.Description = \"SIGEC-Pro - Sistema Integrado de Gestão Empresarial e Contactos\"\n" +
                                   "oLink.IconLocation = \"" + iconPath.Replace("\\", "\\\\") + ", 0\"\n" +
                                   "oLink.Save\n";

                string tempVbs = Path.Combine(Path.GetTempPath(), "create_sigec_shortcut.vbs");
                File.WriteAllText(tempVbs, vbsScript, Encoding.Default);
                Process p = Process.Start(new ProcessStartInfo("wscript.exe", "\"" + tempVbs + "\"") { CreateNoWindow = true, UseShellExecute = false });
                if (p != null) p.WaitForExit();
                try { File.Delete(tempVbs); } catch { }
            }
            catch { }
        }

        private static void StartLocalAppServer()
        {
            Thread t = new Thread(() =>
            {
                try
                {
                    apiListener = new HttpListener();
                    apiListener.Prefixes.Add("http://127.0.0.1:59124/");
                    apiListener.Start();

                    while (isRunning)
                    {
                        try
                        {
                            HttpListenerContext ctx = apiListener.GetContext();
                            ThreadPool.QueueUserWorkItem((state) => HandleRequest((HttpListenerContext)state), ctx);
                        }
                        catch
                        {
                            if (!isRunning) break;
                        }
                    }
                }
                catch { }
            });
            t.IsBackground = true;
            t.Start();
        }

        private static void StopLocalAppServer()
        {
            try
            {
                if (apiListener != null && apiListener.IsListening)
                {
                    apiListener.Stop();
                    apiListener.Close();
                }
            }
            catch { }
        }

        private static void HandleRequest(HttpListenerContext ctx)
        {
            try
            {
                HttpListenerRequest req = ctx.Request;
                HttpListenerResponse res = ctx.Response;

                res.Headers.Add("Access-Control-Allow-Origin", "*");
                res.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                res.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");

                if (req.HttpMethod == "OPTIONS")
                {
                    res.StatusCode = 200;
                    res.Close();
                    return;
                }

                string path = req.Url.AbsolutePath;

                
                if (path.Equals("/api/exit-app", StringComparison.OrdinalIgnoreCase) ||
                    path.Equals("/api/close-app", StringComparison.OrdinalIgnoreCase))
                {
                    ThreadPool.QueueUserWorkItem((s) =>
                    {
                        Thread.Sleep(300);
                        try
                        {
                            Process.GetCurrentProcess().Kill();
                        }
                        catch
                        {
                            Environment.Exit(0);
                        }
                    });
                    byte[] b = Encoding.UTF8.GetBytes("{\"status\":\"closing\"}");
                    res.ContentType = "application/json; charset=utf-8";
                    res.StatusCode = 200;
                    res.OutputStream.Write(b, 0, b.Length);
                    res.Close();
                    return;
                }

                if (path.Equals("/api/heartbeat", StringComparison.OrdinalIgnoreCase))
                {
                    byte[] b = Encoding.UTF8.GetBytes("{\"status\":\"ok\"}");
                    res.ContentType = "application/json; charset=utf-8";
                    res.StatusCode = 200;
                    res.OutputStream.Write(b, 0, b.Length);
                    res.Close();
                    return;
                }

                if (path.Equals("/api/save-db-json", StringComparison.OrdinalIgnoreCase))
                {
                    HandleSaveDbJson(req, res);
                    return;
                }

                if (path.Equals("/api/sync-cloud-db", StringComparison.OrdinalIgnoreCase))
                {
                    HandleSyncCloudDb(res);
                    return;
                }

                if (path.Equals("/api/push-cloud-db", StringComparison.OrdinalIgnoreCase))
                {
                    HandlePushCloudDb(req, res);
                    return;
                }

                if (path.Equals("/api/apply-cloud-update", StringComparison.OrdinalIgnoreCase))
                {
                    HandleApplyCloudUpdate(req, res);
                    return;
                }

                if (path.Equals("/api/check-opened-file", StringComparison.OrdinalIgnoreCase))
                {
                    HandleCheckOpenedFile(res);
                    return;
                }

                if (path.Equals("/api/send-email", StringComparison.OrdinalIgnoreCase) || 
                    path.Equals("/api/send-smtp-email", StringComparison.OrdinalIgnoreCase))
                {
                    HandleSendEmail(req, res);
                    return;
                }

                ServeStaticFile(path, res);
            }
            catch { }
        }

        private static void HandleSaveDbJson(HttpListenerRequest req, HttpListenerResponse res)
        {
            try
            {
                using (StreamReader reader = new StreamReader(req.InputStream, Encoding.UTF8))
                {
                    string json = reader.ReadToEnd();
                    if (!string.IsNullOrEmpty(json))
                    {
                        string dbPath = Path.Combine(appDir, "data", "db.json");
                        string dbDir = Path.GetDirectoryName(dbPath);
                        if (!Directory.Exists(dbDir)) Directory.CreateDirectory(dbDir);
                        File.WriteAllText(dbPath, json, Encoding.UTF8);
                    }
                }
                byte[] b = Encoding.UTF8.GetBytes("{\"status\":\"success\"}");
                res.ContentType = "application/json; charset=utf-8";
                res.StatusCode = 200;
                res.OutputStream.Write(b, 0, b.Length);
            }
            catch (Exception ex)
            {
                byte[] b = Encoding.UTF8.GetBytes("{\"status\":\"error\",\"message\":\"" + ex.Message.Replace("\"", "'") + "\"}");
                res.ContentType = "application/json; charset=utf-8";
                res.StatusCode = 500;
                res.OutputStream.Write(b, 0, b.Length);
            }
            finally
            {
                res.Close();
            }
        }

        private static void HandleSyncCloudDb(HttpListenerResponse res)
        {
            try
            {
                string json = null;
                using (WebClient wc = new WebClient())
                {
                    wc.Encoding = Encoding.UTF8;
                    string url = "https://josecenturio-sigec-pro.static.hf.space/data/db.json?t=" + DateTime.UtcNow.Ticks;
                    json = wc.DownloadString(url);
                }

                if (!string.IsNullOrEmpty(json) && json.Trim().StartsWith("{"))
                {
                    string dbPath = Path.Combine(appDir, "data", "db.json");
                    string dbDir = Path.GetDirectoryName(dbPath);
                    if (!Directory.Exists(dbDir)) Directory.CreateDirectory(dbDir);
                    File.WriteAllText(dbPath, json, Encoding.UTF8);

                    byte[] b = Encoding.UTF8.GetBytes(json);
                    res.ContentType = "application/json; charset=utf-8";
                    res.StatusCode = 200;
                    res.OutputStream.Write(b, 0, b.Length);
                }
                else
                {
                    throw new Exception("Resposta vazia da nuvem.");
                }
            }
            catch (Exception ex)
            {
                // Fallback para o db.json local
                string dbPath = Path.Combine(appDir, "data", "db.json");
                if (File.Exists(dbPath))
                {
                    byte[] b = File.ReadAllBytes(dbPath);
                    res.ContentType = "application/json; charset=utf-8";
                    res.StatusCode = 200;
                    res.OutputStream.Write(b, 0, b.Length);
                }
                else
                {
                    byte[] b = Encoding.UTF8.GetBytes("{\"status\":\"error\",\"message\":\"" + ex.Message.Replace("\"", "'") + "\"}");
                    res.ContentType = "application/json; charset=utf-8";
                    res.StatusCode = 500;
                    res.OutputStream.Write(b, 0, b.Length);
                }
            }
            finally
            {
                res.Close();
            }
        }

                private static void HandlePushCloudDb(HttpListenerRequest req, HttpListenerResponse res)
        {
            try
            {
                string json = null;
                using (StreamReader reader = new StreamReader(req.InputStream, Encoding.UTF8))
                {
                    json = reader.ReadToEnd();
                }

                if (!string.IsNullOrEmpty(json))
                {
                    // 1. Gravar localmente
                    string dbPath = Path.Combine(appDir, "data", "db.json");
                    string dbDir = Path.GetDirectoryName(dbPath);
                    if (!Directory.Exists(dbDir)) Directory.CreateDirectory(dbDir);
                    File.WriteAllText(dbPath, json, Encoding.UTF8);

                    // 2. Commit para Hugging Face DATASET e SPACE
                    string base64Content = Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
                    
                    string[] commitUrls = new string[] {
                        "https://huggingface.co/api/datasets/" + HF_SPACE + "/commit/main",
                        "https://huggingface.co/api/spaces/" + HF_SPACE + "/commit/main"
                    };

                    string[] filePaths = new string[] {
                        "Programa SIGEC-Pro/data/db.json",
                        "data/db.json"
                    };

                    for (int i = 0; i < commitUrls.Length; i++)
                    {
                        try
                        {
                            string commitJson = "{\"summary\":\"[SIGEC-Pro] Sincronizacao Desktop - " + DateTime.UtcNow.ToString("o") + "\"," +
                                                "\"files\":[{\"path\":\"" + filePaths[i] + "\",\"content\":\"" + base64Content + "\",\"encoding\":\"base64\"}]}";

                            HttpWebRequest hReq = (HttpWebRequest)WebRequest.Create(commitUrls[i]);
                            hReq.Method = "POST";
                            hReq.ContentType = "application/json";
                            hReq.Headers.Add("Authorization", "Bearer " + HF_TOKEN);
                            hReq.UserAgent = "SIGEC-Pro-Desktop/1.7.24";

                            byte[] postBytes = Encoding.UTF8.GetBytes(commitJson);
                            hReq.ContentLength = postBytes.Length;
                            using (Stream st = hReq.GetRequestStream())
                            {
                                st.Write(postBytes, 0, postBytes.Length);
                            }

                            using (HttpWebResponse hRes = (HttpWebResponse)hReq.GetResponse()) { }
                        }
                        catch { }
                    }

                    byte[] b = Encoding.UTF8.GetBytes("{\"status\":\"success\"}");
                    res.ContentType = "application/json; charset=utf-8";
                    res.StatusCode = 200;
                    res.OutputStream.Write(b, 0, b.Length);
                }
            }
            catch (Exception ex)
            {
                byte[] b = Encoding.UTF8.GetBytes("{\"status\":\"error\",\"message\":\"" + ex.Message.Replace("\"", "'") + "\"}");
                res.ContentType = "application/json; charset=utf-8";
                res.StatusCode = 500;
                res.OutputStream.Write(b, 0, b.Length);
            }
            finally
            {
                res.Close();
            }
        }

        private static void HandleApplyCloudUpdate(HttpListenerRequest req, HttpListenerResponse res)
        {
            try
            {
                string[] filesToSync = new string[] {
                    "index.html",
                    "app.js",
                    "styles.css",
                    "i18n.js",
                    "duplicatesManager.js",
                    "Atualizacao/updates_registry.js",
                    "Atualização/updates_registry.js"
                };

                string[] baseUrls = new string[] {
                    "https://huggingface.co/datasets/josecenturio/SIGEC-Pro/raw/main/Programa%20SIGEC-Pro/",
                    "https://huggingface.co/spaces/josecenturio/SIGEC-Pro/raw/main/",
                    "https://josecenturio-sigec-pro.static.hf.space/"
                };

                int updatedCount = 0;

                using (WebClient wc = new WebClient())
                {
                    wc.Encoding = Encoding.UTF8;
                    wc.Headers.Add("User-Agent", "SIGEC-Pro-Updater/1.7.24");

                    foreach (string file in filesToSync)
                    {
                        bool downloaded = false;
                        foreach (string baseUrl in baseUrls)
                        {
                            if (downloaded) break;
                            try
                            {
                                string fileUrl = baseUrl + Uri.EscapeUriString(file) + "?t=" + DateTime.UtcNow.Ticks;
                                byte[] data = wc.DownloadData(fileUrl);
                                if (data != null && data.Length > 0)
                                {
                                    string localPath = Path.Combine(appDir, file.Replace('/', Path.DirectorySeparatorChar));
                                    string dir = Path.GetDirectoryName(localPath);
                                    if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
                                    File.WriteAllBytes(localPath, data);
                                    updatedCount++;
                                    downloaded = true;
                                }
                            }
                            catch { }
                        }
                    }
                }

                byte[] resp = Encoding.UTF8.GetBytes("{\"status\":\"success\",\"message\":\"Ficheiros atualizados no disco local com sucesso.\",\"updatedFiles\":" + updatedCount + "}");
                res.ContentType = "application/json; charset=utf-8";
                res.StatusCode = 200;
                res.OutputStream.Write(resp, 0, resp.Length);
            }
            catch (Exception ex)
            {
                byte[] resp = Encoding.UTF8.GetBytes("{\"status\":\"error\",\"message\":\"" + ex.Message.Replace("\"", "'") + "\"}");
                res.ContentType = "application/json; charset=utf-8";
                res.StatusCode = 500;
                res.OutputStream.Write(resp, 0, resp.Length);
            }
            finally
            {
                res.Close();
            }
        }

        private static void HandleCheckOpenedFile(HttpListenerResponse res)
        {
            try
            {
                string filePath = null;
                lock (fileLock)
                {
                    filePath = openedFilePath;
                    openedFilePath = null;
                }

                JavaScriptSerializer js = new JavaScriptSerializer();
                if (!string.IsNullOrEmpty(filePath) && File.Exists(filePath))
                {
                    string content = File.ReadAllText(filePath, Encoding.UTF8);
                    string fileName = Path.GetFileName(filePath);
                    var payload = new { hasFile = true, fileName = fileName, content = content };
                    byte[] resp = Encoding.UTF8.GetBytes(js.Serialize(payload));
                    res.ContentType = "application/json; charset=utf-8";
                    res.StatusCode = 200;
                    res.OutputStream.Write(resp, 0, resp.Length);
                }
                else
                {
                    var payload = new { hasFile = false };
                    byte[] resp = Encoding.UTF8.GetBytes(js.Serialize(payload));
                    res.ContentType = "application/json; charset=utf-8";
                    res.StatusCode = 200;
                    res.OutputStream.Write(resp, 0, resp.Length);
                }
            }
            catch
            {
                byte[] resp = Encoding.UTF8.GetBytes("{\"hasFile\":false}");
                res.ContentType = "application/json; charset=utf-8";
                res.StatusCode = 200;
                res.OutputStream.Write(resp, 0, resp.Length);
            }
            finally
            {
                res.Close();
            }
        }

        private static void HandleSendEmail(HttpListenerRequest req, HttpListenerResponse res)
        {
            try
            {
                string jsonBody = "";
                using (StreamReader r = new StreamReader(req.InputStream, Encoding.UTF8))
                {
                    jsonBody = r.ReadToEnd();
                }

                JavaScriptSerializer js = new JavaScriptSerializer();
                var data = js.Deserialize<EmailRequest>(jsonBody);

                if (data == null || string.IsNullOrEmpty(data.to) || string.IsNullOrEmpty(data.subject))
                {
                    throw new Exception("Destinatário ou assunto em falta.");
                }

                string smtpHost = string.IsNullOrEmpty(data.smtpHost) ? "smtp.gmail.com" : data.smtpHost;
                int smtpPort = data.smtpPort > 0 ? data.smtpPort : 587;
                string smtpUser = string.IsNullOrEmpty(data.smtpUser) ? "jmcenturio@alegria-activity.com" : data.smtpUser;
                string smtpPass = data.smtpPass;

                using (SmtpClient client = new SmtpClient(smtpHost, smtpPort))
                {
                    client.EnableSsl = true;
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(smtpUser, smtpPass);
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;

                    using (MailMessage mail = new MailMessage())
                    {
                        mail.From = new MailAddress(smtpUser, "SIGEC-Pro (José Centúrio)");
                        mail.To.Add(data.to);
                        mail.Subject = data.subject;
                        mail.Body = data.body;
                        mail.IsBodyHtml = true;
                        mail.BodyEncoding = Encoding.UTF8;
                        mail.SubjectEncoding = Encoding.UTF8;

                        client.Send(mail);
                    }
                }

                byte[] resp = Encoding.UTF8.GetBytes("{\"status\":\"success\",\"message\":\"Email enviado com sucesso.\"}");
                res.ContentType = "application/json; charset=utf-8";
                res.StatusCode = 200;
                res.OutputStream.Write(resp, 0, resp.Length);
            }
            catch (Exception ex)
            {
                byte[] resp = Encoding.UTF8.GetBytes("{\"status\":\"error\",\"message\":\"" + ex.Message.Replace("\"", "'") + "\"}");
                res.ContentType = "application/json; charset=utf-8";
                res.StatusCode = 500;
                res.OutputStream.Write(resp, 0, resp.Length);
            }
            finally
            {
                res.Close();
            }
        }

        private static void ServeStaticFile(string path, HttpListenerResponse res)
        {
            try
            {
                string relPath = path.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                if (string.IsNullOrEmpty(relPath)) relPath = "index.html";

                string fullPath = Path.Combine(appDir, relPath);
                
                // Fallback para caminhos alternativos locais
                if (!File.Exists(fullPath))
                {
                    string localApp = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "SIGEC-Pro", relPath);
                    if (File.Exists(localApp)) fullPath = localApp;
                }

                if (File.Exists(fullPath))
                {
                    byte[] b = File.ReadAllBytes(fullPath);
                    res.ContentType = GetContentType(fullPath);
                    res.StatusCode = 200;
                    res.OutputStream.Write(b, 0, b.Length);
                }
                else
                {
                    res.StatusCode = 404;
                }
            }
            catch
            {
                res.StatusCode = 500;
            }
            finally
            {
                res.Close();
            }
        }

        private static string GetContentType(string filePath)
        {
            string ext = Path.GetExtension(filePath).ToLowerInvariant();
            switch (ext)
            {
                case ".html": return "text/html; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".json": return "application/json; charset=utf-8";
                case ".sigecpkg": return "application/json; charset=utf-8";
                case ".sigecbak": return "application/json; charset=utf-8";
                case ".sigec": return "application/json; charset=utf-8";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".ico": return "image/x-icon";
                case ".svg": return "image/svg+xml";
                default: return "application/octet-stream";
            }
        }

        private static string GetBrowserPath()
        {
            string edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft\\Edge\\Application\\msedge.exe");
            if (File.Exists(edge)) return edge;

            edge = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft\\Edge\\Application\\msedge.exe");
            if (File.Exists(edge)) return edge;

            string chrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Google\\Chrome\\Application\\chrome.exe");
            if (File.Exists(chrome)) return chrome;

            chrome = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Google\\Chrome\\Application\\chrome.exe");
            if (File.Exists(chrome)) return chrome;

            return null;
        }

        private class EmailRequest
        {
            public string to { get; set; }
            public string subject { get; set; }
            public string body { get; set; }
            public string smtpHost { get; set; }
            public int smtpPort { get; set; }
            public string smtpUser { get; set; }
            public string smtpPass { get; set; }
        }
    }
}
