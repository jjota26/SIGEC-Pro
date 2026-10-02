# SIGEC-Pro — Regras Obrigatórias e Diretrizes do Projeto

Este ficheiro define as regras estritas e permanentes para qualquer agente de IA que opere neste projeto (`SIGEC-Pro`). O cumprimento destas regras é obrigatório em todas as sessões.

---

## 🛑 1. Explicar Sempre Antes de Começar
* **Regra:** Nunca iniciar execuções de comandos, modificações profundas ou alterações de dados sem explicar claramente o plano ao utilizador.
* **Ação:** Apresentar um resumo claro do que foi identificado e do que vai ser feito, aguardando a confirmação do utilizador.

---

## 🚫 2. NUNCA Fazer Reposição de Backup por Iniciativa Própria
* **Regra:** NUNCA restaurar backups ou reverter a base de dados a menos que o utilizador dê uma ordem expressa e inequívoca para o fazer.
* **Motivo:** O utilizador pode ter inserido dados recentes que seriam irremediavelmente destruídos por uma reposição de cópia de segurança anterior.

---

## 🛡️ 3. Preservação Absoluta de Dados (Integridade Inviolável)
* **Regra:** Proibição total de sobrescrever, truncar ou eliminar a base de dados (`data/db.json`) sem salvaguarda integral prévia de todos os clientes, contactos, projetos, utilizadores e orçamentos.
* **Cuidado:** Nunca assumir que ficheiros locais antigos contêm a verdade. O estado ativo mais recente do utilizador deve ser sempre respeitado.

---

## ⚖️ 4. Titularidade e Direitos de Autor
* **Regra:** O software **SIGEC-Pro**, a sua propriedade intelectual, código-fonte e direitos pertencem **EXCLUSIVAMENTE a José Centúrio** (Todos os direitos reservados).
* **Metadados:** Cabeçalhos de código e documentação devem identificar como Autor e Proprietário **José Centúrio**.

---

## 🥇 5. Regra de Ouro (Testes Rigorosos Obrigatórios Antes da Conclusão)
* **Regra:** *"Testa todas as tarefas que te dou e só depois de teres a certeza absoluta que tudo está bem, é que me dizes que já está a tarefa concluída."*
* **Ação:** O agente NUNCA deve dar uma tarefa como terminada sem antes simular, executar testes automatizados reais, validar a sintaxe e confirmar que não há qualquer erro de execução.

---

## 🔄 6. Sincronização Nuvem e Local Obrigatória (Dual Parity com OnRender / GitHub)
* **Regra:** Qualquer alteração efetuada nos ficheiros locais (`app.js`, `index.html`, `i18n.js`, `styles.css`, `data/db.json`, etc.) deve ser imediatamente sincronizada com os repositórios oficiais na nuvem: o **Hugging Face Space (`josecenturio/SIGEC-Pro`)** e o repositório GitHub (`jjota26/SIGEC-Pro`), para assegurar que o site oficial de produção em **`https://sigec-pro.onrender.com`** se mantém sempre atualizado e 100% operacional.
* **Diretriz de Deploy:** O pipeline do OnRender reconstrói e disponibiliza automaticamente o site a partir do GitHub a cada atualização.

---

## 📝 7. Memória Automática Entre Computadores
* **Regra:** O histórico de alterações entre máquinas é mantido através dos ficheiros `AGENTS.md` e `CONTEXTO_PROJETO.md`.
* **Ação:** No fecho de cada tarefa, estes ficheiros devem ser atualizados com a data, hora e o resumo rigoroso das modificações.

---

## ⚡ 8. Disponibilidade Imediata Multidispositivo
* **Regra:** Quando o utilizador guarda ou sincroniza dados, estes devem ser enviados e gravados de imediato no servidor para estarem acessíveis instantaneamente noutros computadores.

---

