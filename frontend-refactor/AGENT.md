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
└── stores/       # Estado local com Zustand
```

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

Migrar por diretório (ex.: mover todos os components/ de uma vez) tornaria difícil rastrear quais arquivos pertencem a cada domínio, além de exigir grandes refatorações simultâneas. Um método híbrido teria risco similar.

Garantindo que nada seja esquecido

Inventário de arquivos – Gere uma lista (por exemplo, via find frontend/src -type f) e mantenha um checklist. Cada arquivo migrado deve ser marcado ou removido do inventário.

Mapeamento de dependências – Use grep ou IDE para localizar importações de cada módulo antes de movê-lo. Assim, todos os pontos de uso são atualizados.

REFATORACOES.md – Registrar no arquivo (já previsto em AGENTS.md) as features migradas em cada commit, com hash e data, ajuda no controle.

Scripts de validação – Após cada etapa, rode linter e testes (Vitest) no projeto novo para garantir que os módulos recém-migrados continuam funcionando.

Marcação de legados – Enquanto um componente/hook ainda não foi migrado, documente no domínio correspondente ou crie wrappers temporários para facilitar a busca.

Tarefas Iniciais

1. Finalizar configuração básica do `frontend-refactor` (Next.js, Tailwind, ESLint, Prettier e Vitest).
2. Copiar `services/api.js`, `translate/` e utilidades para `src/shared/`.
3. Criar pasta `entities/` com tipos iniciais como `User` e `Ticket`.
4. Montar feature `auth` com páginas, hooks e componentes dedicados.
5. Ajustar rotas em `src/app/routes` para utilizar essas novas páginas.
6. Reunir componentes do Dashboard em `features/dashboard/`.
7. Iniciar migração de Tickets para `features/tickets/`, convertendo para Tailwind e shadcn/ui.
8. Registrar cada passo no `REFATORACOES.md` e remover arquivos antigos conforme avançar.

Plano tático inicial

Preparação do novo projeto

Finalizar a configuração básica do frontend-refactor (Next.js + Tailwind + ESLint + Prettier + Vitest), conforme package.json já criado.

Migrar camadas compartilhadas

Copiar e adaptar services/api.js, translate/ e utilidades simples para src/shared/.

Criar entities/ com tipos iniciais em TypeScript (ex.: User, Ticket).

Migrar o domínio de Autenticação (pequeno e essencial)

Criar features/auth/ contendo:

páginas (Login, Signup, ForgetPassword),

hooks (useAuth),

componentes específicos.

Ajustar rotas em src/app/routes para apontar para essas novas páginas.

Migrar Dashboard

Reunir componentes e hooks usados apenas nessa área em features/dashboard/.

Migrar Tickets (maior e mais complexo)

Reunir páginas Tickets, Chat, TicketResponsiveContainer e todos os componentes/hook relacionados.

Converter gradualmente para Tailwind e shadcn/ui, removendo dependências do MUI.

Migrar demais domínios (Contacts, Campaigns, QuickMessages...)

Repetir o processo: mover arquivos, ajustar importações, substituir Material‑UI.

Limpeza contínua

A cada domínio migrado, renomear arquivos antigos do diretório frontend/ para garantir que nao sera feito novamente. eliminar duplicidades (*.old, *.bkp).

Usar o arquivo frontend/inventario-frontend-original.txt para guiar o que ja foi feito, e no fim de cada refatoraçao, atualizar o arquivo marcando como feito o item na lista.

Registrar tudo no REFATORACOES.md.

Testes e verificação

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

Antes de iniciar a refatoração de qualquer feature, é obrigatório garantir que as ferramentas essenciais estejam corretamente configuradas na base do projeto. Isso inclui:

- Configuração do Storybook (inicializado e funcional)
- Criação do arquivo `.storybook/preview.ts` com providers globais e tema
- Setup do ESLint + Prettier com regras compartilhadas
- Arquivo `tsconfig.json` com aliases e paths
- Estrutura de testes com `Vitest` e configuração de `setupTests.ts`
- Tailwind CSS pronto com `tailwind.config.js` e `globals.css`
- Dependências instaladas conforme definido em `ferramentas.md`

Essas configurações devem estar prontas antes de começar qualquer refatoração para evitar retrabalho e garantir consistência nos arquivos migrados.

As bibliotecas e ferramentas adotadas para a refatoração estão documentadas no arquivo `ferramentas.md`. Ele define o conjunto oficial de tecnologias, substituindo as versões legadas listadas no `package.json` atual.

Toda refatoração deve seguir as recomendações definidas ali (ex.: uso de Zustand para estado, Zod para validação, shadcn/ui para UI, etc.), garantindo consistência técnica entre as features.

## 📌 Observações sobre Segurança e Atualização

Durante o processo de refatoração, um `npm audit` foi executado no frontend original e revelou **centenas de vulnerabilidades críticas e altas**, a maioria herdada do uso do Create React App (`react-scripts`) e bibliotecas relacionadas (`postcss`, `webpack`, `babel`, `jest`, etc).

Como parte do processo de refatoração, **todas as dependências abaixo devem ser substituídas** ou atualizadas por equivalentes modernas já listadas nas tabelas acima:

- `react-scripts` → substituído por **Vite**
- `jest` → substituído por **Vitest**
- `postcss`, `webpack`, `css-loader`, etc. → eliminados com Tailwind + Vite
- `axios@<1.9.0` → atualizado para versão segura (1.9+)
- `xlsx` → revisar versão ou substituir (sem correção conhecida)
- `babel` → modernizar com Vite/Babel minimalista, evitar presets herdados

📌 **Recomenda-se NÃO reaproveitar a árvore de dependências antiga.** A refatoração deve partir de uma base limpa (`pnpm init`, `vite`, etc.), e os pacotes devem ser instalados conforme definidos neste arquivo de ferramentas.

👉 Este arquivo deve ser atualizado sempre que houver substituições críticas para que a documentação e a prática sigam alinhadas.

## 🗂️ Documentação de Refatorações

Toda refatoração realizada deve ser registrada no arquivo único `REFATORACOES.md`, localizado na raiz do diretório `frontend-refactor/`.