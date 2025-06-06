# WisprX

Este diretório contém o código-fonte principal da plataforma **WisprX**, dividido em dois módulos independentes: backend e frontend.

---

## 📦 Estrutura

```
wisprx-app/
├── backend/     → API em Node.js (Express) com PostgreSQL + Redis
│   └── Dockerfile
├── frontend/    → SPA em React com build custom (server.js), sem uso de Vite
│   └── Dockerfile
```

---

## 🧠 Backend (`backend/`)

- Framework: [Express](https://expressjs.com/)
- Linguagem: Node.js (v20)
- Banco de Dados: PostgreSQL
- Cache e fila: Redis + Bull
- ORM: Sequelize
- Ambiente padrão: `.env.backend`

### Arquitetura
- Organizado por `controllers/`, `services/`, `repositories/`
- Utiliza `JWT` para autenticação (access e refresh token)
- Integração com fila de jobs (Bull)
- Permite rodar via PM2 (legado) ou Docker

---

## 💻 Frontend (`frontend/`)

SPA em React estruturada em diretórios como `components/`, `pages/`, `stores/`, `hooks/`, `context/`, mas com inconsistências internas acumuladas.

### Tecnologias:
- React com build custom (`server.js`) — **não usa Vite**
- TailwindCSS + Material UI (diversas versões misturadas)
- Zustand para estado global
- React Query para dados assíncronos

### Pontos de atenção:
- Stack visual fragmentada: coexistência de Tailwind e múltiplas versões do Material UI
- `rules.js`, `translate/` e `utils/` possuem lógica de negócio e internacionalização acopladas ao front
- Hooks, stores e services ainda seguem padrões mistos
- Estrutura será padronizada e modularizada em refatoração futura

---

## 🔁 Build de Imagens Docker

As imagens do frontend e backend são geradas diretamente a partir dos `Dockerfile` contidos em seus diretórios.

### Backend

```bash
docker build -f backend/Dockerfile -t gbessaruahx/wisprx-backend:<tenant>-<tag> .
```

### Frontend

```bash
docker build \
  -f frontend/Dockerfile \
  --build-arg REACT_APP_BACKEND_URL=https://api.ruahx.online \
  --build-arg REACT_APP_HOURS_CLOSE_TICKETS_AUTO=24 \
  -t gbessaruahx/wisprx-frontend:<tenant>-<tag> .
```

> 💡 Use o script `build-frontend.sh` com os argumentos `<tenant> <tag>` para facilitar o build local com `.env.frontend.<tenant>`.

### Boas práticas

- Evite `:latest` em produção
- Use `TENANT-TAG` como padrão de versionamento (ex: `wisprx-v1`)
- Utilize o `docker push` para publicar após o build

---

## 📁 Ambientes

- `.env.backend.<tenant>` e `.env.frontend.<tenant>` são gerados pelo `wisprx-deploy`
- Contêm todas as variáveis necessárias para execução dos serviços e builds

---

## 📌 Observações

- O backend e frontend são desacoplados e comunicam-se via HTTP
- Podem ser versionados, testados e implantados separadamente
- O padrão de desenvolvimento segue separação de domínio, injeção de dependência e reutilização de lógica em `services/`

---

## 🛠️ Tecnologias

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Sequelize](https://sequelize.org/)
- [Bull](https://docs.bullmq.io/)

### Frontend
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Query](https://tanstack.com/query)

---

### Roles de usuário

- **Proprietário**: usuário principal da conta. Sempre possui permissão de super e pode transferir a propriedade para outro usuário.
- **Admin SaaS**: administrador com privilégios de super, mas sem status de proprietário.
- **Nenhum**: usuário padrão sem privilégios administrativos.

Para transferir a propriedade, o atual proprietário deve editar outro usuário e definir a opção "Proprietário". O dono anterior é automaticamente removido desse status.

---

## 🖇️ Colaborando

Em breve...

---

## 📌 Versão

Versão 1.0.0

---

## 📄 Licença

Este projeto é proprietário.
Todos os direitos reservados a [WisprX](https://wisprx.com).