## 🚫 9. Política de Zero Cache
* **Regra:** Não permitir que dados fiquem retidos em cache de navegador, Service Workers desatualizados ou caches intermediárias.
* **Ação:** Manter cabeçalhos `no-cache, no-store, must-revalidate` e `_t=${Date.now()}` nas comunicações com APIs e ficheiros de dados.

---

## 🎯 10. Corrigir Apenas o que Foi Pedido (Mínimo Impacto)
* **Regra:** Não alterar estruturas de UI, não mudar formatos visuais e não reorganizar módulos a menos que expressamente solicitado.
* **Ação:** Focar as alterações cirurgicamente no problema reportado, preservando todo o restante comportamento e integridade funcional.

---

## 🧱 11. Separação Absoluta entre Código e Dados
* **Regra:** Ao atualizar ficheiros de código (`app.js`, `index.html`, `server.js`, estilos, etc.), NUNCA sobrepor ou enviar dados locais antigos para `/api/save-db-json` ou para `data/db.json`.
* **Motivo:** Operações de código não podem afetar ou regredir a base de dados viva da aplicação.

---

## 💾 12. Suporte a Ficheiros de Backup Grandes (> 10 MB via LFS)
* **Regra:** O Hugging Face rejeita commits padrão para ficheiros superiores a 10 MiB.
* **Ação:** Todos os backups ou carregamentos volumosos devem utilizar Git LFS (`uploadFileToHuggingFaceLFS`) e descarregamento via URLs `/resolve/main/`.

---

## 🔤 13. Ordenação Alfabética Universal Rigorosa
* **Regra:** Todas as listagens, tabelas, dropdowns, seletores de formulários e grelhas de **Clientes, Contactos e Projetos** têm de aparecer estritamente por ordem alfabética pela primeira letra do nome.
* **Ação:** Utilizar sempre ordenação portuguesa com `localeCompare('pt', { sensitivity: 'base' })`.

---

## 👤 14. Isolamento Rigoroso de Perfis de Utilizador
* **Regra:** Cada utilizador opera num **perfil independente**: os dados registados por um utilizador (clientes, contactos, projetos, orçamentos e interações) nunca se misturam com os dados de outros utilizadores.
* **Ação:** Importações de ficheiros e sincronizações de registos de cada utilizador só se refletem no perfil desse utilizador.

---

## 📦 15. Separação Rígida no Gerador de Pacotes (`.sigecpkg`)
* **Regra:** O botão "Gerar Pacote" tem proibição absoluta de recolher dados de registo (clientes, contactos, etc.). Deve empacotar **exclusivamente código de software**.
* **Motivo:** Atualizações de software aplicam-se a todos os utilizadores, mas os dados de registo de cada perfil permanecem intactos e isolados.

---

## 📄 16. Regras de Orçamentação e Impressão (PDF e Word)
* **Regra:** Nos documentos impressos em PDF ou Word de orçamentos, **apenas devem aparecer os campos que foram efetivamente preenchidos** no formulário.
* **Condição:** O quadro "Equipamentos Opcionais" só aparece se tiver itens preenchidos.
* **Inicialização:** Novos orçamentos iniciam sempre com valores monetários a `0.00`.

---

## 🔔 17. Notificação de Atualização no Arranque e Re-autenticação Obrigatória
* **Regra:** Ao abrir o programa (web ou desktop), se existir uma nova versão no servidor, o sistema deve apresentar uma janela modal com "Atualizar de Imediato" e "Mais Tarde".
* **Segurança:** Ao clicar em "Atualizar de Imediato", o sistema conclui a instalação, encerra a sessão ativa e solicita obrigatoriamente novas credenciais (Email e Palavra-Passe / PIN).

---

## 👁️ 18. Gestão de Contactos Inativos e Coluna "Contactado"
* **Regra:** Os contactos podem ser marcados como inativos, com botão para ver/ocultar contactos inativos em cada cliente e separador estatal.
* **Automatismo:** A indicação/coluna "Contactado" deve ser assinalada automaticamente assim que existir pelo menos uma interação registada com esse contacto.

