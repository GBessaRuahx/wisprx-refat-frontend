## 🧭 Padrão estrutural e boas práticas

Este repositório segue o padrão de **modularização por domínio funcional**. Cada feature da aplicação deve ter seu próprio diretório em `src/features/<domínio>`, com a seguinte estrutura mínima:

```
src/features/<domínio>/
├── pages/        # Rotas e páginas públicas da feature
├── components/   # Componentes exclusivos da feature
├── hooks/        # Hooks específicos (ex: useTickets)
├── services/     # APIs e integração com backend
├── forms/        # Lógica de formulários com React Hook Form
├── schemas/      # Validações com Zod
├── stores/       # Estado local com Zustand
└── index.ts
```
⚠️ Importante: durante a refatoração, o estilo visual atual das telas e componentes deve ser mantido fiel ao original. O foco é reorganizar e modernizar o código sem alterar a aparência ou comportamento visual. As alterações devem facilitar manutenções futuras (ex.: uso de Tailwind, separação clara por feature), mas não devem resultar em mudanças perceptíveis para o usuário final neste momento.

Regras gerais:
- Todo o código deve ser escrito em TypeScript (`.ts` / `.tsx`)
- Estilos com Tailwind CSS
- Estado com Zustand
- Validação com Zod
- Formulários com React Hook Form
- Tipos e modelos em `src/entities/`
- Componentes visuais reutilizáveis em `src/ui/`
- Utilidades e hooks genéricos em `src/shared/`
- Toda refatoração deve ser documentada em `REFATORACOES.md`
- Cada arquivo migrado deve ser marcado no `inventario-frontend-original.txt`

Evite lógica duplicada. Se notar padrões repetidos, isole em `shared/`.

O objetivo é obter um frontend modular, escalável e alinhado com as melhores práticas modernas.

Cada feature (Tickets, Contacts, Campaigns, etc.) deve ser isolada em features/<domínio>/ com suas páginas, componentes, hooks, serviços e stores. Essa estratégia facilita entender dependências, evita que partes de uma funcionalidade fiquem esquecidas e permite migrar gradualmente sem quebrar o sistema.

Garantindo que nada seja esquecido

Inventário de arquivos – Gere uma lista (por exemplo, via find frontend/src -type f) e mantenha um checklist. Cada arquivo migrado deve ser marcado ou removido do inventário.

Mapeamento de dependências – Use grep ou IDE para localizar importações de cada módulo antes de movê-lo. Assim, todos os pontos de uso são atualizados.

REFATORACOES.md – Registrar no arquivo (já previsto em AGENTS.md) as features migradas em cada commit, com hash e data, ajuda no controle.

Scripts de validação – Após cada etapa, rode linter e testes (Vitest) no projeto novo para garantir que os módulos recém-migrados continuam funcionando.

Limpeza contínua

Usar o arquivo frontend/inventario-frontend-original.txt para guiar o que ja foi feito, e no fim de cada refatoraçao, atualizar o arquivo marcando como feito o item na lista.


-Testes e verificação

Adotar Vitest + React Testing Library para novos componentes.

Garantir que as rotas antigas continuem funcionando até que todas as páginas tenham sido migradas para Next.js.

Conclusão

O projeto atual está fortemente baseado em diretórios genéricos e possui arquivos legados dispersos. A estrutura em frontend-refactor/ já prevê organização por domínio, uso de Tailwind, Zustand, TanStack Query e tipagem TypeScript, sendo o caminho mais adequado para evoluir a aplicação. Migrar feature a feature, mantendo um inventário de arquivos e atualizando as referências, é a melhor forma de evitar que qualquer parte da lógica antiga seja esquecida durante a transição.


## 🛠️ Estratégia de Refatoração

A refatoração será realizada **por feature**, sem quebrar a base original. Para isso:

1. Foi criado o diretório `frontend-refactor/`, onde a nova estrutura será montada.
2. Cada domínio será migrado de `src/pages/<x>` para `features/<x>/` com:
   - `pages/`, `components/`, `hooks/`, `services/`, `forms/`, `schemas/`, `stores/`
3. `ui/` reunirá elementos visuais reutilizáveis (ex.: `Modal`, `Button`, `Input`)
4. `shared/` conterá utilidades, hooks genéricos, erros, i18n, etc.
5. A entrada permanece em `pages/index.jsx` para futura migração a Next.js.
6. Testes com **Vitest + RTL** e documentação via **Storybook** serão incluídos.




