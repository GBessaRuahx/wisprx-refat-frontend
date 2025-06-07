# AGENTS.md – WisprX Frontend (estrutura legada)

## 🧭 Contexto Atual

O diretório `wisprx-app/frontend` abriga uma SPA construída com Create React App (CRA), utilizando JavaScript e React 17.

A estrutura principal de `src/` é:

O agente deve atualizar essa estrutura inicial do diretorio frontend.

## ⚠️ Observações Técnicas

- Usa **Material‑UI v4** (com `makeStyles`) misturado com **MUI v5** (`@mui/material`), o que gera inconsistências visuais e de estilo.
- O `App.js` define o tema com `createTheme` e `ThemeProvider`.
- O `index.js` aplica `CssBaseline` (MUI v4) globalmente.
- Estilos estão dispersos e parcialmente customizados.
- Há arquivos legados como `MainListItems.js.old` e `Schedules.bkp`.

## 🎯 Objetivo da Refatoração

Criar uma nova estrutura modular, moderna e preparada para uso com **Next.js**.

### Diretrizes:

- Adotar **Tailwind CSS** e substituir o MUI.
- Usar **Zustand** para estado local, por domínio.
- Aplicar **React Hook Form** com **Zod** para formulários.
- Componentes reutilizáveis em `ui/`, genéricos em `shared/`.
- Agrupar páginas e lógica em `features/<domínio>/`.

## 🛠️ Estratégia de Refatoração

A refatoração será realizada **por feature**, sem quebrar a base original. Para isso:

1. Foi criado o diretório `frontend-refactor/`, onde a nova estrutura será montada.
2. Cada domínio será migrado de `src/pages/<x>` para `features/<x>/` com:
   - `pages/`, `components/`, `hooks/`, `services/`, `forms/`, `schemas/`, `stores/`
3. `ui/` reunirá elementos visuais reutilizáveis (ex.: `Modal`, `Button`, `Input`)
4. `shared/` conterá utilidades, hooks genéricos, erros, i18n, etc.
5. A entrada permanece em `pages/index.jsx` para futura migração a Next.js.
6. Testes com **Vitest + RTL** e documentação via **Storybook** serão incluídos.


A estrutura deve ser criada com base na estrutura abaixo, porem pode ser alterado caso preceba durante a refaroraçao que precisa:

src/
├── app/                      # Layouts, contextos e rotas globais
│   ├── layout/               # Ex.: Drawer, Navbar, ThemeContext
│   ├── providers/            # AuthProvider, SocketProvider, TicketsProvider…
│   ├── routes/               # Definição das rotas SPA (Route.jsx, index.jsx)
│   └── App.jsx               # Composição principal da aplicação
│
├── features/                 # Cada domínio isolado em sua própria pasta
│   ├── auth/
│   │   ├── pages/            # Login, Signup, ForgetPassword
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── forms/
│   │   └── schemas/
│   ├── dashboard/
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   ├── tickets/
│   │   ├── pages/            # Tickets, Chat, TicketResponsiveContainer
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── forms/
│   │   ├── schemas/
│   │   └── stores/           # Zustand stores, se houver
│   ├── contacts/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── forms/
│   │   └── schemas/
│   ├── campaigns/
│   │   ├── pages/            # Campaigns, CampaignReport, etc.
│   │   ├── flows/            # FlowBuilder e configs
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── stores/
│   ├── queues/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── quick-messages/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── users/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── schedules/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── tags/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── announcements/
│   │   ├── pages/
│   │   └── components/
│   ├── files/
│   │   ├── pages/
│   │   └── components/
│   ├── helps/
│   │   ├── pages/
│   │   └── components/
│   ├── subscription/
│   │   ├── pages/
│   │   └── components/
│   ├── finance/
│   │   ├── pages/
│   │   └── components/
│   ├── prompts/
│   │   ├── pages/
│   │   └── components/
│   └── todolist/
│       ├── pages/
│       └── components/
│
├── ui/                       # Componentes visuais reutilizáveis
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── Input.jsx
│   ├── TableRowSkeleton.jsx
│   └── …
│
├── shared/                   # Hooks e utilidades genéricas
│   ├── hooks/                # useLocalStorage, useDebounce...
│   ├── services/             # api.js, socket.js
│   ├── utils/                # helpers e funções de apoio
│   ├── errors/               # toastError etc.
│   └── i18n/                 # i18n.js, calendar-locale.js, languages/
│
├── entities/                 # Modelos e tipos globais
│   ├── User.ts
│   ├── Ticket.ts
│   └── …
│
├── pages/                    # Entrada SPA (ponto de montagem das rotas)
│   └── index.tsx
│
├── styles/                   # Tailwind config e CSS global
│   ├── tailwind.config.js
│   └── globals.css
│
└── index.tsx                 # Ponto de entrada principal do React/Next


## 🛠️ Ferramentas

As bibliotecas e ferramentas adotadas para a refatoração estão documentadas no arquivo `ferramentas.md`. Ele define o conjunto oficial de tecnologias, substituindo as versões legadas listadas no `package.json` atual.

Toda refatoração deve seguir as recomendações definidas ali (ex.: uso de Zustand para estado, Zod para validação, shadcn/ui para UI, etc.), garantindo consistência técnica entre as features.

## 🗂️ Documentação de Refatorações

Toda refatoração realizada deve ser registrada no arquivo único `REFATORACOES.md`, localizado na raiz do diretório `frontend-refactor/`.

Cada entrada nesse arquivo deve conter:
- A **data**
- O **hash do commit**
- Um **resumo objetivo das mudanças aplicadas**
- (Opcional) observações técnicas relevantes ou pendências

Manter esse histórico consolidado evita retrabalho, ajuda no onboarding e permite rastrear decisões de forma eficiente sem criar múltiplos arquivos dispersos.


## ▶️ Execução

- Instale as dependências com `npm install`.
- Copie `.env.example` para `.env`.
- Inicie com `npm start`.
- Para acessar áreas privadas, use login admin: `admin@admin.com / 123456`.

## ℹ️ Importante

Este arquivo serve como visão geral do **estado atual** da aplicação frontend e dos **próximos passos de migração**.

Para compreender os detalhes, recomenda-se que o agente ou dev interessado faça uma varredura completa no repositório (`frontend/`) original.