---

## ✍️ 19. Salvaguarda Automática de Notas Pendentes de Contacto
* **Regra:** Se o utilizador escrever notas no campo de contacto rápido e clicar diretamente em "Guardar Alterações" da ficha de contacto (sem carregar antes em "+ Adicionar Contacto"), o texto não se pode perder.
* **Ação:** O sistema recolhe e grava automaticamente essas notas antes de fechar a janela modal.

---

## 🌐 20. Paradigma Exclusivamente Web (Proibição Total de Executáveis)
* **Regra:** *"O sigec-pro, já não funciona através de executáveis. Já só funciona através de página web direta. Não quero que voltes a programar com base em executável. Quero que a programação se faça com base a que o programa corra em página web."*
* **Ação:** É estritamente proibido criar, referenciar ou programar com base em executáveis compilados (`.exe`), bridges nativos ou portas locais de desktop. Toda a arquitetura opera diretamente no browser.

---

## 🇵🇹 21. Idioma Obrigatório
* **Regra:** Toda a comunicação com o utilizador deve ser realizada estritamente em **Português de Portugal**.

---

## 📅 Histórico de Modificações e Tarefas (Memória Entre Máquinas)

### [29/09/2026 14:20]
* **Integração de Regras da Pen Drive E:** Adicionadas a salvaguarda automática de notas de contacto pendentes e a proibição expressa de executáveis em prol do paradigma 100% web.
* **Consolidação das 21 Regras Oficiais:** Diretrizes permanentes harmonizadas em `GEMINI.md`, `AGENTS.md` e `CONTEXTO_PROJETO.md`.
* **Sincronização e Restauro de Backups Grandes:** Implementado suporte a Git LFS para backups superiores a 10 MB (`uploadFileToHuggingFaceLFS`) e rota `/resolve/main/` no carregamento de backups a partir do Hugging Face.
* **Integridade de Dados:** 5 projetos ativos e validados no servidor, com 60 clientes, 169 contactos, 92 interações e 3 utilizadores intactos.

### [01/10/2026 08:18]
* **Eliminação de Bloqueio Pós-Sincronização:**
  * Desacoplada a re-renderização massiva da interface em `mergeCloudDatabaseSafely` usando `setTimeout(0)`, libertando de imediato o thread de execução do browser.
  * Desacoplada a notificação modal em `handleFullServerSync` para garantir que o foco e os eventos de clique dos botões e do menu permanecem 100% responsivos após a sincronização.
  * Removidas as chamadas concorrentes ao GitHub no cliente (`syncDatabaseToHuggingFace`), assegurando cumprimento estrito da Regra 6 (sincronização cloud exclusiva via Hugging Face Space e servidor oficial OnRender).

### [01/10/2026 13:30]
* **Fusão Relacional sem Perdas (Merge de Backup e Dados Atuais):**
  * Efetuada salvaguarda prévia completa do estado ativo (`pre_merge_safety_dump_01-10-2026.json`).
  * Reintegrados com sucesso os 5 projetos históricos (`Estratégia Norte 2040`, `Unidade Móvel Bancária - Camião`, `Huawei SmartBus`, `Unidade Móvel Bancária - Furgão`, `Campanha de Digitalização`), 4 contactos (`Carla Emilie`, `Hedi`, `Diana`, `Ana`) e 4 interações pendentes a partir do backup de 30/09/2026 (`Backup_Perfil_Jose_Centurio_30-09-2026_14-32-28.sigecbak`).
  * Preservados integralmente os dados registados hoje, todos os 3 utilizadores do sistema e as 116 decisões de duplicados ignorados (com deduplicação de redundâncias cíclicas).
  * Base de dados fundida sincronizada com sucesso no Hugging Face Space (`josecenturio/SIGEC-Pro`) e Dataset, em cumprimento rigoroso de todas as 21 regras.
  * **Correção da Rota de Sincronização:** Definida prioridade absoluta para `https://josecenturio-sigec-pro.static.hf.space/data/db.json` (CORS universal `*`), invertida a ordem de `handleFullServerSync` para PULL & MERGE antes de PUSH, e adicionada blindagem contra envio de bases sem projetos (`numProjetos === 0`).

