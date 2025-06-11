


### Refatoração do layout/index.js

O arquivo `frontend/src/layout/index.js` concentrava responsabilidades demais e será dividido em três partes no novo sistema com Next.js App Router. Cada responsabilidade agora terá seu próprio componente especializado, mantendo o código mais limpo, modular e escalável.

#### 🔹 app/layout.tsx
Wrapper visual principal do sistema logado. Renderiza a estrutura geral com `<AppBar />`, `<Sidebar />`, e o `<main>{children}</main>`. Este arquivo importa os dois componentes abaixo e aplica os providers globais via `app/providers.tsx`. Também se conecta aos hooks `useAuth`, `useSocket`, `useSidebar`.

#### 🔹 components/AppBar.tsx
Componente visual do topo do sistema. Mostra nome do usuário, empresa, avatar, idioma, modo escuro, notificações, botão de logout, e outros elementos visuais fixos. Pode usar `AuthContext` ou `useAuth()` diretamente.

#### 🔹 components/Sidebar.tsx
Responsável por renderizar o menu lateral. Substitui o antigo `MainListItems.js`. Suporta Drawer responsivo (`temporary` em mobile, `permanent` em desktop) e recebe os itens de menu como array tipado (`SidebarItem[]`). Utiliza Zustand ou hook `useSidebar()` para controlar estado aberto/fechado.

Essa separação permite escalar facilmente a aplicação, adaptar responsividade e reutilizar partes da UI com clareza.

### Refatoração do MainListItems.js

O arquivo `frontend/src/layout/MainListItems.js` centraliza responsabilidades demais: renderização do menu, lógica de plano, estado de submenus, notificações dinâmicas e uso de múltiplos contextos. Isso viola os princípios de separação de preocupações e dificulta manutenção e testes.

Ele será refatorado e dividido em quatro partes:

#### 🔹 components/Sidebar.tsx
Responsável por renderizar a lista de navegação principal no Drawer. Recebe os itens como props ou via hook `useSidebarItems`. Usa `SidebarItem.tsx` para cada item individual.

#### 🔹 components/SidebarItem.tsx
Renderiza cada entrada da sidebar, incluindo ícone, badge, rótulo e navegação condicional. Suporta submenus com children.

#### 🔹 hooks/useSidebarItems.ts
Contém toda a lógica para:
- Consultar plano (`getPlanCompany`)
- Determinar permissões de exibição por recurso (campanhas, kanban, etc)
- Obter dados dinâmicos (tickets, chats não lidos, status WhatsApp)
- Gerenciar submenus (`openCampaignSubmenu`, `openFlowsSubmenu`)
- Construir e retornar um array tipado de `SidebarItem[]`

#### 🔹 types/SidebarItem.ts
Define a tipagem formal do item de menu:
```ts
export interface SidebarItem {
  label: string;
  path?: string;
  icon?: JSX.Element;
  badge?: number | boolean;
  children?: SidebarItem[];
  permission?: string;
  condition?: boolean;
}
```

Essa estrutura modular torna a sidebar extensível, testável e alinhada com as boas práticas modernas do Next.js.


### Substituição do themeContext.js

O arquivo `frontend/src/layout/themeContext.js` será completamente removido na nova arquitetura. Ele será substituído por uma implementação nativa baseada no `ThemeProvider` do `next-themes`, já integrado ao ecossistema do `shadcn/ui` e ao Tailwind CSS.

O novo controle de tema (claro/escuro) será feito via classe `dark` aplicada no `<html>`, com persistência automática em `localStorage` e integração com o sistema operacional (modo `system`).

#### 🔹 Novo arquivo: components/theme-provider.tsx

```tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

Esse provedor será usado dentro de `app/layout.tsx`, envolvendo toda a aplicação:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

Essa abordagem elimina a necessidade de `ColorModeContext` manual, reduz complexidade e adota o padrão moderno da stack atual do Wisprx.