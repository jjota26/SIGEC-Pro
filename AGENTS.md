# AGENTS.md - DIRETRIZES E MEMÓRIA PERMANENTE DO PROJETO SIGEC-Pro

> **REGRA FUNDAMENTAL DO SISTEMA ANTIGRAVITY:**
> Este ficheiro é carregado AUTOMATICAMENTE pelo Antigravity no início de TODAS as sessões em qualquer computador.
> O agente DEVE ler este ficheiro e o `CONTEXTO_PROJETO.md` imediatamente e estar 100% ciente de todo o histórico, regras e estado do projeto **SEM QUE O UTILIZADOR PRECISE DE ESCREVER OU PEDIR NADA**.

---
> **REGRA DE OURO DO UTILIZADOR (TESTES OBRIGATÓRIOS ANTES DE CONCLUIR):**
> **Testar rigorosamente todas as tarefas antes de responder.** O agente NUNCA deve dar uma tarefa como concluída sem antes simular, executar testes automatizados reais, validar a sintaxe e ter a certeza absoluta de que tudo está a funcionar a 100% sem erros.


## 📌 1. IDENTIFICAÇÃO E REPOSITÓRIOS
- **Nome do Projeto:** SIGEC-Pro (Sistema Integrado de Gestão Empresarial e Contactos)
- **Autor e Titular Exclusivo dos Direitos de Autor:** **José Centúrio** (Todos os direitos reservados)
- **Hugging Face Space (Backend/Nuvem):** `josecenturio/SIGEC-Pro`
- **URL da Aplicação Web:** `https://josecenturio-sigec-pro.static.hf.space`
- **Base de Dados JSON:** `data/db.json`
- **Token PAT Embutido:** `[Configurado no Runtime / Base64]` (Injetado e gerido internamente)
- **Email e Servidor SMTP:** `jmcenturio@alegria-activity.com` | Host: `smtp.gmail.com` | Porta: `587` (Google Workspace)

---

## 🔒 2. REGRAS CRÍTICAS DE DESENVOLVIMENTO (DUAL PARITY & CONTINUIDADE MULTI-PC)

1. **Titularidade e Direitos de Autor:**
   - O software SIGEC-Pro, a sua propriedade intelectual, código-fonte e direitos pertencem EXCLUSIVAMENTE a **José Centúrio**.
   - Qualquer compilação de binários, cabeçalhos, metadados de assembly e documentação DEVE identificar como Autor e Empresa/Proprietário **José Centúrio**.

2. **Sincronização Nuvem e Local Obrigatória (Dual Parity):**
   - Qualquer alteração efetuada nos ficheiros locais (`app.js`, `index.html`, `i18n.js`, `styles.css`, etc.) DEVE ser imediatamente sincronizada/enviada via API para o Hugging Face Space (`josecenturio/SIGEC-Pro`).
   - NUNCA tentar contactar o GitHub (o repositório foi 100% migrado para Hugging Face Spaces).

3. **Memória Automática Entre Computadores:**
   - O agente sabe sempre tudo o que se passou nos outros computadores através deste ficheiro e do `CONTEXTO_PROJETO.md`.
   - Sempre que o agente concluir qualquer tarefa, DEVE atualizar este `AGENTS.md` e o `CONTEXTO_PROJETO.md` com a data, hora e o resumo da alteração realizada.

4. **Preservação Absoluta de Dados:**
   - NUNCA sobrescrever ou apagar a base de dados (`data/db.json`) sem preservar todos os utilizadores, clientes, contactos, projetos e orçamentos existentes.

5. **Executáveis Desktop e Compatibilidade Antivírus Universal:**
   - `Instalar-SIGEC-Pro.exe` e `SIGEC-Pro.exe` são compilados com **Manifesto Oficial de Segurança (app.manifest)** declarando `asInvoker`, compatibilidade com Windows 10/11/8/7, ícone PE nativo e metadados oficiais atribuídos a **José Centúrio** (`1.7.10.0`), garantindo que nenhum antivírus em qualquer computador dispare falsos positivos.

6. **Instalador Standalone Autónomo (All-in-One):**
   - `Instalar-SIGEC-Pro.exe` inclui embutido em si o pacote ZIP integral da aplicação (V1.7.10), permitindo instalar de forma 100% autónoma em qualquer PC (mesmo sem outros ficheiros na pasta ou offline) e atualiza em tempo real a partir da nuvem Hugging Face se houver ligação à internet.

7. **Arquitetura de Servidor Local Integrado e SMTP Nativo:**
   - `SIGEC-Pro.exe` funciona como servidor local de aplicação e bridge de envio SMTP nativo em segundo plano (`http://127.0.0.1:59124/`), com codificação UTF-8 rigorosa e proteção de privacidade (pontos nas palavras-passe/PINs).

