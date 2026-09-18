const http = require('http');
const fs = require('fs');
const path = require('path');
const tls = require('tls');

const PORT = process.env.PORT || 10000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.sigecbak': 'application/json',
  '.sigecpkg': 'application/json'
};

const DEFAULT_SMTP_USER = 'jmcenturio@alegria-activity.com';
const DEFAULT_SMTP_PASS = 'fktqfvuyocdhokmn';

function sendEmailViaSmtp(options) {
  return new Promise((resolve) => {
    const user = options.user || DEFAULT_SMTP_USER;
    const pass = (options.pass || DEFAULT_SMTP_PASS).replace(/\s+/g, '');
    const from = options.from || user;
    const to = options.to;
    const subject = options.subject || '[SIGEC-Pro] Notificação do Sistema';
    const html = options.html || options.body || '';

    const socket = tls.connect(465, 'smtp.gmail.com', { rejectUnauthorized: false }, () => {});

    let step = 0;
    let finished = false;

    const finish = (result) => {
      if (finished) return;
      finished = true;
      try { socket.destroy(); } catch(e) {}
      resolve(result);
    };

    socket.on('data', (data) => {
      const msg = data.toString();

      if (msg.startsWith('220') && step === 0) {
        step = 1;
        socket.write('EHLO localhost\r\n');
      } else if (step === 1 && (msg.includes('250-AUTH') || msg.includes('AUTH LOGIN') || msg.startsWith('250 '))) {
        step = 2;
        socket.write('AUTH LOGIN\r\n');
      } else if (step === 2 && msg.startsWith('334 VXNlcm5hbWU6')) {
        step = 3;
        socket.write(Buffer.from(user).toString('base64') + '\r\n');
      } else if (step === 3 && msg.startsWith('334 UGFzc3dvcmQ6')) {
        step = 4;
        socket.write(Buffer.from(pass).toString('base64') + '\r\n');
      } else if (step === 4 && msg.startsWith('235')) {
        step = 5;
        socket.write('MAIL FROM:<' + from + '>\r\n');
      } else if (step === 5 && msg.startsWith('250')) {
        step = 6;
        socket.write('RCPT TO:<' + to + '>\r\n');
      } else if (step === 6 && msg.startsWith('250')) {
        step = 7;
        socket.write('DATA\r\n');
      } else if (step === 7 && msg.startsWith('354')) {
        step = 8;
        const subjectUtf8 = '=?UTF-8?B?' + Buffer.from(subject).toString('base64') + '?=';
        const fromHeader = '=?UTF-8?B?' + Buffer.from('José Centúrio | SIGEC-Pro').toString('base64') + '?= <' + from + '>';
        const emailContent = 
          'From: ' + fromHeader + '\r\n' +
          'To: ' + to + '\r\n' +
          'Subject: ' + subjectUtf8 + '\r\n' +
          'MIME-Version: 1.0\r\n' +
          'Content-Type: text/html; charset=UTF-8\r\n' +
          'Content-Transfer-Encoding: base64\r\n' +
          '\r\n' +
          Buffer.from(html).toString('base64') + '\r\n' +
          '.\r\n';
        socket.write(emailContent);
      } else if (step === 8 && msg.startsWith('250')) {
        step = 9;
        socket.write('QUIT\r\n');
        finish({ success: true, message: 'Email enviado com sucesso via Google SMTP corporativo!' });
      } else if (msg.startsWith('5') || msg.startsWith('4')) {
        finish({ success: false, message: msg.trim() });
      }
    });

    socket.on('error', (err) => finish({ success: false, message: err.message }));
    setTimeout(() => finish({ success: false, message: 'Tempo limite excedido ao contactar servidor SMTP' }), 12000);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Endpoint de Envio de Email
  if (pathname === '/api/send-email' || pathname === '/api/send-smtp-email') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Método não permitido' }));
      return;
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const to = payload.to;
        if (!to) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Destinatário em falta' }));
          return;
        }

        let result = { success: false, message: '' };

        // 1. Se houver Webhook HTTPS configurado (Google Apps Script / Cloud)
        const webhookUrl = payload.webhookUrl || process.env.EMAIL_WEBHOOK_URL;
        if (webhookUrl && webhookUrl.startsWith('https://')) {
          try {
            const wResp = await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                to: to,
                subject: payload.subject,
                html: payload.html || payload.body,
                body: payload.body || ''
              })
            });
            if (wResp && (wResp.ok || wResp.status === 200 || wResp.status === 302)) {
              result = { success: true, message: 'Email enviado com sucesso via Google Workspace Gateway!' };
            }
          } catch(errW) {
            console.warn('Erro ao disparar webhook:', errW.message);
          }
        }

        // 2. Se não enviado via Webhook, tenta via SMTP direto
        if (!result.success) {
          result = await sendEmailViaSmtp({
            user: payload.smtpUser || payload.user || DEFAULT_SMTP_USER,
            pass: payload.smtpPass || payload.pass || DEFAULT_SMTP_PASS,
            from: payload.smtpUser || payload.user || DEFAULT_SMTP_USER,
            to: to,
            subject: payload.subject,
            html: payload.html || payload.body
          });
        }

        res.writeHead(result.success ? 200 : 500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  // Endpoint de Heartbeat
  if (pathname === '/api/heartbeat') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Ficheiros Estáticos
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  
  let filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback para index.html (SPA)
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao carregar ficheiro.');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`SIGEC-Pro Server ativo na porta ${PORT}`);
});