```
src/
├── app/
│   ├── (auth)/                     # Rotas de autenticação
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forget-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx              # Layout específico para auth (simples)
│   │
│   ├── (dashboard)/                # Rotas principais da aplicação (requer login)
│   │   ├── dashboard/              # /dashboard
│   │   │   └── page.tsx
│   │   │
│   │   ├── announcements/          # /announcements
│   │   │   └── page.tsx
│   │   │
│   │   ├── campaigns/              # /campaigns
│   │   │   ├── page.tsx            # Listagem principal
│   │   │   ├── report/             # /campaigns/report
│   │   │   │   └── page.tsx
│   │   │   ├── config/             # /campaigns/config
│   │   │   │   └── page.tsx
│   │   │   └── phrase/             # /campaigns/phrase
│   │   │       └── page.tsx
│   │   │
│   │   ├── companies/              # /companies
│   │   │   └── page.tsx
│   │   │
│   │   ├── connections/            # /connections
│   │   │   └── page.tsx
│   │   │
│   │   ├── contacts/               # /contacts
│   │   │   ├── page.tsx            # Listagem principal de contatos
│   │   │   ├── list-items/         # /contacts/list-items (ou talvez /contacts/lists/[listId]/items)
│   │   │   │   └── page.tsx
│   │   │   └── lists/              # /contacts/lists
│   │   │       └── page.tsx
│   │   │
│   │   ├── files/                  # /files
│   │   │   └── page.tsx
│   │   │
│   │   ├── financeiro/             # /financeiro
│   │   │   └── page.tsx
│   │   │
│   │   ├── flow-builder/           # /flow-builder
│   │   │   ├── page.tsx            # Editor principal do flow
│   │   │   └── config/             # /flow-builder/config
│   │   │       └── page.tsx
│   │   │
│   │   ├── helps/                  # /helps
│   │   │   └── page.tsx
│   │   │
│   │   ├── kanban/                 # /kanban
│   │   │   └── page.tsx
│   │   │
│   │   ├── messages-api/           # /messages-api
│   │   │   └── page.tsx
│   │   │
│   │   ├── prompts/                # /prompts
│   │   │   └── page.tsx
│   │   │
│   │   ├── queues/                 # /queues
│   │   │   ├── page.tsx            # Listagem principal de filas
│   │   │   └── integration/        # /queues/integration
│   │   │       └── page.tsx
│   │   │
│   │   ├── quick-messages/         # /quick-messages
│   │   │   └── page.tsx
│   │   │
│   │   ├── schedules/              # /schedules
│   │   │   └── page.tsx
│   │   │   // schedules.bkp parece ser algo temporário ou de backup, não uma rota de UI.
│   │   │
│   │   ├── settings/               # /settings
│   │   │   ├── page.tsx            # Configurações gerais
│   │   │   └── custom/             # /settings/custom
│   │   │       └── page.tsx
│   │   │
│   │   ├── subscription/           # /subscription
│   │   │   └── page.tsx
│   │   │
│   │   ├── tags/                   # /tags
│   │   │   └── page.tsx
│   │   │
│   │   ├── tickets/                # /tickets
│   │   │   ├── page.tsx            # Listagem principal
│   │   │   ├── responsive-container/ # /tickets/responsive-container (Pode ser um layout específico ou uma variante)
│   │   │   │   └── page.tsx
│   │   │   ├── advanced/           # /tickets/advanced
│   │   │   │   └── page.tsx
│   │   │   └── custom/             # /tickets/custom
│   │   │       └── page.tsx
│   │   │
│   │   ├── todo-list/              # /todo-list
│   │   │   └── page.tsx
│   │   │
│   │   ├── users/                  # /users
│   │   │   └── page.tsx
│   │   │
│   │   └── layout.tsx              # Layout principal do dashboard (com sidebar, header, etc.)
│   │
│   ├── api/                        # API Routes (Route Handlers)
│   │   ├── auth/[...nextauth]/     # Exemplo para NextAuth
│   │   │   └── route.ts
│   │   └── ...                     # Outras API routes
│   │
│   ├── layout.tsx                  # Layout Raiz Global (<html>, <body>, providers globais)
│   ├── page.tsx                    # Landing Page ou redirect para /login ou /dashboard
│   └── globals.css                 # Estilos globais
│
├── components/
│   ├── ui/                         # Componentes de UI base (Button, Input, Card, etc. - shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── shared/                     # Componentes de UI mais complexos, compartilhados entre features
│       ├── page-header.tsx
│       ├── data-table.tsx
│       ├── sidebar.tsx
│       ├── user-avatar.tsx
│       └── ...
│
├── features/                       # Domínios de negócio / Funcionalidades principais
│   ├── announcements/
│   │   ├── components/
│   │   ├── pages/                  # Ex: announcements-listing-page.tsx
│   │   ├── services/
│   │   └── types/
│   │
│   ├── campaigns/
│   │   ├── components/             # Ex: campaign-card.tsx, campaign-filter.tsx
│   │   ├── pages/                  # campaign-listing-page.tsx, campaign-report-page.tsx, etc.
│   │   ├── services/               # campaign-service.ts
│   │   ├── hooks/
│   │   └── types/                  # Campaign, CampaignConfig, etc.
│   │
│   ├── companies/
│   │   └── ... (estrutura similar para cada feature)
│   │
│   ├── connections/
│   │   └── ...
│   │
│   ├── contacts/                   # Feature Contacts
│   │   ├── components/             # contact-form.tsx, contact-list-item-display.tsx
│   │   ├── pages/                  # contacts-page.tsx, contact-lists-page.tsx, contact-list-items-page.tsx
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/                  # Contact, ContactList, etc.
│   │
│   ├── files/
│   │   └── ...
│   │
│   ├── finance/                    # Renomeado de "Financeiro" para "finance" (inglês é comum)
│   │   └── ...
│   │
│   ├── flow-builder/
│   │   ├── components/             # node-editor.tsx, flow-canvas.tsx
│   │   ├── pages/                  # flow-builder-editor-page.tsx, flow-config-page.tsx
│   │   ├── services/
│   │   ├── store/                  # Para estado complexo do editor (Zustand, Jotai)
│   │   └── types/
│   │
│   ├── help-center/                # Renomeado de "Helps"
│   │   └── ...
│   │
│   ├── kanban-board/               # Renomeado de "Kanban"
│   │   └── ...
│   │
│   ├── messages-api-config/        # Renomeado de "MessagesAPI"
│   │   └── ...
│   │
│   ├── prompts-management/         # Renomeado de "Prompts"
│   │   └── ...
│   │
│   ├── queues-management/          # Renomeado de "Queues"
│   │   ├── components/
│   │   ├── pages/                  # queues-listing-page.tsx, queue-integration-page.tsx
│   │   ├── services/
│   │   └── types/
│   │
│   ├── quick-messages-templates/   # Renomeado de "QuickMessages"
│   │   └── ...
│   │
│   ├── scheduling/                 # Renomeado de "Schedules"
│   │   └── ...
│   │
│   ├── settings/                   # Feature Settings (pode ser mais granular se muito complexa)
│   │   ├── components/
│   │   ├── pages/                  # general-settings-page.tsx, custom-settings-page.tsx
│   │   ├── services/
│   │   └── types/
│   │
│   ├── subscription-management/    # Renomeado de "Subscription"
│   │   └── ...
│   │
│   ├── tag-management/             # Renomeado de "Tags"
│   │   └── ...
│   │
│   ├── tickets-support/            # Renomeado de "Tickets"
│   │   ├── components/             # ticket-detail-view.tsx, ticket-filter-bar.tsx
│   │   ├── pages/                  # tickets-listing-page.tsx, ticket-advanced-view-page.tsx, etc.
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   │
│   ├── todo-list/
│   │   └── ...
│   │
│   ├── user-management/            # Renomeado de "Users"
│   │   ├── components/
│   │   ├── pages/                  # user-list-page.tsx, user-profile-page.tsx (se aplicável)
│   │   ├── services/
│   │   └── types/
│   │
│   └── index.ts                    # Pode reexportar tipos comuns ou utilitários das features, se necessário
│
├── lib/                            # Utilitários, lógica e hooks globais (anteriormente `shared/`)
│   ├── api.ts                      # Configuração do cliente de API (ex: Axios, ou wrapper do fetch)
│   ├── auth.ts                     # Funções e configurações de autenticação (ex: helpers do NextAuth)
│   ├── constants.ts                # Constantes globais
│   ├── hooks/                      # Hooks reutilizáveis e agnósticos de feature
│   │   ├── use-local-storage.ts
│   │   ├── use-media-query.ts
│   │   └── ...
│   ├── utils.ts                    # Funções utilitárias puras (cn, formatDate, etc.)
│   └── ...
│
├── providers/                      # Providers de Contexto globais
│   ├── theme-provider.tsx
│   ├── auth-provider.tsx           # Se não estiver usando NextAuth com seu próprio provider
│   ├── query-client-provider.tsx   # Para React Query / TanStack Query
│   └── ...
│
├── public/                         # Assets estáticos públicos (favicon.ico, images, etc.)
│
├── styles/                         # Se você tiver mais do que globals.css (raro com Tailwind)
│   └── ...
│
└── types/                          # Tipagens globais da aplicação ou de entidades compartilhadas
    ├── index.ts
    └── db.ts                       # Se estiver usando um ORM como Prisma, os tipos gerados podem ir aqui
                                    # ou serem importados diretamente do ORM.

// Arquivos na Raiz do Projeto
// ├── next.config.mjs
// ├── tailwind.config.ts
// ├── postcss.config.js
// ├── tsconfig.json
// ├── package.json
// └── .env.local (e outros .env)```