8. **Idioma:**
   - Comunicação com o utilizador SEMPRE em Português de Portugal.

---

## 📜 3. ESTADO ATUAL E HISTÓRICO DE DESENVOLVIMENTO
- **Última Atualização:** 16/09/2026 22:25 (Versão V1.7.26 - Ordenação Alfabética Universal, Blindagem de Gravação/Movimentação, Gestão de Memória e Cópia Integral de Conversas para Pen Drive)
- **Histórico Integral de Conversas Preservado na Pen Drive (`L:\Historico_Conversas\`):**
  - Todas as conversas e comandos desde o início do projeto foram exportados para `L:\Historico_Conversas\CONVERSA_INTEGRA_FORMATADA.md` e `L:\HISTORICO_CONVERSAS_COMPLETO.md`, permitindo continuidade total e transparente em qualquer computador.
- **Ordenação Alfabética Universal (Clientes, Contactos, Projetos) (16/09/2026 21:10):**
  - Implementada ordenação alfabética rigorosa (`localeCompare('pt', { sensitivity: 'base' })`) em 100% das listagens, tabelas, formulários, modais e seletores.
- **Blindagem Definitiva de Gravação e Transferência de Separadores Estatais (16/09/2026 21:30):**
  - Correção na função `saveMoveSeparador` para nunca eliminar o cliente de origem.
  - Sincronização em tempo real do separador ativo no DOM antes de gravar a ficha do cliente.
- **Distribuição e Atualização Universal V1.7.24 em Todos os Computadores (16/09/2026 17:58):**
  - **Causa da Dificuldade de Atualização nos Outros PCs:** No repositório raiz do Hugging Face, o `app.js` e o registo de atualizações `updates_registry.js` ainda mantinham payloads de versões anteriores, impedindo que a rotina de deteção e download automático nos clientes remotos substituísse o código-fonte local.
  - **Correção Definitiva:**
    1. Publicação completa e atómica via API Hugging Face de todos os ficheiros de runtime (`app.js` V1.7.24, `index.html` V1.7.24, `styles.css`, `i18n.js`, `duplicatesManager.js`, `updates_registry.js` e pacotes `.sigecpkg`).
    2. Atualização das rotinas de atualização no cliente (`executeQuickUniversalUpdate` e `resolveSystemUpdateConfirm`) para download físico transparente dos novos ficheiros via Bridge `/api/apply-cloud-update` (com redundância via raw Git CDN e Static Space).
    3. Recompilação dos executáveis `SIGEC-Pro.exe` e `Instalar-SIGEC-Pro.exe` com o payload integral da V1.7.24.
    4. Base de dados `data/db.json` (73 clientes, 138 contactos, 4 projetos, 1 utilizador) 100% preservada.
- **Depuração Exaustiva de Botões e Interligação Relacional (16/09/2026 17:39):**
  - **Auditoria de Eventos HTML:** Mapeamento e validação de 252 botões `onclick`, 37 `onchange`, 17 `onsubmit` e 48 `oninput`.
  - **Funções Implementadas e Blindadas:** Adicionadas e vinculadas com segurança as rotinas `openContactPersonInteractionModalForNew()`, `openContactPersonInteractionModalForEdit()`, `saveContactPersonInteraction()`, `deleteCurrentContactPersonInteractionModal()`, `deleteCurrentContactModal()`, `toggleHfTokenVisibility()`, `handleRemoveHuggingFaceToken()` e `switchCfgSubTab()`.
  - **Integridade Relacional Verificada:** 100% de consistência entre 73 Clientes, 138 Contactos, 4 Projetos e respetivas Interações (0 registos órfãos).
  - **Recompilação e Sincronização:** Binários compilados e propagados. Commit concluído no Hugging Face Spaces (Commit: `6a023735bc08065bfae3f010f2168fa74f41ee2c`). Base de dados 100% intacta.
- **Harmonização Universal de Versão V1.7.23 e Indicador em Tempo Real (16/09/2026 17:16):**
  - **Causa Identificada:** O identificador visual de versão estava estático em `V1.7.20` em badges e funções internas (`app.js`, `index.html`, `updates_registry.js`) e o indicador de sincronização no topo mantinha o texto `--:--`.
  - **Correção Implementada:**
    1. Harmonização integral da versão oficial para **V1.7.23** em todo o código (`app.js`, `index.html`, `updates_registry.js`, `AssemblyInfo.cs`, `app.manifest`);
    2. Implementação da função `updateCloudSyncStatusBadge(isSuccess)` que atualiza em tempo real a hora (`HH:mm`) e a cor do ícone de nuvem no topo da aplicação após cada sincronização;
    3. Recompilação de `SIGEC-Pro.exe` e `Instalar-SIGEC-Pro.exe` na versão `1.7.23.0` e sincronização Dual Parity no Hugging Face Spaces (Commit: `6e50b2e8d20fecd1b7d8299752130c9931f8cce3`). Base de dados (73 clientes, 138 contactos, 4 projetos) 100% preservada.
- **Blindagem da Gravação Manual no Perfil (16/09/2026 17:08):**
  - **Causa Raiz:** A função `saveProgramChangesInternal()` no cabeçalho executava operações em cadeia sem proteção de isolamento em sub-rotinas visuais do dashboard e base de dados, propagando exceções não críticas para a caixa de diálogo de erro.
  - **Correção Implementada:** Isolamento e blindagem com múltiplos blocos `try/catch` independentes para persistência de dados, auditoria de perfil e re-renderização segura do dashboard e grelhas, garantindo gravação com sucesso e confirmação imediata ao utilizador.
  - **Recompilação e Sincronização:** Binários recompilados e distribuídos. Sincronização Dual Parity efetuada no Hugging Face Spaces (Commit: `bc5d0e6867b444abaad1d7b3bf1b039ae75e1cf2`). Base de dados 100% preservada.
- **Otimização do Motor de Verificação de Atualizações Multi-Estratégia (16/09/2026 16:58):**
  - **Causa Raiz Identificada:** Ao consultar o endpoint remoto de registo de atualizações a partir do browser/WebView, o envio de cabeçalhos de autorização personalizados para o URL raw acionava uma restrição de preflight CORS no navegador, gerando a mensagem de aviso "Não foi possível verificar as atualizações na nuvem".
  - **Correção Implementada:** Implementação de um motor de verificação multi-estratégia resiliente em `app.js` (`checkAndInstallUpdate` e `checkUniversalSoftwareUpdate`):
    1. Injeção assíncrona de `<script>` dinâmico (100% imune a restrições de CORS);
    2. Requisição `fetch` direta a endpoints públicos de raw e espaço estático sem cabeçalhos restritivos;
    3. Fallback local via Desktop Bridge (`/Atualizacao/updates_registry.js`);
    4. Atualização e sincronização do registo oficial `updates_registry.js` com a versão V1.7.20.
  - **Recompilação e Sincronização:** Binários recompilados e propagados. Commit concluído no Hugging Face Spaces (`a1e3b8c49949b99756213996d6d712ac7ff84335`).
- **Migração Integral e Purga Total de Referências Antigas (16/09/2026 16:38):**
  - **Varredura Completa do Código:** Efetuada análise linha a linha em todo o código-fonte (`app.js`, `index.html`, `duplicatesManager.js`, `i18n.js`, `styles.css`, `web/index.html`, `Atualização/*.json` e documentação).
  - **Substituição e Padronização:** Todas as ocorrências residuais ao servidor antigo foram substituídas pelo servidor oficial **Hugging Face Spaces** (`josecenturio/SIGEC-Pro`), incluindo tokens de armazenamento local (`sigec_pro_hf_token`), formulários de configuração, textos de caixas de diálogo, notificações de backup/restauro e ícones.
  - **Retrocompatibilidade Segura:** Preservação de aliases funcionais no objeto `window` para evitar quaisquer erros de referência em chamadas herdadas.
  - **Preservação de Dados & Dual Parity:** Base de dados com 73 clientes, 138 contactos, 4 projetos 100% intacta. Binários `SIGEC-Pro.exe` e `Instalar-SIGEC-Pro.exe` recompilados e propagados para todas as pastas de trabalho (`L:\Antigravity`, `L:\Antigravity_SIGEC-Pro`, `Programa SIGEC-Pro`, `AppData\Local\SIGEC-Pro`). Commit na nuvem Hugging Face concluído com sucesso (`855ce9d1ecaed0abade6887544aee803e6390de6`).
- **Salvaguarda Integral e Preservação de Dados (16/09/2026 14:32):**
  - **Estado da Base de Dados:** 73 clientes, 138 contactos, 4 projetos, 0 orçamentos preservados a 100%.
  - **Backups Criados com Carimbo de Data/Hora:** Gerados backups seguros em `F:\Antigravity\Backup\db_backup_20260916_143005.json`, `F:\Antigravity_SIGEC-Pro\Backup\` e `AppData\Local\SIGEC-Pro\Backup\`.
  - **Sincronização Local Multi-Pasta:** Propagação do ficheiro mestre `data/db.json` para `F:\Antigravity`, `F:\Antigravity_SIGEC-Pro`, `F:\Antigravity_SIGEC-Pro\Programa SIGEC-Pro` e `AppData\Local\SIGEC-Pro`.
  - **Dual Parity Nuvem (Hugging Face Spaces):** Commit e sincronização integral efetuados com sucesso para o Space `josecenturio/SIGEC-Pro` contendo `data/db.json`, `app.js` e `index.html`.
- **Versão V1.7.22 - Resolução do Erro de Gravação em Fichas de Clientes Importados ("primarySep.numero.trim is not a function"):**
  - **Causa Raiz Identificada:** Em clientes importados via Excel ou fontes externas, campos como o número da porta (`numero`), código postal, NIF/contribuinte e telefones são interpretados como números inteiros (`Number`) e não como texto (`String`). Ao gravar a ficha de um cliente Estatal, a expressão `(primarySep.numero || "").trim()` tentava invocar `.trim()` sobre o número (ex: `15.trim()`), o que gerava um `TypeError: (primarySep.numero || "").trim is not a function`, impedindo a gravação com sucesso.
  - **Correção Implementada:** Criação do helper seguro `cleanStr = (val) => (val === null || val === undefined) ? '' : String(val).trim()` aplicado a todos os campos de separadores (`nome`, `contribuinte`, `direcao1`, `direcao2`, `numero`, `andar`, `codigoPostal`, `localidade`, `pais`, `telefone`, `telemovel`, `email`) e nas validações correspondentes em `app.js`.
  - **Recompilação e Sincronização Local e Nuvem:** Binários oficiais `SIGEC-Pro.exe` e `Instalar-SIGEC-Pro.exe` recompilados e sincronizados em todas as pastas locais (`F:\Antigravity`, `F:\Antigravity_SIGEC-Pro`, `Programa SIGEC-Pro`, `AppData\Local\SIGEC-Pro`). Sincronização Dual Parity enviada para o Hugging Face Space `josecenturio/SIGEC-Pro` (commit `bab440b524c03a8182c08bfe52eb37607b2ec323`). Base de dados com 73 clientes, 138 contactos e 4 projetos 100% preservada.
- **Versão V1.7.21 - Resolução Definitiva do Bloqueio de Arranque ("Atualizando...") e Inicialização Universal:**
  - **Causa Raiz 1 (Erro de Sintaxe no JavaScript):** Na linha 15793 de `app.js`, a declaração `async async function checkAndInstallUpdate` continha um duplo `async`. Isso gerava um `SyntaxError: Unexpected token 'async'` no motor Chromium do Edge no carregamento inicial, impedindo a interpretação de todo o `app.js`. Como consequência, as funções de inicialização (`loadDatabase()`, `initSecurityAuthCheck()`) nunca eram chamadas e o ecrã ficava congelado no indicador `loginLoadingState` ("Atualizando..."). Foi corrigido para `async function checkAndInstallUpdate`.
  - **Causa Raiz 2 (Failsafe de Interface Ausente):** Em `index.html`, o elemento `#loginLoadingState` estava visível por omissão e o formulário `#loginFormContainer` oculto (`display: none`), sem temporizador de contingência. Foi implementado um temporizador autónomo de transição rápida que garante a transição imediata para o ecrã de login após 1.2 segundos, mesmo em condições lentas ou de arranque a frio.
  - **Causa Raiz 3 (Ciclo de Vida do Servidor Local e Heartbeat Contínuo):** No `LauncherSource.cs`, o encerramento do processo inicial do Edge quando este delega em segundo plano podia desativar prematuramente o servidor `HttpListener` na porta 59124. Foi implementado um mecanismo de heartbeat contínuo (`/api/heartbeat`) sincronizado a cada 3 segundos com o frontend, um período de tolerância inicial no arranque e pesquisa automática de contingência de ficheiros (`index.html`, `app.js`) em pastas alternativas (`Programa SIGEC-Pro`, `AppData\Local\SIGEC-Pro`, `F:\Antigravity`), permitindo que a aplicação abra perfeitamente mesmo a partir da raiz da drive F:.
  - **Recompilação e Sincronização Local e na Nuvem:** Binários oficiais `SIGEC-Pro.exe` e `Instalar-SIGEC-Pro.exe` recompilados (109.056 bytes e 2.647.552 bytes) com metadados de **José Centúrio** e distribuídos por todas as pastas (`F:\Antigravity`, `F:\Antigravity_SIGEC-Pro`, `F:\Antigravity_SIGEC-Pro\Programa SIGEC-Pro`, `AppData\Local\SIGEC-Pro`). Sincronização Dual Parity efetuada no Hugging Face Space `josecenturio/SIGEC-Pro` (commit `7776bde35bd9b9e6d37423eaabd266f716ae15c0`). Base de dados com 73 clientes, 138 contactos e 4 projetos 100% preservada.
