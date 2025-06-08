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

Registrar tudo no REFATORACOES.md.

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

Ferramentas como Tailwind, Vitest, Storybook e ESLint devem estar configuradas conforme `ferramentas.md`.

## 🗂️ Documentação de Refatorações


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


Toda refatoração realizada deve ser registrada no arquivo único `REFATORACOES.md`, localizado na raiz do diretório `frontend-refactor/`.


### 🔄 Estratégia de Refatoração por Feature

O processo de refatoração seguirá o padrão:

1. Escolher uma feature com base em `src/pages/<FeatureName>/`
2. Fazer varredura completa da pasta original:
   - Identificar todos os arquivos diretos da página
   - Rastrear todos os elementos usados: components, modals, hooks, services, stores, utils, i18n, etc
   - Verificar dependências cruzadas e rotas associadas
3. Migrar essa feature para `src/features/<FeatureName>/` com subpastas adequadas (`pages`, `components`, `hooks`, etc)
4. Converter os componentes para Tailwind e shadcn/ui mantendo 100% do comportamento visual
5. Substituir todos os imports antigos no projeto por imports da nova estrutura
6. Validar funcionalidade manualmente e via testes
7. Marcar os arquivos migrados no `inventario-frontend-original.txt`
8. Registrar no `REFATORACOES.md` a hash do commit, data e arquivos migrados

✅ Nenhuma funcionalidade pode ser perdida na migração. Tudo que existe visual e logicamente no frontend original deve estar no novo. Não pode quebrar rotas, telas ou comportamento.
