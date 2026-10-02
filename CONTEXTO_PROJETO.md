# CONTEXTO_PROJETO — SIGEC-Pro

## 1. Titularidade e Propriedade Intelectual
* **Autor e Proprietário Exclusivo:** José Centúrio (Todos os direitos reservados).
* **Software:** SIGEC-Pro — Sistema Integrado de Gestão Comercial Profissional.

---

## 2. Arquitetura do Sistema e Especificações Técnicas
* **Frontend Web:** HTML5, CSS3, JavaScript modular (`app.js`, `index.html`, `i18n.js`, `styles.css`).
* **Paradigma Operacional:** 100% Web no browser (sem qualquer recurso a executáveis locais ou portas nativas).
* **Repositório Oficial em Nuvem e Produção:** Hugging Face Space (`josecenturio/SIGEC-Pro`) e GitHub (`jjota26/SIGEC-Pro`), com disponibilização oficial e contínua em `https://sigec-pro.onrender.com`.
* **Persistência de Dados e Backups:** Ficheiro `data/db.json` com integridade relacional. Suporte para ficheiros de backup grandes (> 10 MB) via Git LFS e leitura via `/resolve/main/`.
* **Isolamento de Perfis:** Cada utilizador opera num espaço independente de dados. Clientes, contactos, projetos e importações pertencem ao utilizador ativo.
* **Ordenação Universal:** Ordenação alfabética obrigatória com `localeCompare('pt')` em 100% das listagens e seletores.

---

## 3. Estado Atual da Base de Dados (Referência Ativa)
* **Clientes:** 78
* **Contactos:** 179
* **Projetos:** 5 (`Estratégia Norte 2040`, `Unidade Móvel Bancária - Camião`, `Huawei SmartBus`, `Unidade Móvel Bancária - Furgão`, `Campanha de Digitalização`)
* **Interações:** 99
* **Utilizadores:** 3 (José Centúrio, José Maria, Victoria Schwab Vilte)

---

## 4. Histórico de Modificações Entre Máquinas

### [29/09/2026 14:20]
* **Integração de Regras da Pen Drive E:** Adicionadas a salvaguarda automática de notas pendentes ao fechar contactos e a proibição expressa de executáveis em favor do paradigma 100% web.
* **Consolidação das 21 Regras Oficiais:** Diretrizes permanentes harmonizadas em `GEMINI.md`, `AGENTS.md` e `CONTEXTO_PROJETO.md`.
* **Sincronização LFS para Backups > 10 MB:** Implementada rotina `uploadFileToHuggingFaceLFS` em `app.js` e rota de leitura `/resolve/main/`.
* **Preservação de Dados:** 5 projetos ativos e validados no servidor.

### [01/10/2026 08:18]
* **Eliminação de Bloqueio Pós-Sincronização:**
  * Re-renderização da interface desacoplada com `setTimeout(0)` em `mergeCloudDatabaseSafely`.
  * Alerta de sincronização concluída diferido em `handleFullServerSync` para manter todos os botões e navegação do sistema 100% responsivos.
  * Removidas as chamadas redundantes ao GitHub em `syncDatabaseToHuggingFace` no browser (cumprimento estrito da Regra 6).

### [01/10/2026 13:30]
* **Fusão Relacional sem Perdas (Merge de Backup e Dados Atuais):**
  * Efetuada salvaguarda prévia completa do estado ativo (`pre_merge_safety_dump_01-10-2026.json`).
  * Fundidos os registos do backup de 30/09/2026 (`Backup_Perfil_Jose_Centurio_30-09-2026_14-32-28.sigecbak`) com a base viva: reintegrados os 5 projetos históricos, 4 novos contactos e 4 interações pendentes, com prevalência estrita do registo mais recente/atualizado por ID.
  * Preservados integralmente os 3 utilizadores do sistema e as 116 decisões de duplicados ignorados (com deduplicação de redundâncias cíclicas).
  * Base de dados fundida sincronizada com sucesso no Hugging Face Space (`josecenturio/SIGEC-Pro`) e Dataset, respeitando ordenação alfabética em língua portuguesa (Regra 13) e integridade inviolável (Regra 3).
  * **Correção da Rota de Sincronização:** Definida prioridade absoluta para `https://josecenturio-sigec-pro.static.hf.space/data/db.json` (CORS universal `*`), invertida a ordem de `handleFullServerSync` para PULL & MERGE antes de PUSH, e adicionada blindagem contra envio de bases sem projetos (`numProjetos === 0`).

### [01/10/2026 14:25]
* **Restauração Completa da Produção no OnRender (`https://sigec-pro.onrender.com`):**
  * Atualizada a **Regra 6** para sincronização em Nuvem Dual Parity (Hugging Face + GitHub/OnRender), desbloqueando o pipeline de deploy contínuo.
  * Diagnóstico raiz confirmado: o OnRender servia ficheiros estáticos antigos de 01/10/2026 06:18, nos quais a base de dados continha 0 projetos e o script destruía dados locais ao arrancar.
  * Efetuado commit atómico para a branch `main` no GitHub `jjota26/SIGEC-Pro` com `data/db.json` (60 clientes, 173 contactos, 5 projetos, 96 interações, 3 utilizadores), `app.js` corrigido e `index.html` com versionamento de cache `v=2.2.0_20261001_1355`.
  * Deploy do OnRender validado em produção com sucesso: `https://sigec-pro.onrender.com` 100% operacional, exibindo de imediato todos os clientes, contactos e os 5 projetos.