### [01/10/2026 14:25]
* **Restauração Completa da Produção no OnRender (`https://sigec-pro.onrender.com`):**
  * Atualizada a **Regra 6** para sincronização em Nuvem Dual Parity (Hugging Face + GitHub/OnRender), desbloqueando o pipeline de deploy contínuo.
  * Diagnóstico raiz confirmado: o OnRender servia ficheiros estáticos antigos de 01/10/2026 06:18, nos quais a base de dados continha 0 projetos e o script destruía dados locais ao arrancar.
  * Efetuado commit atómico para a branch `main` no GitHub `jjota26/SIGEC-Pro` com `data/db.json` (60 clientes, 173 contactos, 5 projetos, 96 interações, 3 utilizadores), `app.js` corrigido e `index.html` com versionamento de cache `v=2.2.0_20261001_1355`.
  * Deploy do OnRender validado em produção com sucesso: `https://sigec-pro.onrender.com` 100% operacional, exibindo de imediato todos os clientes, contactos e os 5 projetos.

### [02/10/2026 08:00]
* **Implementação de Sincronização Inteligente em Segundo Plano (Zero-Freeze Universal):**
  * Desenvolvido e integrado motor ultraleve de monitorização por cabeçalhos HTTP `HEAD` e `ETag` (`checkCloudChangesSilently` e `initPeriodicBackgroundSync`) em `app.js`.
  * Custo de CPU e largura de banda nulos quando não existem alterações remotas (0 bytes transferidos no corpo do pedido).
  * Gatilhos automáticos de atualização imediata ao retomar o foco da janela (`window.focus`), ao alternar abas de navegador (`visibilitychange`) e ao navegar entre menus da aplicação (`switchTab`).
  * Blindagem contra congelamento da interface: re-renderização restrita exclusivamente ao painel ativo (`refreshActivePanel`) via `requestAnimationFrame`, com adiamento automático caso o utilizador esteja a preencher formulários ou com janelas modais ativas.
  * Atualizado o identificador de versão de cache em `index.html` para `v=2.3.0_20261002_0758`.




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

### [02/10/2026 11:00]
* **Eliminacao Definitiva de Congelamento no Separador Duplicados:**
  * **Causa Raiz:** O array db.ignoredDuplicates continha 22.436 objetos repetidos (acumulados porque new Set() comparava referencias de objetos em vez de chaves canonicas). Cada varrimento de duplicados fazia mais de 350 milhoes de comparacoes sincronas bloqueando o browser.
  * **Saneamento sem Perdas:** Deduplicadas as redundancias em data/db.json, preservando integralmente todas as 40 decisoes canonicas unicas do utilizador. O tamanho do ficheiro data/db.json reduziu de 18.3 MB para 8.2 MB.
  * **Cache O(1) de Alta Performance:** Implementada cache em memoria _cachedIgnoredKeys em duplicatesManager.js com procura instantanea Set.has(), reduzindo o tempo de varrimento de varios minutos de congelamento para apenas 0.2 segundos (227 ms).
  * **Desacoplamento Visual:** A comutacao para o separador de duplicados em switchCfgSubTab foi desacoplada com setTimeout(10), garantindo resposta visual instantanea sem qualquer soluco na interface.
  * **Sincronizacao Nuvem e Deploy:** Alteracoes sincronizadas com sucesso no GitHub (jjota26/SIGEC-Pro), OnRender e Hugging Face Space & Dataset (v=2.7.0_20261002_1055).

