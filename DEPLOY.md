# 🚀 Deploy na Vercel

## Opção 1: Deploy via CLI (Recomendado)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer login
```bash
vercel login
```

### 3. Deploy
```bash
cd agenda-odontologica
vercel
```

Siga as instruções:
- Set up and deploy? **Y**
- Which scope? Selecione sua conta
- Link to existing project? **N**
- Project name? **odont** (ou deixe o padrão)
- In which directory is your code located? **./**
- Want to override settings? **N**

### 4. Deploy em produção
```bash
vercel --prod
```

---

## Opção 2: Deploy via Dashboard (Mais Fácil)

### 1. Acesse [vercel.com](https://vercel.com)

### 2. Clique em "Add New Project"

### 3. Importe o repositório
- Conecte sua conta GitHub
- Selecione: **DevHelson344/Odont**

### 4. Configure o projeto
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 5. Variáveis de Ambiente
Adicione em "Environment Variables":
```
VITE_API_URL=https://seu-backend.vercel.app
```

### 6. Deploy
Clique em **Deploy**

---

## ⚠️ IMPORTANTE: Backend Separado

O SQLite não funciona na Vercel (serverless). Você tem 2 opções:

### Opção A: Backend em outro serviço (Recomendado)
Deploy o backend em:
- **Railway**: https://railway.app (Grátis, suporta SQLite)
- **Render**: https://render.com (Grátis, suporta SQLite)
- **Fly.io**: https://fly.io (Grátis, suporta SQLite)

#### Deploy no Railway:
```bash
# 1. Instalar CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
cd backend
railway init

# 4. Deploy
railway up
```

### Opção B: Migrar para PostgreSQL
Substituir SQLite por PostgreSQL (Vercel Postgres ou Supabase)

---

## 📝 Checklist Pós-Deploy

- [ ] Backend deployado e funcionando
- [ ] Frontend deployado
- [ ] Variável `VITE_API_URL` configurada no frontend
- [ ] Testar login: admin@dental.com / password
- [ ] Verificar CORS no backend
- [ ] Testar criação de agendamento

---

## 🔧 Troubleshooting

### Erro de CORS
Adicione no `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://seu-frontend.vercel.app'],
  credentials: true
}));
```

### API não conecta
Verifique se `VITE_API_URL` está correto nas variáveis de ambiente da Vercel.

### Database não funciona
SQLite não funciona em serverless. Use Railway/Render para o backend.
