# CONTEXTO_PROJETO — SIGEC-Pro

## 1. Titularidade e Propriedade Intelectual
* **Autor e Proprietário Exclusivo:** José Centúrio (Todos os direitos reservados).
* **Software:** SIGEC-Pro — Sistema Integrado de Gestão Comercial Profissional.

---

## 2. Arquitetura do Sistema e Especificações Técnicas
* **Frontend Web:** HTML5, CSS3, JavaScript modular (`app.js`, `index.html`, `i18n.js`, `styles.css`).
* **Paradigma Operacional:** 100% Web no browser (sem qualquer recurso a executáveis locais ou portas nativas).
* **Repositório Oficial em Nuvem:** Hugging Face Space (`josecenturio/SIGEC-Pro`). Nunca contactar o GitHub.
* **Persistência de Dados e Backups:** Ficheiro `data/db.json` com integridade relacional. Suporte para ficheiros de backup grandes (> 10 MB) via Git LFS e leitura via `/resolve/main/`.
* **Isolamento de Perfis:** Cada utilizador opera num espaço independente de dados. Clientes, contactos, projetos e importações pertencem ao utilizador ativo.
* **Ordenação Universal:** Ordenação alfabética obrigatória com `localeCompare('pt')` em 100% das listagens e seletores.

---

## 3. Estado Atual da Base de Dados (Referência Ativa)
* **Clientes:** 60
* **Contactos:** 169
* **Projetos:** 5 (`Estratégia Norte 2040`, `Unidade Móvel Bancária - Camião`, `Huawei SmartBus`, `Unidade Móvel Bancária - Furgão`, `Campanha de Digitalização`)
* **Interações:** 92
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
