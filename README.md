# SIGEC-Pro - Sistema Integrado de Gestão Empresarial e Contactos

**Autor e Direitos de Autor:** José Centúrio  
**Versão:** SIGEC_V1.7.25  

Sistema Integrado de Gestão Empresarial e Contactos concebido para gestão de Clientes (Estatais e Normais), Contactos, Projetos, Interações, Orçamentos e sincronização na nuvem.

## 🚀 Funcionalidades
- **Gestão de Clientes:** Fichas completas com suporte a múltiplos separadores, NIF, moradas e contactos associados.
- **Ordenação Alfabética Universal:** Listagens, tabelas e seletores com ordenação alfabética rigorosa em português.
- **Gestor de Duplicados:** Deteção automática e unificação inteligente de registos.
- **Sincronização Cloud Multi-PC:** Suporte a sincronização em tempo real.
- **Multi-Idioma:** Interface internacionalizada com suporte prioritário a Português de Portugal.
- **Launcher Desktop & Servidor Local:** Executável leve em C# com bridge HTTP local e envio SMTP nativo.

## 📁 Estrutura do Repositório
- `index.html`: Interface principal da aplicação.
- `app.js`: Lógica de negócio, gestão de estado e sincronização.
- `styles.css`: Estilização responsiva moderna.
- `duplicatesManager.js`: Motor de deduplicação relacional.
- `i18n.js`: Dicionário e rotinas de tradução.
- `LauncherSource.cs`: Código-fonte do servidor local e launcher desktop C#.
- `InstallerSource.cs`: Código-fonte do instalador autónomo.
- `data/db.json`: Base de dados relacional em formato JSON.
- `render.yaml`: Ficheiro de configuração para implantação automática no Render.

## 🌐 Implantação no Render
1. Conectar a conta GitHub ao [Render](https://render.com).
2. Criar um novo **Static Site** apontando para este repositório (`jjota26/SIGEC-Pro`).
3. O ficheiro `render.yaml` configura automaticamente o ponto de publicação.
