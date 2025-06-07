Cada feature (Tickets, Contacts, Campaigns, etc.) deve ser isolada em features/<domínio>/ com suas páginas, componentes, hooks, serviços e stores. Essa estratégia facilita entender dependências, evita que partes de uma funcionalidade fiquem esquecidas e permite migrar gradualmente sem quebrar o sistema.

Migrar por diretório (ex.: mover todos os components/ de uma vez) tornaria difícil rastrear quais arquivos pertencem a cada domínio, além de exigir grandes refatorações simultâneas. Um método híbrido teria risco similar.

Garantindo que nada seja esquecido

Inventário de arquivos – Gere uma lista (por exemplo, via find frontend/src -type f) e mantenha um checklist. Cada arquivo migrado deve ser marcado ou removido do inventário.

Mapeamento de dependências – Use grep ou IDE para localizar importações de cada módulo antes de movê-lo. Assim, todos os pontos de uso são atualizados.

REFATORACOES.md – Registrar no arquivo (já previsto em AGENTS.md) as features migradas em cada commit, com hash e data, ajuda no controle.

Scripts de validação – Após cada etapa, rode linter e testes (Vitest) no projeto novo para garantir que os módulos recém-migrados continuam funcionando.

Marcação de legados – Enquanto um componente/hook ainda não foi migrado, documente no domínio correspondente ou crie wrappers temporários para facilitar a busca.

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