## 🛠️ Ferramentas

Ferramentas como Tailwind, Vitest, Storybook e ESLint devem estar configuradas conforme `ferramentas.md`.


## 🧩 Gerenciamento de Imports e Aliases

Para garantir a integridade das refatorações, todo código migrado deve seguir as regras abaixo:

1. **Verifique e atualize todos os `import` após mover ou renomear um arquivo**:
   - Utilize busca global por `import` para localizar referências antigas.
   - Atualize todas para o novo caminho relativo ou alias correspondente.

2. **Prefira utilizar aliases consistentes em vez de caminhos relativos longos**:
   - Exemplo: `@features/auth/hooks/useLogin` em vez de `../../../hooks/useLogin`

3. **Certifique-se de que os aliases estão corretamente configurados**:
   - `tsconfig.json` deve conter:
     ```json
     {
       "compilerOptions": {
         "baseUrl": "./src",
         "paths": {
           "@features/*": ["features/*"],
           "@ui/*": ["ui/*"],
           "@shared/*": ["shared/*"],
           "@entities/*": ["entities/*"],
           "@app/*": ["app/*"]
         }
       }
     }
     ```
   - Se estiver usando Vite, inclua o mesmo mapeamento em `vite.config.ts`:
     ```ts
     resolve: {
       alias: {
         "@features": path.resolve(__dirname, "src/features"),
         "@ui": path.resolve(__dirname, "src/ui"),
         "@shared": path.resolve(__dirname, "src/shared"),
         "@entities": path.resolve(__dirname, "src/entities"),
         "@app": path.resolve(__dirname, "src/app"),
       },
     }
     ```

