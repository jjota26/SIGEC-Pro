const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const zlib = require('zlib');

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

const DEFAULT_SMTP_USER = process.env.SMTP_USER || '';
const DEFAULT_SMTP_PASS = process.env.SMTP_PASS || '';
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

  // Endpoint de Pesquisa e Enriquecimento de Morada com IA
  if (pathname === '/api/ai-lookup-address') {
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
        const entityName = (payload.entityName || '').trim();
        const tipoCliente = payload.tipoCliente || 'Privado';
        const ministerio = (payload.ministerio || '').trim();
        const contribuinte = (payload.contribuinte || '').trim();
        const existingWebsite = (payload.existingWebsite || '').trim();
        const geminiApiKey = (payload.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();

        if (!entityName) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, message: 'Nome da entidade não fornecido' }));
          return;
        }

        // 1. Tentar Google Gemini AI com Search Grounding se houver chave
        if (geminiApiKey) {
          try {
            const prompt = `Pesquisa na web o website oficial e a morada completa da sede de: "${entityName}". Contexto: ${tipoCliente === 'Estatal' ? 'Organismo público em Portugal, Ministério: ' + ministerio : 'Entidade em Portugal'}.
Devolve EXCLUSIVAMENTE um objeto JSON válido (sem blocos markdown e sem texto extra) no formato:
{
  "website": "url oficial da entidade",
  "direcao1": "apenas nome da rua, avenida, praça, etc.",
  "direcao2": "edifício, bloco, etc. se houver",
  "numero": "número de porta",
  "andar": "andar ou fração se houver",
  "codigoPostal": "código postal no formato XXXX-XXX",
  "localidade": "cidade ou localidade",
  "pais": "Portugal",
  "fonteUrl": "url oficial de onde a morada foi extraída"
}`;

            const gResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                tools: [{ googleSearch: {} }]
              })
            });

            if (gResp.ok) {
              const gData = await gResp.json();
              const candidateText = gData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              const jsonMatch = candidateText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                  success: true,
                  provider: 'Google Gemini AI (Google Search Grounding)',
                  data: {
                    website: parsed.website || existingWebsite || '',
                    direcao1: parsed.direcao1 || '',
                    direcao2: parsed.direcao2 || '',
                    numero: parsed.numero || '',
                    andar: parsed.andar || '',
                    codigoPostal: parsed.codigoPostal || '',
                    localidade: parsed.localidade || '',
                    pais: parsed.pais || 'Portugal',
                    fonteUrl: parsed.fonteUrl || ''
                  }
                }));
                return;
              }
            }
          } catch (gErr) {
            console.warn('[AI Lookup] Erro Gemini, fallback para motor web:', gErr.message);
          }
        }

        // 2. Consulta a Directórios Oficiais Portugueses (nif.pt / racius.com)
        try {
          const searchTerm = contribuinte || entityName;
          const nifResp = await fetch('https://www.nif.pt/?q=' + encodeURIComponent(searchTerm), {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept-Language': 'pt-PT,pt;q=0.9'
            }
          });
          if (nifResp.ok) {
            const nifHtml = await nifResp.text();
            const cpMatch = nifHtml.match(/\b(\d{4}-\d{3})\b/);
            let nifCp = cpMatch ? cpMatch[1] : '';
            let nifLoc = '';
            if (nifCp) {
              const cpIdx = nifHtml.indexOf(nifCp);
              const after = nifHtml.slice(cpIdx + nifCp.length, cpIdx + nifCp.length + 50);
              const lm = after.match(/^[\s,–—\-]+([A-ZÀ-Úa-zà-ú\s]{3,25})/);
              if (lm) {
                nifLoc = lm[1].trim().split(/[<\n\r,;]/)[0].trim();
              }
            }

            const raciusMatch = nifHtml.match(/href='(https:\/\/www\.racius\.com\/[^']+)'/);
            let nifStreet = '';
            let nifNum = '';
            let raciusUrl = '';
            if (raciusMatch) {
              try {
                raciusUrl = raciusMatch[1];
                const rResp = await fetch(raciusUrl, {
                  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                });
                if (rResp.ok) {
                  const rHtml = await rResp.text();
                  const sm = rHtml.match(/\b((?:Rua|Avenida|Av\.?|Praça|Pr\.?|Largo|Travessa|Alameda|Estrada|Calçada|Campo)\s+[A-ZÀ-Úa-zà-ú0-9\s\–\-ºª\'’]+?)(?:,\s*(?:n\.?[ºo]?\s*)?(\d+[A-Za-z]?))?/i);
                  if (sm) {
                    nifStreet = sm[1].trim().split(/[<\n\r]/)[0].trim();
                    if (sm[2]) nifNum = sm[2];
                  }
                }
              } catch(rErr) {}
            }

            if (nifCp || nifStreet) {
              let officialWebsite = existingWebsite || '';
              if (!officialWebsite && tipoCliente === 'Estatal') officialWebsite = 'https://www.gov.pt';

              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({
                success: true,
                provider: 'Registo Institucional & Web Oficial',
                data: {
                  website: officialWebsite,
                  direcao1: nifStreet,
                  direcao2: '',
                  numero: nifNum,
                  andar: '',
                  codigoPostal: nifCp,
                  localidade: nifLoc,
                  pais: 'Portugal',
                  fonteUrl: raciusUrl || ('https://www.nif.pt/?q=' + encodeURIComponent(searchTerm))
                }
              }));
              return;
            }
          }
        } catch(nErr) {
          console.warn('[AI Lookup] Erro na consulta NIF.pt:', nErr.message);
        }

        // 3. Motor de Varrimento e Extração Web Alternativo (Server-side)
        let query = `${entityName} morada sede contactos Portugal`;
        if (tipoCliente === 'Estatal' && ministerio) {
          query = `${entityName} ${ministerio} morada sede contactos Portugal`;
        }
        if (contribuinte) {
          query += ` NIF ${contribuinte}`;
        }

        const searchUrl = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
        const sResp = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8'
          }
        });

        const html = await sResp.text();
        const snippets = [...html.matchAll(/class="result__snippet[^>]*>([\s\S]*?)<\/a>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
        const rawUrls = [...html.matchAll(/class="result__url"[^>]*href="([^"]+)"/g)].map(m => m[1]);

        const decodedUrls = rawUrls.map(u => {
          try {
            const m = u.match(/uddg=([^&]+)/);
            return m ? decodeURIComponent(m[1]) : u;
          } catch (e) { return u; }
        });

        let detectedWebsite = existingWebsite || '';
        if (!detectedWebsite) {
          for (const u of decodedUrls) {
            if (!u.includes('duckduckgo.com') && 
                !u.includes('google.') && 
                !u.includes('empresite.') && 
                !u.includes('racius.') && 
                !u.includes('einforma.') && 
                !u.includes('facebook.') && 
                !u.includes('linkedin.') &&
                !u.includes('wikipedia.org')) {
              try {
                const parsedU = new URL(u);
                detectedWebsite = parsedU.origin;
                break;
              } catch (e) {}
            }
          }
          if (!detectedWebsite && decodedUrls[0] && !decodedUrls[0].includes('duckduckgo.com')) {
            try { detectedWebsite = new URL(decodedUrls[0]).origin; } catch (e) { detectedWebsite = decodedUrls[0]; }
          }
        }

        const fullText = snippets.join(' \n ');
        const address = {
          direcao1: '',
          direcao2: '',
          numero: '',
          andar: '',
          codigoPostal: '',
          localidade: '',
          pais: 'Portugal'
        };

        // Código Postal
        const cpMatch = fullText.match(/\b(\d{4}-\d{3})\b/);
        if (cpMatch) {
          address.codigoPostal = cpMatch[1];
          const cpIndex = fullText.indexOf(cpMatch[1]);
          const afterCp = fullText.slice(cpIndex + cpMatch[1].length, cpIndex + cpMatch[1].length + 45);
          const locMatch = afterCp.match(/^[\s,–—\-]+([A-ZÀ-Úa-zà-ú\s]{3,25})/);
          if (locMatch) {
            address.localidade = locMatch[1].trim()
              .replace(/\b(?:Tel|Telefone|Fax|Email|Contacto|NIF)\b.*/i, '')
              .replace(/[\.,;].*$/, '')
              .trim();
          }
        }

        // Rua / Avenida / Praça
        const streetMatch = fullText.match(/\b((?:Rua|Avenida|Av\.?|Praça|Pr\.?|Largo|Travessa|Alameda|Estrada|Calçada|Campo)\s+(?:(?:D\.|S\.|Sto\.|Sta\.|Dr\.|Eng\.|Prof\.)|[A-ZÀ-Úa-zà-ú0-9\s\–\-ºª\'’])+?)(?=(?:,\s*(?:n\.º|\d|andar|\d{4}-\d{3})|,(?!\s*[A-ZÀ-Úa-zà-ú])|\n|\d{4}-\d{3}|$))/i);
        if (streetMatch) {
          let street = streetMatch[1].trim();
          const streetDateRegex = /\b(\d{1,2}(?:º)?\s+de\s+(?:Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro))\b/i;
          const dateMatch = street.match(streetDateRegex);
          let searchStreet = street;
          if (dateMatch) {
            searchStreet = street.replace(dateMatch[0], '###DATE###');
          }
          const numInside = searchStreet.match(/\b(?:n\.?[ºo]?\s*)?(\d+[A-Za-z]?)\b/i);
          if (numInside && !address.numero) {
            address.numero = numInside[1];
            street = street.replace(new RegExp('\\b' + numInside[0] + '\\b'), '').replace(/\s+,$/, '').trim();
          }
          address.direcao1 = street;
        }

        // Número de porta
        if (!address.numero) {
          const numMatch = fullText.match(/\b(?:n\.?[ºo]?|número|no\.)\s*(\d+[A-Za-z]?)\b/i) || fullText.match(/,\s*(\d+[A-Za-z]?)\s*,/);
          if (numMatch) address.numero = numMatch[1];
        }

        // Andar
        const andarMatch = fullText.match(/\b(\d+[ºªo]\s*(?:andar|Dto|Esq|Frt|frente)?|R\/C|rés-do-chão)\b/i);
        if (andarMatch) address.andar = andarMatch[1];

        // Localidade Fallback
        if (!address.localidade) {
          const cities = ['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Aveiro', 'Faro', 'Setúbal', 'Leiria', 'Viseu', 'Viana do Castelo', 'Évora', 'Guimarães', 'Funchal', 'Ponta Delgada'];
          for (const city of cities) {
            if (new RegExp('\\b' + city + '\\b', 'i').test(fullText)) {
              address.localidade = city;
              break;
            }
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          provider: 'Web Search Engine',
          data: {
            website: detectedWebsite,
            direcao1: address.direcao1,
            direcao2: address.direcao2,
            numero: address.numero,
            andar: address.andar,
            codigoPostal: address.codigoPostal,
            localidade: address.localidade,
            pais: address.pais || 'Portugal',
            fonteUrl: decodedUrls[0] || 'https://duckduckgo.com'
          }
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: 'Erro na pesquisa: ' + (err.message || String(err)) }));
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

  // Endpoint de Gravação de Base de Dados (sigec-pro.onrender.com)
  if (pathname === '/api/save-db-json') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Método não permitido' }));
      return;
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (Array.isArray(parsed.usuarios)) {
          const seenIds = new Set();
          const seenEmails = new Set();
          parsed.usuarios = parsed.usuarios.filter(function(u) {
            if (!u || !u.id) return false;
            const uId = String(u.id).trim();
            const uEmail = String(u.email || '').trim().toLowerCase();
            if (seenIds.has(uId)) return false;
            if (uEmail && seenEmails.has(uEmail)) return false;
            seenIds.add(uId);
            if (uEmail) seenEmails.add(uEmail);
            return true;
          });
        }
        const dbPath = path.join(__dirname, 'data', 'db.json');
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'Base de dados gravada com sucesso no servidor', version: Date.now() }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: err.message || 'Erro ao gravar base de dados' }));
      }
    });
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
      const acceptEncoding = (req.headers['accept-encoding'] || '').toLowerCase();
      const isCompressible = contentType.includes('text') ||
                             contentType.includes('javascript') ||
                             contentType.includes('json') ||
                             contentType.includes('svg');

      if (acceptEncoding.includes('gzip') && isCompressible) {
        zlib.gzip(content, (gzErr, zipped) => {
          if (!gzErr && zipped) {
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Encoding': 'gzip',
              'Vary': 'Accept-Encoding'
            });
            res.end(zipped);
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
          }
        });
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`SIGEC-Pro Server ativo na porta ${PORT}`);
});
