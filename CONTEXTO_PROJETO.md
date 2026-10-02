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
* **Clientes:** 60
* **Contactos:** 173
* **Projetos:** 5 (`Estratégia Norte 2040`, `Unidade Móvel Bancária - Camião`, `Huawei SmartBus`, `Unidade Móvel Bancária - Furgão`, `Campanha de Digitalização`)
* **Interações:** 96
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


