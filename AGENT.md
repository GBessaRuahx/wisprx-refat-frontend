AGENT.md — wisprx-refat-frontend

Este arquivo serve como orientação de contexto para agentes inteligentes (LLMs, Codex, etc.) que interagirão com este repositório. O objetivo é fornecer referência sobre a arquitetura atual do frontend e do backend do sistema WisprX, com foco em leitura, análise e refatoramento.

🔄 Relação com o backend

Este repositório contém tanto o frontend (SPA React) quanto o backend (Node.js com Express e Sequelize) do sistema WisprX.

O backend não é editado aqui, mas permanece incluído por referência para fins de inspeção, integração e testes locais com o frontend.

Toda a comunicação é feita via REST APIs e WebSocket (socket.io).

O backend depende de PostgreSQL, Redis e MinIO.

O frontend se comunica com a API usando REACT_APP_BACKEND_URL no build.

📊 Arquitetura atual (antes da refatoração)

Frontend (React SPA)

Baseado em React 17 (sem Next.js).

Organizado em pastas genéricas:

frontend/src/
├── components/         # Componentes diversos (reutilizáveis e específicos misturados)
├── pages/              # Páginas da aplicação
├── context/            # Contextos (Auth, Socket, Tickets...)
├── services/           # Funções de comunicação com a API
├── hooks/              # Hooks personalizados
├── stores/             # Estado global (ex.: Zustand / useReducer)
├── layout/             # Layouts e menus
├── routes/             # Definição de rotas principais
├── translate/          # Internacionalização (i18next)
├── utils/, helpers/    # Funções auxiliares
└── index.js            # Ponto de entrada

Usa Material-UI misturado (v4 e v5), com makeStyles, ThemeProvider, CssBaseline e sx coexistindo.

Estilos globais em CSS.

Estado global com Context API + useReducer ou Zustand (parcial).

Internacionalização via i18next.

Backend (Node.js)

Estrutura MVC com:

backend/src/
├── controllers/        # Controllers REST
├── services/           # Regras de negócio
├── models/             # Sequelize Models
├── config/             # Configurações de banco, redis, etc.
├── middleware/         # Autenticação, verificações
├── queues.ts           # Bull queues
├── libs/               # Sockets, integrações
└── index.ts            # Server principal

Banco de dados: PostgreSQL via Sequelize.

Fila de tarefas: Redis + Bull.

Integração com: WhatsApp (Baileys ou Oficial), MinIO, APIs externas.

Autenticação JWT + Refresh Token.

Sockets WebSocket via socket.io, usados para eventos de chat e fila.

📅 Situação atual

⚠️ Nem todos os arquivos e funcionalidades do sistema estão aqui. Este repositório contém uma visão geral útil para navegação inicial, mas a análise precisa deve ser feita via varredura direta dos arquivos do projeto.

Estrutura legada ainda presente, com componentes e páginas misturados.

O projeto está em fase de refatoração para:

Separar domínios em features/

Usar TailwindCSS, shadcn/ui, Zustand, TanStack Query

Isolar componentes em ui/

Centralizar hooks, services e validações

Organizar testes e tipagens

Essa refatoração ainda não está aplicada neste repositório.

Para manter segurança e rastreabilidade durante a transição, a nova estrutura do frontend será criada em um diretório separado chamado `frontend-refactor/`, ao lado do atual `frontend/`. Isso garante que a versão original continue funcional enquanto o código é migrado gradualmente por domínio (ex.: tickets, contacts). Durante esse processo, os componentes e hooks serão transferidos e reorganizados conforme a nova arquitetura modular planejada.

🚀 Finalidade deste repositório

Servir como base isolada para refatorar o frontend com independência.

Permitir testes locais com o backend incluso.

Facilitar leitura por agentes como Codex, para sugerir estrutura ideal.

Ser espelho funcional da realidade atual da aplicação.

🔍 Recomendações para agentes

Navegue frontend/src/ para entender as funcionalidades atuais.

Use backend/ como referência de comunicação (routes, sockets, auth).

Não altere o backend por ora.

Priorize sugestões de modularização, padronização e melhorias no frontend.


📦 Importante

Este documento é um resumo de alto nível. A arquitetura completa e os detalhes de implementação só serão compreendidos com leitura dos arquivos fonte. Qualquer proposta de refatoração, migração ou adaptação deve se basear em análise real dos diretórios e código.

Responsável técnico: Gabriel BessaData base da estrutura: Junho/2025