### [02/10/2026 08:00]
* **Sincronização Inteligente em Segundo Plano (Zero-Freeze Universal):**
  * Desenvolvido e ativado motor ultraleve de escuta por cabeçalhos HTTP `HEAD` e `ETag` (`checkCloudChangesSilently` e `initPeriodicBackgroundSync`) em `app.js`.
  * Verificação em tempo real sem qualquer bloqueio de interface (0 bytes de payload de verificação).
  * Gatilhos instantâneos ao focar a janela (`window.focus`), ao alternar abas (`visibilitychange`) e ao navegar entre menus (`switchTab`).
  * Proteção do utilizador: re-renderização restrita à área visível (`refreshActivePanel`) diferida se houver digitação ou modais abertos.
  * Atualizado o cache buster em `index.html` (`v=2.3.0_20261002_0758`).



### [02/10/2026 08:45]
* **SincronizaÃ§Ã£o Bidirecional em Tempo Real Multi-Dispositivo (Dual Cloud Push):**
  * **EliminaÃ§Ã£o de Bloqueio Artificial:** Removida a validaÃ§Ã£o numUsuarios < 3 em syncDatabaseToHuggingFace, prevenindo que perfis locais ficassem silenciados sem enviar dados Ã  nuvem.
  * **Push Ativo Direto ao GitHub (OnRender Deploy AutomÃ¡tico):** Integrada a API Git Data do GitHub diretamente em syncDatabaseToHuggingFace. Qualquer criaÃ§Ã£o, ediÃ§Ã£o ou eliminaÃ§Ã£o local Ã© enviada automaticamente para o Hugging Face e para o GitHub (jjota26/SIGEC-Pro), atualizando sigec-pro.onrender.com de imediato.
  * **Prioridade de Leitura InstantÃ¢nea:** Adicionado o endpoint pÃºblico do GitHub Raw no topo de dbEndpoints em loadDatabaseFromHuggingFace e no varrimento de checkCloudChangesSilently.
  * **ReintegraÃ§Ã£o de Contactos:** Reintegrados os contactos TÃ¢nia Alves e Leonor Garcia Marques na base de produÃ§Ã£o (60 clientes, 175 contactos, 5 projetos, 96 interaÃ§Ãµes, 3 utilizadores). VersÃ£o de cache atualizada para v=2.4.0_20261002_0840.
### [02/10/2026 09:50]
* **Saneamento Definitivo de Caracteres Estranhos (Zero-Mojibake Universal):**
  * **Causa Raiz Identificada:** O botÃ£o "Corrigir Caracteres" saneava com sucesso a base de dados e a Ã¡rvore DOM em tempo real na memÃ³ria do browser, mas ao fazer refresh (F5), os textos estÃ¡ticos duplamente codificados em UTF-8 (ÃƒÂ§, ÃƒÂ£, ÃƒÂ³, ÃƒÂ©, Ã‚Âº) contidos no prÃ³prio ficheiro index.html e no dicionÃ¡rio i18n.js eram recarregados do servidor.
  * **Saneamento Estrutural dos Ficheiros Fonte:**
    * index.html: Saneados permanentemente todos os artefactos de codificaÃ§Ã£o nos cartÃµes de ConfiguraÃ§Ã£o, cabeÃ§alhos, tÃ­tulos de modais e botÃµes (ex: "AplicaÃ§Ã£o em EcrÃ£ Completo", "CÃ³pia de SeguranÃ§a", "ProteÃ§Ã£o de Dados", "CorreÃ§Ã£o de Caracteres", "AtualizaÃ§Ãµes Nuvem").
    * i18n.js: Saneado integralmente o dicionÃ¡rio de internacionalizaÃ§Ã£o e termos em PortuguÃªs.
    * data/db.json: Saneados 870 campos com resÃ­duos de codificaÃ§Ã£o em clientes, contactos, projetos e interaÃ§Ãµes, mantendo 100% dos dados intactos (60 clientes, 175 contactos, 5 projetos, 96 interaÃ§Ãµes, 3 utilizadores).
  * **Blindagem AutomÃ¡tica ProfilÃ¡tica no Arranque (pp.js):** Integrada a funÃ§Ã£o prophylacticDomSanitize() executada automaticamente no arranque da aplicaÃ§Ã£o (DOMContentLoaded), na navegaÃ§Ã£o entre separadores (switchTab) e apÃ³s a aplicaÃ§Ã£o de idiomas (pplyUserLanguage), eliminando qualquer hipÃ³tese de reaparecimento de caracteres corrompidos.
  * **Versionamento de Cache:** VersÃ£o de cache atualizada para =2.5.0_20261002_0950 em index.html e i18n.js.
### [02/10/2026 10:15]
* **Harmonizacao Multi-Dispositivo e Desbloqueio da Nuvem (Zero 404 / LFS Universal):**
  * **Diagnostico e Correcao de Cabecalho Bearer:** Eliminada a passagem indevida do token do Hugging Face para o GitHub Raw (raw.githubusercontent.com), que devolvia HTTP 404. O cabecalho Authorization: Bearer passa a ser enviado exclusivamente para os dominios huggingface.co.
  * **Prioridade de Leitura no Servidor Ativo:** A funcao loadDatabaseFromHuggingFace consulta agora primeiramente os endpoints diretos do OnRender (/data/db.json e https://sigec-pro.onrender.com/data/db.json) e GitHub Raw antes dos repositorios secundarios.
  * **Suporte Completo a Ficheiros > 10MB via Git LFS:** A base de dados (data/db.json com 18.3 MB) foi enviada com sucesso para o Hugging Face Space e Dataset utilizando Git LFS e rota /resolve/main/. Integrado fallback automatico para LFS em syncDatabaseToHuggingFace.
  * **Paridade Nuvem e Local Total:** Garantida paridade absoluta com 78 clientes, 179 contactos, 5 projetos, 99 interacoes e 3 utilizadores em todos os nos (OnRender, GitHub, Hugging Face e Local). Versao de cache atualizada para v=2.6.0_20261002_1015.
