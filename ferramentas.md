## 🎯 Objetivo

Este documento define todas as decisões técnicas da refatoração do frontend WisprX.

⚠️ Todo código gerado por agentes (ex: Codex, GPT) **deve seguir estritamente estas diretrizes** para garantir consistência com a arquitetura planejada.

Cada item abaixo representa uma escolha validada que substitui a tecnologia anterior.

## 🧱 UI e Componentização

- Biblioteca UI: usar `shadcn/ui`
  - Substitui: Material UI
  - Justificativa: moderno, leve, acessível, baseado em Radix UI
- Ícones: usar `lucide-react`
  - Substitui: Material Icons (MUI)
  - Justificativa: minimalista e otimizado para Tailwind
- Composição de classes CSS: usar `clsx`
  - Substitui: CSS + Styled Components
  - Justificativa: simples e ideal com Tailwind
- Temas e estilos globais: usar `Tailwind CSS`
  - Substitui: Theme MUI + CSS
  - Justificativa: robusto, utilitário e pronto para escalar

## ⚙️ Estado e Dados

- Gerenciamento de estado: usar `Zustand`
  - Substitui: Context API + useReducer
  - Justificativa: menos boilerplate, escalável, simples
- Dados assíncronos: usar `TanStack Query`
  - Substitui: Axios manual
  - Justificativa: cache inteligente, refetch automático
- HTTP Client: usar `axios`
  - Substitui: axios, fetch, ky, graphql-request
  - Justificativa: já usado, confiável, compatível com interceptors
- Armazenamento global: organizar por domínio em `stores/`
  - Substitui: N/A
  - Justificativa: clareza e organização no estado global

## 🧩 Arquitetura e DX

- Componentização UI: usar `ui/ + Storybook`
  - Substitui: componentes soltos em components/
  - Justificativa: clareza, documentação, DRY real
- Forms: usar `React Hook Form`
  - Substitui: Forms manuais com useState
  - Justificativa: melhor DX e integração com Zod
- Validação: usar `Zod`
  - Substitui: Nada ou manual
  - Justificativa: type-safe, leve, compatível com React Hook Form
- Aliases de importação: usar `tsconfig.paths`
  - Substitui: imports relativos ../../../
  - Justificativa: mais legível, menos bugs de import
- Forms por domínio: organizar em `forms/` dentro de cada feature
  - Substitui: centralizado ou misto
  - Justificativa: clareza de contexto e reutilização parcial

## 🌍 Internacionalização e Acessibilidade

- i18n: usar `i18next`
  - Substitui: i18next, react-i18n
  - Justificativa: robusto, já adotado
- Acessibilidade: usar `Radix UI`
  - Substitui: parcial (via MUI)
  - Justificativa: embutido via shadcn

## 🧪 Testes

- Testes unitários: usar `Vitest + React Testing Library`
  - Substitui: Nenhum padrão
  - Justificativa: rápido, moderno, ótimo DX
- Testes E2E: usar `Cypress`
  - Substitui: Nenhum
  - Justificativa: ideal para SPAs como Wisprx

## 🔥 Extras úteis

- Playground de UI: usar `Storybook`
  - Substitui: Nenhum
  - Justificativa: ideal com ui/, isolado e documentado
- Devtools de estado: usar `Zustand devtools` e `TanStack Devtools` ambos ativados
  - Substitui: N/A
  - Justificativa: ajuda muito no debug

## 📊 Visualização e UI interativa

- Gráficos: usar `Recharts`
  - Substitui: chart.js + react-chartjs-2
  - Justificativa: simples, declarativo, ideal para dashboards
- Fluxogramas/Kanban: usar `React Flow`
  - Substitui: react-trello, react-flow-renderer
  - Justificativa: moderno, versátil, integra bem com Zustand
- CSV e Exportação: usar `xlsx`
  - Substitui: react-csv
  - Justificativa: robusto, exporta Excel, CSV e mais

## 🧬 Tipagem e Modelagem

- Modelagem de tipos: usar `TypeScript + Zod`
  - Substitui: parcial via JS
  - Justificativa: seguro, validado, compartilhável entre front/back
- Schemas por domínio: organizar em `schemas/` por feature
  - Substitui: ausente
  - Justificativa: organiza validações por contexto funcional
- Entidades compartilhadas: organizar em `entities/`
  - Substitui: entities/ parcial, types/
  - Justificativa: centraliza interfaces e integração API

## 📱 Responsividade e Layout

- Responsividade: usar `Tailwind + clsx`
  - Substitui: via MUI breakpoints
  - Justificativa: leve, sem dependência externa
- Adaptador de Layout: usar `ui/LayoutResponsive`
  - Substitui: ausente
  - Justificativa: ajuda para visões mobile/desktop separadas

## 📌 Segurança e Dependências

- O frontend original contém centenas de vulnerabilidades herdadas do Create React App (`react-scripts`)
- A nova base usa `Vite`, `Vitest`, `Tailwind`, e `Zustand` para garantir segurança e modernidade
- As seguintes dependências estão proibidas na refatoração:
  - `react-scripts`
  - `jest`
  - `webpack`, `postcss`, `babel` herdado
  - `axios < 1.9.0`
  - `xlsx` com CVEs não resolvidos
- O projeto refatorado deve ser iniciado limpo (`pnpm init`) e seguir os padrões definidos neste arquivo