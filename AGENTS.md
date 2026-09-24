# AGENTS.md — DIRETRIZES E REGRAS PERMANENTES DO PROJETO SIGEC-Pro

Este repositório contém o código-fonte, a interface web PWA, a lógica de negócio e os módulos de dados do **SIGEC-Pro**.

---

## 🌍 REGRA INVIOLÁVEL DE PARIDADE MULTILÍNGUE (i18n)

> [!IMPORTANT]
> **ESTA REGRA NUNCA PODE DEIXAR DE SER APLICADA:**
> Sempre que se faz qualquer alteração no software (nova funcionalidade, ajuste de layout, novo botão, novo campo, mensagem de alerta, notificação toast, modal ou relatório), ela **TEM DE SER OBRIGATORIAMENTE EFETIVA E COMPLETA EM TODOS OS 5 IDIOMAS SUPORTADOS**.
> 
> **Exceção Única:** Apenas se o utilizador solicitar explicitamente uma alteração concreta e exclusiva para um idioma específico.

### Idiomas Obrigatórios:
1. **Português (PT)**
2. **Español (ES)**
3. **English (EN)**
4. **Français (FR)**
5. **Polski (PL)**

### Procedimento Técnico de Implementação Obrigatório:
1. **Elementos na Interface HTML (`index.html`):**
   - Todos os novos botões, títulos, subtítulos, badges e textos devem incluir o respetivo atributo `data-i18n="chave_identificadora"`.
2. **Dicionário Central de Internacionalização (`i18n.js`):**
   - Adicionar a nova chave a `SIGEC_I18N` com a tradução completa para os 5 idiomas (`Português`, `Español`, `English`, `Français`, `Polski`).
   - Adicionar o termo/frase a `SIGEC_PHRASES_MAP` para suportar tradução direta e recursiva da árvore DOM (`translateDOMTree`).
3. **Geração Dinâmica de Texto e Mensagens em JavaScript (`app.js` / `duplicatesManager.js`):**
   - Sempre que o código gerar HTML dinâmico, alertas (`showToast`, modais, `confirm`, `alert`), deve recorrer obrigatoriamente a `t('chave', 'Texto Padrão')` ou `translateSystemTerm(...)`.

---

## 🔁 REGRA PERMANENTE: PERSISTÊNCIA ABSOLUTA DE DECISÕES NO GESTOR DE DUPLICADOS

> [!IMPORTANT]
> **REGRA DE NÃO REAPARECIMENTO DE COMPARAÇÕES JÁ DECIDIDAS:**
> Sempre que no separador **Duplicados**, o utilizador determinar o que fazer com registos de Clientes, Contactos ou Projetos (seja através de **Fundir Registos**, **Manter Ambos**, **Manter Apenas Um** ou **Eliminar**):
> 1. **Essa comparação NUNCA MAIS PODE VOLTAR A APARECER**, porque já foi anteriormente estabelecido pelo utilizador como proceder.
> 2. **Persistência Global e Sincronizada:** A decisão deve ficar registada de forma perene tanto na base de dados central (`db.ignoredDuplicates`), como nas cópias locais (`localStorage`), sendo automaticamente sincronizada entre todos os computadores, instâncias e na nuvem para que nenhum outro dispositivo volte a sugerir o mesmo par/grupo.
> 3. **Remoção Imediata da Interface:** Assim que a ação for confirmada, o grupo resolvido deve ser imediatamente expurgado da lista ativa do separador Duplicados e os contadores de badge devem ser decrementados em tempo real, sem necessidade de recarregar a página.

---

## 🔒 OUTRAS REGRAS CRÍTICAS DE DESENVOLVIMENTO

1. **Preservação Absoluta de Dados:**
   - Nenhuma alteração, limpeza de ficheiros temporários ou atualização de software pode apagar, substituir ou corromper registos existentes de Clientes, Contactos, Projetos, Orçamentos ou Utilizadores.
2. **Sincronização Contínua:**
   - Todas as alterações validadas devem ser mantidas sincronizadas entre a base de trabalho, o mirror local (`%LOCALAPPDATA%\SIGEC-Pro`) e o repositório remoto GitHub (`main`).
3. **Controlo de Cache PWA:**
   - Sempre que `index.html`, `app.js`, `i18n.js` ou `styles.css` forem alterados, avançar a versão da cache no Service Worker (`sw.js`) e atualizar os parâmetros buster (`?v=...`) para garantir propagação instantânea.
4. **Comunicação com o Utilizador:**
   - Comunicação clara e estritamente em **Português de Portugal**.
