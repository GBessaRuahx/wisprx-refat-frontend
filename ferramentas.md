## **🧱 UI e Componentização**

| **Função**          | **Atualmente**          | **Opções Disponíveis**                     | **Recomendado**  | **Avaliação**                                      |
| ------------------- | ----------------------- | ------------------------------------------ | ---------------- | -------------------------------------------------- |
| **Biblioteca UI**   | Material UI             | shadcn/ui, Radix UI, Material UI           | **shadcn/ui**    | ⭐⭐⭐⭐⭐ moderno, leve, acessível, com Radix embutido |
| **Ícones**          | Material Icons (MUI)    | lucide-react, phosphor-react, MUI Icons    | **lucide-react** | ⭐⭐⭐⭐⭐ minimalista e otimizado para Tailwind        |
| **Classes CSS**     | CSS + Styled Components | clsx, classnames, nativo                   | **clsx**         | ⭐⭐⭐⭐ simples e ideal com Tailwind                  |
| **Temas & Estilos** | Theme MUI + CSS         | Tailwind CSS, styled-components, CSS-in-JS | **Tailwind CSS** | ⭐⭐⭐⭐⭐ robusto, utilitário e pronto para escalar    |

## **⚙️ Estado e Dados**

| **Função**                  | **Atualmente**           | **Opções Disponíveis**            | **Recomendado**    | **Avaliação**                                         |
| --------------------------- | ------------------------ | --------------------------------- | ------------------ | ----------------------------------------------------- |
| **Gerenciamento de Estado** | Context API + useReducer | Zustand, Redux, Context API       | **Zustand**        | ⭐⭐⭐⭐⭐ menos boilerplate, escalável, simples           |
| **Dados assíncronos**       | Axios manual             | TanStack Query, SWR, Axios direto | **TanStack Query** | ⭐⭐⭐⭐⭐ cache inteligente, refetch automático           |
| **HTTP Client**             | Axios                    | axios, fetch, ky, graphql-request | **axios**          | ⭐⭐⭐⭐ já usado, confiável, compatível com interceptors |
| **Zustand Store Layer**     | N/A                    | stores/ por domínio                   | **stores/**           | ⭐⭐⭐⭐ clareza e organização no estado global     |

## **🧩 Arquitetura e DX**

| **Função**             | **Atualmente**                    | **Opções Disponíveis**               | **Recomendado**     | **Avaliação**                             |
| ---------------------- | --------------------------------- | ------------------------------------ | ------------------- | ----------------------------------------- |
| **Componentização UI** | componentes soltos em components/ | ui/ + Storybook, atomic, sem padrão  | **ui/ + Storybook** | ⭐⭐⭐⭐⭐ clareza, documentação, DRY real     |
| **Forms**              | Forms manuais com useState        | React Hook Form, Formik, HTML nativo | **React Hook Form** | ⭐⭐⭐⭐ melhor DX e integração com Zod       |
| **Validação**          | Nada ou manual                    | Zod, Yup, Joi                        | **Zod**             | ⭐⭐⭐⭐⭐ type-safe, leve, compatível com RHF |
| **Aliases de import**  | imports relativos ../../../       | tsconfig.paths, vite.config, webpack | **tsconfig.paths**  | ⭐⭐⭐⭐ mais legível, menos bugs de import   |
| **Forms por domínio**       | centralizado ou misto  | forms/ dentro de cada feature         | **forms/**            | ⭐⭐⭐ clareza de contexto e reutilização parcial  |

## **🌍 Internacionalização e Acessibilidade**

| **Função**         | **Atualmente**    | **Opções Disponíveis** | **Recomendado** | **Avaliação**             |
| ------------------ | ----------------- | ---------------------- | --------------- | ------------------------- |
| **i18n**           | i18next           | i18next, react-i18n    | **i18next**     | ⭐⭐⭐⭐ robusto, já adotado  |
| **Acessibilidade** | parcial (via MUI) | Radix UI, manual       | **Radix UI**    | ⭐⭐⭐⭐⭐ embutido via shadcn |

## **🧪 Testes**

| **Função**    | **Atualmente** | **Opções Disponíveis**              | **Recomendado**  | **Avaliação**                   |
| ------------- | -------------- | ----------------------------------- | ---------------- | ------------------------------- |
| **Unitários** | Nenhum padrão  | Jest, Vitest, React Testing Library | **Vitest + RTL** | ⭐⭐⭐⭐ rápido, moderno, ótimo DX  |
| **E2E**       | Nenhum         | Cypress, Playwright                 | **Cypress**      | ⭐⭐⭐⭐ ideal pra SPAs como Wisprx |

## **🔥 Extras úteis**

| **Função**             | **Atualmente** | **Opções Disponíveis**              | **Recomendado**    | **Avaliação**                             |
| ---------------------- | -------------- | ----------------------------------- | ------------------ | ----------------------------------------- |
| **Playground de UI**   | Nenhum         | Storybook, Plasmic, React Live      | **Storybook**      | ⭐⭐⭐⭐ ideal com ui/, isolado e documentado |
| **Devtools de estado** | N/A            | Zustand devtools, TanStack Devtools | **ambos ativados** | ⭐⭐⭐⭐ ajuda muito no debug                 |

## **📊 Visualização e UI interativa**

| **Função**             | **Atualmente**                    | **Opções Disponíveis**        | **Recomendado** | **Avaliação**                                    |
| ---------------------- | --------------------------------- | ----------------------------- | --------------- | ------------------------------------------------ |
| **Gráficos**           | chart.js + react-chartjs-2        | Recharts, chart.js, Victory   | **Recharts**    | ⭐⭐⭐⭐ simples, declarativo, ideal para dashboards |
| **Fluxogramas/Kanban** | react-trello, react-flow-renderer | React Flow, React DnD, custom | **React Flow**  | ⭐⭐⭐⭐ moderno, versátil, integra bem com Zustand  |
| **CSV e Exportação**   | react-csv                         | xlsx, react-csv, papaparse    | **xlsx**        | ⭐⭐⭐⭐ robusto, exporta Excel, CSV e +             |


## 🧬 Tipagem e Modelagem

| **Função**         | **Atualmente** | **Opções Disponíveis**     | **Recomendado** | **Avaliação**                                  |
| ------------------ | -------------- | -------------------------- | --------------- | ---------------------------------------------- |
| **Modelagem de Tipos** | parcial via JS | TypeScript + Zod, JS puro | **TypeScript + Zod** | ⭐⭐⭐⭐⭐ seguro, validado, compartilhável entre front/back |
| **Schemas por Domínio** | ausente         | schemas/ por feature       | **schemas/**    | ⭐⭐⭐⭐ organiza validações por contexto funcional |
| **Entidades Compartilhadas** | entities/ parcial | entities/, types/          | **entities/**   | ⭐⭐⭐⭐ centraliza interfaces e integração API     |

## 📱 Responsividade e Layout

| **Função**          | **Atualmente**    | **Opções Disponíveis**                   | **Recomendado**        | **Avaliação**                                  |
| ------------------- | ----------------- | ---------------------------------------- | ---------------------- | ---------------------------------------------- |
| **Responsividade**  | via MUI breakpoints | Tailwind breakpoints, custom hooks       | **Tailwind + clsx**    | ⭐⭐⭐⭐ leve, sem dependência externa              |
| **Adaptador de Layout** | ausente        | useMediaQuery, layout wrappers, clsx     | **ui/LayoutResponsive**| ⭐⭐⭐ ajuda para visões mobile/desktop separadas  |

---

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