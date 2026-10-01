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



