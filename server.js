const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
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

const DEFAULT_SMTP_USER = process.env.SMTP_USER || 'jjota26@gmail.com';
const DEFAULT_SMTP_PASS = process.env.SMTP_PASS || Buffer.from('ZGZidWZnZ2Jkc2FlbHpxeQ==', 'base64').toString('utf8');
const DEFAULT_EMAIL_WEBHOOK_URL = process.env.EMAIL_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxV-5cjwpuC-BLJpHaZk8g0234D9apiu5SlTX9VjdeHQG2L0DyoMBWHDbf0_Jo9Kr1LnA/exec';

async function sendEmailViaSmtp(options) {
  const user = options.user || DEFAULT_SMTP_USER;
  const pass = (options.pass || DEFAULT_SMTP_PASS).replace(/\s+/g, '');
  const from = options.from || user;
  const to = options.to;
  const subject = options.subject || '[SIGEC-Pro] Notificação do Sistema';
  const html = options.html || options.body || '';

  const logs = [];
  const log = (m) => { logs.push(m); console.log('[SMTP]', m); };

  function tryPort465() {
    return new Promise((resolve) => {
      log('A tentar Porta 465 (SSL direto com SNI)...');
      let finished = false;
      let timer = null;

      const finish = (result) => {
        if (finished) return;
        finished = true;
        if (timer) clearTimeout(timer);
        try { socket.destroy(); } catch(e) {}
        resolve(result);
      };

      const socket = tls.connect({
        host: 'smtp.gmail.com',
        port: 465,
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false
      }, () => {
        log('Ligação TLS estabelecida na porta 465');
      });

      let step = 0;

      socket.on('data', (data) => {
        const msg = data.toString();
        log('P465 (step ' + step + '): ' + msg.trim().replace(/\r?\n/g, ' | '));

        if (msg.startsWith('220') && step === 0) {
          step = 1;
          socket.write('EHLO localhost\r\n');
        } else if (step === 1 && (msg.includes('250 ') || msg.includes('250-AUTH') || msg.includes('AUTH LOGIN'))) {
          step = 2;
          socket.write('AUTH LOGIN\r\n');
        } else if (step === 2 && msg.startsWith('334')) {
          step = 3;
          socket.write(Buffer.from(user).toString('base64') + '\r\n');
        } else if (step === 3 && msg.startsWith('334')) {
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
          const senderName = 'SIGEC-Pro • Sistema Integrado de Clientes & Projetos';
          const maskEmail = 'no-reply@sigec-pro.com';
          const fromHeader = '=?UTF-8?B?' + Buffer.from(senderName).toString('base64') + '?= <' + user + '>';
          const emailContent = 
            'From: ' + fromHeader + '\r\n' +
            'Reply-To: <' + maskEmail + '>\r\n' +
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
          log('P465 erro SMTP: ' + msg.trim());
          finish({ success: false, message: msg.trim() });
        }
      });

      socket.on('error', (err) => {
        const desc = (err && (err.code || err.message || err.name || String(err))) || 'Erro de socket';
        log('P465 erro: ' + desc);
        finish({ success: false, message: 'P465: ' + desc });
      });

      socket.on('close', (hadError) => {
        if (!finished && step < 8) {
          log('P465 fechado prematuramente');
          finish({ success: false, message: 'P465: Socket fechado prematuramente' });
        }
      });

      timer = setTimeout(() => {
        log('P465 timeout');
        finish({ success: false, message: 'P465: Tempo limite excedido' });
      }, 7000);
    });
  }

  function tryPort587() {
    return new Promise((resolve) => {
      log('A tentar Porta 587 (STARTTLS com SNI)...');
      let finished = false;
      let timer = null;
      let secureSocket = null;

      const finish = (result) => {
        if (finished) return;
        finished = true;
        if (timer) clearTimeout(timer);
        try { rawSocket.destroy(); } catch(e) {}
        if (secureSocket) { try { secureSocket.destroy(); } catch(e) {} }
        resolve(result);
      };

      const rawSocket = net.connect(587, 'smtp.gmail.com', () => {
        log('Ligação TCP estabelecida na porta 587');
      });

      let step = 0;

      rawSocket.on('data', (d) => {
        const msg = d.toString();
        log('P587 raw (step ' + step + '): ' + msg.trim().replace(/\r?\n/g, ' | '));

        if (msg.startsWith('220') && step === 0) {
          step = 1;
          rawSocket.write('EHLO localhost\r\n');
        } else if (step === 1 && msg.includes('STARTTLS')) {
          step = 2;
          rawSocket.write('STARTTLS\r\n');
        } else if (step === 2 && msg.startsWith('220')) {
          step = 3;
          log('A negociar TLS na porta 587...');
          secureSocket = tls.connect({
            socket: rawSocket,
            host: 'smtp.gmail.com',
            servername: 'smtp.gmail.com',
            rejectUnauthorized: false
          }, () => {
            log('TLS estabelecido com sucesso na porta 587');
            secureSocket.write('EHLO localhost\r\n');
          });

          secureSocket.on('data', (sd) => {
            const sMsg = sd.toString();
            log('P587 secure (step ' + step + '): ' + sMsg.trim().replace(/\r?\n/g, ' | '));

            if (step === 3 && (sMsg.includes('250 ') || sMsg.includes('AUTH LOGIN'))) {
              step = 4;
              secureSocket.write('AUTH LOGIN\r\n');
            } else if (step === 4 && sMsg.startsWith('334')) {
              step = 5;
              secureSocket.write(Buffer.from(user).toString('base64') + '\r\n');
            } else if (step === 5 && sMsg.startsWith('334')) {
              step = 6;
              secureSocket.write(Buffer.from(pass).toString('base64') + '\r\n');
            } else if (step === 6 && sMsg.startsWith('235')) {
              step = 7;
              secureSocket.write('MAIL FROM:<' + from + '>\r\n');
            } else if (step === 7 && sMsg.startsWith('250')) {
              step = 8;
              secureSocket.write('RCPT TO:<' + to + '>\r\n');
            } else if (step === 8 && sMsg.startsWith('250')) {
              step = 9;
              secureSocket.write('DATA\r\n');
            } else if (step === 9 && sMsg.startsWith('354')) {
              step = 10;
              const subjectUtf8 = '=?UTF-8?B?' + Buffer.from(subject).toString('base64') + '?=';
              const senderName = 'SIGEC-Pro • Sistema Integrado de Clientes & Projetos';
              const maskEmail = 'no-reply@sigec-pro.com';
              const fromHeader = '=?UTF-8?B?' + Buffer.from(senderName).toString('base64') + '?= <' + user + '>';
              const emailContent = 
                'From: ' + fromHeader + '\r\n' +
                'Reply-To: <' + maskEmail + '>\r\n' +
                'To: ' + to + '\r\n' +
                'Subject: ' + subjectUtf8 + '\r\n' +
                'MIME-Version: 1.0\r\n' +
                'Content-Type: text/html; charset=UTF-8\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                Buffer.from(html).toString('base64') + '\r\n' +
                '.\r\n';
              secureSocket.write(emailContent);
            } else if (step === 10 && sMsg.startsWith('250')) {
              step = 11;
              secureSocket.write('QUIT\r\n');
              finish({ success: true, message: 'Email enviado com sucesso via Google SMTP (Porta 587)!' });
            } else if (sMsg.startsWith('5') || sMsg.startsWith('4')) {
              log('P587 erro SMTP: ' + sMsg.trim());
              finish({ success: false, message: sMsg.trim() });
            }
          });

          secureSocket.on('error', (err) => {
            const desc = (err && (err.code || err.message || err.name || String(err))) || 'Erro secure';
            log('P587 secure erro: ' + desc);
            finish({ success: false, message: 'P587 secure: ' + desc });
          });
        }
      });

      rawSocket.on('error', (err) => {
        const desc = (err && (err.code || err.message || err.name || String(err))) || 'Erro raw';
        log('P587 raw erro: ' + desc);
        finish({ success: false, message: 'P587 raw: ' + desc });
      });

      timer = setTimeout(() => {
        log('P587 timeout');
        finish({ success: false, message: 'P587: Tempo limite excedido' });
      }, 10000);
    });
  }

  let result = await tryPort465();
  if (!result.success) {
    log('Canal 465 falhou (' + result.message + '). A tentar Canal 587 STARTTLS...');
    result = await tryPort587();
  }
  result.logs = logs;
  return result;
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

        // 1. Se houver Webhook HTTPS configurado válido
        const webhookUrl = (payload.webhookUrl || process.env.EMAIL_WEBHOOK_URL || DEFAULT_EMAIL_WEBHOOK_URL || '').trim();
        if (webhookUrl && webhookUrl.startsWith('https://') && !webhookUrl.includes('AKfycbx5sgU7FzCL5uZdpyzhyqYlIiTYg6tT1g-Rs36apcOvIhXtxc1eAPNPLKQwVOZ7aFS7BQ')) {
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

        if (!result.message) {
          result.message = result.success ? 'Email enviado com sucesso via Google SMTP!' : 'Falha no envio via Google SMTP.';
        }

        res.writeHead(result.success ? 200 : 500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: err.message || 'Erro interno no servidor' }));
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
