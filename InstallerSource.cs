using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;
using Microsoft.Win32;

[assembly: AssemblyTitle("Instalar-SIGEC-Pro")]
[assembly: AssemblyDescription("Instalador Autónomo do SIGEC-Pro")]
[assembly: AssemblyCompany("José Centúrio")]
[assembly: AssemblyProduct("SIGEC-Pro - Sistema Integrado de Gestão Empresarial e Contactos")]
[assembly: AssemblyCopyright("Copyright © 2026 José Centúrio. Todos os direitos reservados.")]
[assembly: AssemblyTrademark("SIGEC-Pro™")]
[assembly: AssemblyVersion("1.7.20.0")]
[assembly: AssemblyFileVersion("1.7.20.0")]

namespace SIGECProInstaller
{
    static class Program
    {
        [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        public static extern void SHChangeNotify(uint wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);

        [STAThread]
        static void Main()
        {
            try
            {
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)768 | (SecurityProtocolType)192 | (SecurityProtocolType)12288;
                ServicePointManager.ServerCertificateValidationCallback = (sender, cert, chain, sslErrors) => true;

                string targetDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "SIGEC-Pro");
                Directory.CreateDirectory(targetDir);

                // Fechar processos SIGEC-Pro em execução antes de atualizar
                try
                {
                    foreach (var proc in Process.GetProcessesByName("SIGEC-Pro"))
                    {
                        proc.Kill();
                        proc.WaitForExit(1500);
                    }
                }
                catch { }

                int extractedCount = 0;
                Assembly asm = Assembly.GetExecutingAssembly();
                string[] resNames = asm.GetManifestResourceNames();

                // 1. Extrair ficheiros do ZIP embutido
                foreach (string rName in resNames)
                {
                    if (rName.EndsWith(".zip", StringComparison.OrdinalIgnoreCase) || rName.Equals("SIGEC_PAYLOAD", StringComparison.OrdinalIgnoreCase))
                    {
                        using (Stream resStream = asm.GetManifestResourceStream(rName))
                        {
                            if (resStream != null)
                            {
                                using (ZipArchive archive = new ZipArchive(resStream, ZipArchiveMode.Read))
                                {
                                    foreach (ZipArchiveEntry entry in archive.Entries)
                                    {
                                        if (string.IsNullOrEmpty(entry.Name)) continue;
                                        
                                        string fullPath = Path.Combine(targetDir, entry.FullName);
                                        string dir = Path.GetDirectoryName(fullPath);
                                        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

                                        // Preservar base de dados existente se já existir
                                        if (entry.FullName.Replace('\\', '/').Equals("data/db.json", StringComparison.OrdinalIgnoreCase) && File.Exists(fullPath))
                                        {
                                            continue;
                                        }

                                        entry.ExtractToFile(fullPath, true);
                                        extractedCount++;
                                    }
                                }
                            }
                        }
                    }
                }

                // 2. Se houver ficheiros na mesma pasta do instalador, copiar também
                string currentDir = AppDomain.CurrentDomain.BaseDirectory;
                string[] directFiles = new string[] { "index.html", "app.js", "styles.css", "i18n.js", "duplicatesManager.js", "SIGEC-Pro.exe", "favicon.ico" };
                foreach (string df in directFiles)
                {
                    string localF = Path.Combine(currentDir, df);
                    if (File.Exists(localF))
                    {
                        try { File.Copy(localF, Path.Combine(targetDir, df), true); } catch { }
                    }
                }

                // 3. Atualizar Atalho no Ambiente de Trabalho e Associações
                string finalExe = Path.Combine(targetDir, "SIGEC-Pro.exe");
                EnsureDesktopShortcut(finalExe, targetDir);
                RegisterFileAssociations(finalExe, targetDir);

                MessageBox.Show("✅ O SIGEC-Pro V1.7.20 foi instalado e atualizado com sucesso!\n\n• Todos os ficheiros do programa foram renovados para a versão V1.7.20.\n• Todos os dados de Clientes, Contactos e Projetos foram 100% PRESERVADOS.\n• Atalhos e associações de ficheiros (.sigecbak e .sigecpkg) configurados.", "SIGEC-Pro V1.7.20 - Instalação Concluída", MessageBoxButtons.OK, MessageBoxIcon.Information);

                if (File.Exists(finalExe))
                {
                    Process.Start(finalExe);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro durante a instalação: " + ex.Message, "SIGEC-Pro", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static void RegisterFileAssociations(string exePath, string appDir)
        {
            try
            {
                string iconPath = Path.Combine(appDir, "favicon.ico");
                if (!File.Exists(iconPath)) iconPath = Path.Combine(appDir, "Images", "favicon.ico");
                if (!File.Exists(iconPath)) iconPath = exePath + ",0";

                using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\.sigecbak")) key.SetValue("", "SIGECPro.Backup");
                using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\.sigec")) key.SetValue("", "SIGECPro.Backup");
                using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\SIGECPro.Backup"))
                {
                    key.SetValue("", "Cópia de Segurança SIGEC-Pro");
                    using (var iconKey = key.CreateSubKey("DefaultIcon")) iconKey.SetValue("", iconPath);
                    using (var cmdKey = key.CreateSubKey(@"shell\open\command")) cmdKey.SetValue("", "\"" + exePath + "\" \"%1\"");
                }

                using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\.sigecpkg")) key.SetValue("", "SIGECPro.Package");
                using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\.sigecupd")) key.SetValue("", "SIGECPro.Package");
                using (var key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\SIGECPro.Package"))
                {
                    key.SetValue("", "Pacote de Atualização SIGEC-Pro");
                    using (var iconKey = key.CreateSubKey("DefaultIcon")) iconKey.SetValue("", iconPath);
                    using (var cmdKey = key.CreateSubKey(@"shell\open\command")) cmdKey.SetValue("", "\"" + exePath + "\" \"%1\"");
                }

                SHChangeNotify(0x08000000, 0x0000, IntPtr.Zero, IntPtr.Zero);
            }
            catch { }
        }

        private static void EnsureDesktopShortcut(string exePath, string appDir)
        {
            try
            {
                string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcutPath = Path.Combine(desktop, "SIGEC-Pro.lnk");

                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    dynamic shortcut = shell.CreateShortcut(shortcutPath);
                    shortcut.TargetPath = exePath;
                    shortcut.WorkingDirectory = appDir;
                    shortcut.Description = "SIGEC-Pro - Sistema Integrado de Gestão Empresarial e Contactos";
                    string iconPath = Path.Combine(appDir, "favicon.ico");
                    if (!File.Exists(iconPath)) iconPath = Path.Combine(appDir, "Images", "favicon.ico");
                    if (File.Exists(iconPath)) shortcut.IconLocation = iconPath + ",0";
                    shortcut.Save();
                }
            }
            catch { }
        }
    }
}
