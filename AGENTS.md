# SIGEC-Pro — Regras Obrigatórias e Diretrizes do Projeto

Este ficheiro define as regras estritas e permanentes para qualquer agente de IA que opere neste projeto (`SIGEC-Pro`). O cumprimento destas regras é obrigatório em todas as sessões.

Consulte o ficheiro [GEMINI.md](file:///G:/Programa%20SIGEC-Pro/GEMINI.md) para a versão principal.

---

## 🛑 1. Explicar Sempre Antes de Começar
* **Regra:** Nunca iniciar execuções de comandos, modificações profundas ou alterações de dados sem explicar claramente o plano ao utilizador.
* **Ação:** Apresentar um resumo claro do que foi identificado e do que vai ser feito, aguardando a confirmação do utilizador.

---

## 🚫 2. NUNCA Fazer Reposição de Backup por Iniciativa Própria
* **Regra:** NUNCA restaurar backups ou reverter a base de dados a menos que o utilizador dê uma ordem expressa e inequívoca para o fazer.
* **Motivo:** O utilizador pode ter inserido dados recentes que seriam irremediavelmente destruídos por uma reposição de cópia de segurança anterior.

---

## 🛡️ 3. NUNCA Apagar, Alterar ou Reduzir Dados do Utilizador
* **Regra:** A integridade dos dados existentes é inviolável. É expressamente proibido fazer desaparecer clientes, contactos, projetos, interações ou utilizadores.
* **Cuidado:** Nunca assumir que ficheiros locais antigos contêm a verdade. O estado ativo mais recente do utilizador deve ser sempre respeitado.

---

## 🔄 4. Sincronização em Tempo Real (GitHub + Hugging Face + Render)
* **Regra:** Os dados no GitHub (`data/db.json`), Hugging Face Space/Dataset e Render têm de estar rigorosamente alinhados e sincronizados em tempo real.
* **Mecanismo:** Qualquer persistência de base de dados deve propagar de forma segura para os destinos configurados sem perdas.

---

## ⚡ 5. Disponibilidade Imediata Multidispositivo
* **Regra:** Quando o utilizador guarda ou sincroniza dados, estes devem ser enviados e gravados de imediato no servidor para estarem acessíveis instantaneamente noutros computadores.

---

## 🚫 6. Política de Zero Cache
* **Regra:** Não permitir que dados fiquem retidos em cache de navegador, Service Workers desatualizados ou caches intermediárias.
* **Ação:** Manter cabeçalhos `no-cache, no-store, must-revalidate` e `_t=${Date.now()}` nas comunicações com APIs e ficheiros de dados.

---

## 🎯 7. Corrigir Apenas o que Foi Pedido (Mínimo Impacto)
* **Regra:** Não alterar estruturas de UI, não mudar formatos visuais e não reorganizar módulos a menos que expressamente solicitado.
* **Ação:** Focar as alterações cirurgicamente no problema reportado, preservando todo o restante comportamento e integridade funcional.

---

## 🧱 8. Separação Absoluta entre Código e Dados
* **Regra:** Ao atualizar ou cometer ficheiros de código (`app.js`, `index.html`, `server.js`, estilos, etc.), NUNCA sobrepor ou enviar dados locais antigos para `/api/save-db-json` ou para `data/db.json`.
* **Motivo:** Operações de código não podem afetar ou regredir a base de dados viva da aplicação.

---

## 💾 9. Suporte a Ficheiros de Backup Grandes (> 10 MB via LFS)
* **Regra:** O Hugging Face rejeita commits padrão para ficheiros superiores a 10 MiB.
* **Ação:** Todos os backups ou carregamentos volumosos devem utilizar Git LFS (`uploadFileToHuggingFaceLFS`) e descarregamento via URLs `/resolve/main/`.