4. **Após qualquer refatoração**, rode:
   - `tsc --noEmit`
   - `vite build`
   - `npm run lint`
   - `npm run test`
   Para validar a resolução correta dos imports e detectar quebras.

5. **Nunca importe arquivos antigos ou duplicados se uma versão já foi refatorada.**

Este cuidado é essencial para manter a coesão do projeto durante a transição.


### 🔄 Estratégia de Refatoração por Feature

O processo de refatoração seguirá o padrão:

1. Escolher uma feature com base em `src/pages/<FeatureName>/`
2. Fazer varredura completa da pasta original:
   - Identificar todos os arquivos diretos da página
   - Rastrear todos os elementos usados: components, modals, hooks, services, stores, utils, etc
   - Verificar dependências cruzadas e rotas associadas
3. Migrar essa feature para `src/features/<FeatureName>/` com subpastas adequadas (`pages`, `components`, `hooks`, etc)
4. Converter os componentes para Tailwind e shadcn/ui mantendo 100% do comportamento visual
5. Substituir todos os imports antigos no projeto por imports da nova estrutura
6. Validar funcionalidade manualmente e via testes
7. Marcar os arquivos migrados no `inventario-frontend-original.txt`
8. Registrar no `REFATORACOES.md` a hash do commit, data e arquivos migrados

✅ Nenhuma funcionalidade pode ser perdida na migração. Tudo que existe visual e logicamente no frontend original deve estar no novo. Não pode quebrar rotas, telas ou comportamento.
