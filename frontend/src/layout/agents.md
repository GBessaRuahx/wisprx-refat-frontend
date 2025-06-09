Below is a suggested plan to refactor the application layout following the directives in AGENT.md.
The goal is to extract the current layout logic from frontend/src/layout/ and migrate it to the new frontend-refactor project while adopting Next.js, TailwindCSS and shadcn/ui components.

1. Estrutura de Diretórios
frontend-refactor/
└─ src/
   ├─ app/
   │  ├─ layout/
   │  │  ├─ LoggedInLayout.tsx    # Wrapper principal
   │  │  ├─ AppBar.tsx            # Barra superior
   │  │  └─ Sidebar.tsx           # Menu lateral
   │  └─ providers/
   │     └─ ThemeProvider.tsx     # Contexto de tema (light/dark)
   ├─ shared/
   │  ├─ config/
   │  │  └─ theme.ts              # Tokens e tema inicial
   │  └─ hooks/
   │     └─ useSidebar.ts         # Lógica de abertura/fechamento do menu
   └─ ui/
      └─ Logo.tsx                 # Logo reutilizável
Os arquivos legados (frontend/src/layout/index.js, MainListItems.js, themeContext.js) permanecerão intactos enquanto a migração acontece.

O novo layout ficará totalmente em TypeScript.

2. Componentização
LoggedInLayout.tsx

Contém a estrutura flex (sidebar + conteúdo) e renderiza <AppBar /> e <Sidebar />.

Recebe children (React.ReactNode) e controla exibição de acordo com estado de autenticação (via hooks da feature auth).

Utiliza TailwindCSS para estilos e componentes de shadcn/ui (Drawer, Button, Avatar, etc.).

Sidebar.tsx

Implementa o menu lateral anteriormente definido em MainListItems.js.

Itens do menu devem ser declarados como um array tipado (SidebarItem[]) para facilitar customização.

Conecta-se a Zustand ou a um hook useSidebar para gerenciar estado (aberto/fechado, colapsado).

AppBar.tsx

Refatora a AppBar do Material‑UI para um header com Tailwind: logo, controles de idioma (LanguageControl), ícone de perfil, botão de logout, notificações.

Centraliza aqui o botão de alternância de tema (claro/escuro) e as interações de usuário.

ThemeProvider.tsx

Implementa contexto para alternância de tema, migrando a lógica de themeContext.js.

Usa tokens definidos em shared/config/theme.ts para gerar classes Tailwind (via className e utilidades do shadcn/ui).

Logo.tsx

Componente simples para exibir o logo atual, recebendo src e alt por props (preparado para customização futura).

3. Passos de Migração
Criar novos arquivos vazios (acima) em frontend-refactor/src/app/layout/ e src/shared/.

Copiar a lógica do antigo index.js para LoggedInLayout.tsx, adaptando:

Estados (useState, useContext) convertidos para tipos explícitos.

Imports do Material‑UI substituídos por componentes shadcn/ui (e.g., <Drawer>, <Button>, <Avatar>).

Classes MUI (makeStyles) transformadas em utilitários Tailwind.

Migrar o conteúdo de MainListItems.js para Sidebar.tsx:

Mapear itens do menu num array e renderizar com .map().

Manter permissões (Can) e controle de colapso, ajustando para hooks/lojas (Zustand) se necessário.

Implementar ThemeProvider.tsx com Context API para armazenar o tema atual e função toggleTheme.

Importar em src/app/App.jsx para envolver a aplicação inteira.

Atualizar src/app/routes/index.jsx e páginas que utilizam o layout:

Páginas logadas renderizam <LoggedInLayout> como wrapper.

Rotas públicas (login, signup) permanecem fora do layout.

Documentar cada arquivo migrado no inventario-frontend-original.txt e adicionar um novo registro em REFATORACOES.md com hash e data.

4. Pontos de Atenção
Manter a mesma experiência visual enquanto o restante do código legado ainda utiliza Material‑UI.

Garantir que todos os estados/contextos necessários (AuthContext, SocketContext, etc.) estejam disponíveis no novo layout via src/app/providers/.

Testar responsividade do Tailwind para replicar o comportamento atual (Drawer temporário em telas menores, AppBar fixa, etc.).

Atualizar importações em qualquer página já migrada para usar @app/layout/LoggedInLayout e @app/providers/ThemeProvider.

5. Compatibilidade e Futuras Migrações
Enquanto o código legado existir, algumas páginas continuarão renderizando o layout antigo.
O novo layout deve ser utilizado apenas nas rotas migradas, garantindo que nenhuma funcionalidade se perca.

Após a conclusão das features principais, remova gradualmente os arquivos da pasta frontend/src/layout/ e referencie frontend-refactor como fonte única.