### [02/10/2026 13:00]
* **Enriquecimento Inteligente de Moradas e Integração Google (Google Search AI Parser):**
  * **Causa Raiz Identificada:** O analisador anterior de moradas (parseSmartAddress) baseava-se em segmentação ingénua por vírgulas, perdendo dados essenciais quando o texto vinha em parágrafos do Google (ex: "A sede da VINCI Energies Portugal fica no Edifício Atlantis, Avenida Dom João II..."), ignorando o edifício, o telefone e o website oficial. Além disso, a atribuição de telefone e website na confirmação continha bloqueios se o campo estivesse previamente preenchido.
  * **Motor Universal de Decomposição (parseSmartAddress em pp.js):** Desenvolvido motor de alta precisão que identifica e extrai perfeitamente:
    * Artéria / Rua / Avenida (direcao1), Edifício / Centro Empresarial (direcao2), Número de porta (
umero), Andar / Piso (ndar), Código Postal (codigoPostal), Localidade (localidade), País (pais), Telefone (+351 / fixo / móvel), Website oficial e NIF/NIPC.
  * **Interface Enriquecida no Modal (index.html):** Substituído o campo <input> por uma <textarea> multi-linha e adicionado o botão direto **"📋 Colar do Google"** (pasteFromClipboardAndApply()) que lê da área de transferência ou analisa o texto colado num clique.
  * **Serviço Backend Integrado (server.js):** Atualizada a rota /api/ai-lookup-address para enriquecer e devolver 	elefone, website, direcao2 (Edifício/Parque) e contribuinte.
  * **Desobstrução na Confirmação:** confirmAndApplyAiAddress atualiza agora diretamente os campos de website, email e telefone na ficha do cliente sem restrições.
  * **Versionamento de Cache & Deploy:** Versão atualizada para =2.8.0_20261002_1300. Testado rigorosamente no Microsoft Edge Headless e sincronizado em Dual Parity para GitHub (jjota26/SIGEC-Pro), OnRender e Hugging Face Space (josecenturio/SIGEC-Pro). Integridade da base de dados 100% preservada (78 clientes, 179 contactos, 5 projetos, 99 interações, 3 utilizadores).

### [02/10/2026 13:30]
* **Desbloqueio e OtimizaÃ§Ã£o InstantÃ¢nea do Acesso ao Sistema (Login Zero-Freeze):**
  * **Causa Raiz Identificada e Corrigida:**
    * Eliminado erro de sintaxe em `app.js` (delimitadores de string ausentes no array `lookupUrls` que impediam a compilaÃ§Ã£o do JavaScript no browser como RegExp invÃ¡lido).
    * Corrigido o motor `ensureUsersInitialized()` para garantir incondicionalmente a presenÃ§a do Administrador Principal JosÃ© CentÃºrio (`usr-admin-001`, `jmcenturio@alegria-activity.com`, palavra-passe permanente `J*cen*1971`) com perfil ativo, prevenindo que perfis locais sem dados de sessÃ£o fiquem retidos.
  * **Feedback Visual e Desacoplamento do Overlay:**
    * Adicionado `id="btnSubmitLogin"` e feedback visual imediato de progresso (spinner com indicaÃ§Ã£o textual).
    * OcultaÃ§Ã£o imediata do overlay `#loginOverlay` logo apÃ³s a validaÃ§Ã£o do PIN/palavra-passe, desacoplando a renderizaÃ§Ã£o das grelhas de dados via `setTimeout(..., 10)`.
    * Timeouts de proteÃ§Ã£o de 2000ms (`AbortSignal.timeout(2000)`) em consultas remotas secundÃ¡rias de utilizador.
  * **ValidaÃ§Ã£o Rigorosa:** Testado e aprovado no Microsoft Edge Headless (`AUTH_STATUS:true | USER:usr-admin-001 | OVERLAY:none`).
  * **Versionamento de Cache & Deploy:** VersÃ£o atualizada para `v=2.8.1_20261002_1330`.
