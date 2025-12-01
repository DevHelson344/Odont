# 🚀 Guia de Deploy - DentalCloud

## Opções de Deploy

### Recomendado para Produção

**Backend:** Railway ou Render
**Frontend:** Vercel
**Database:** PostgreSQL (Railway/Render)
**CDN:** Cloudflare

---

## 1. Deploy Backend (Railway)

### Passo a Passo

1. **Criar conta no Railway**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto**
   - New Project → Deploy from GitHub repo
   - Selecione o repositório
   - Selecione a pasta `backend`

3. **Configurar variáveis de ambiente**
   ```
   NODE_ENV=production
   PORT=3002
   JWT_SECRET=seu-secret-super-seguro-aqui
   FRONTEND_URL=https://seu-dominio.vercel.app
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Adicionar PostgreSQL**
   - New → Database → PostgreSQL
   - Railway criará automaticamente DATABASE_URL

5. **Deploy**
   - Railway fará deploy automático
   - Anote a URL: `https://seu-app.up.railway.app`

### Migrar de SQLite para PostgreSQL

```javascript
// Atualizar database.js para usar PostgreSQL
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Converter queries SQLite para PostgreSQL
// INTEGER PRIMARY KEY AUTOINCREMENT → SERIAL PRIMARY KEY
// DATETIME → TIMESTAMP
// etc.
```

---

## 2. Deploy Frontend (Vercel)

### Passo a Passo

1. **Criar conta na Vercel**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Importar projeto**
   - New Project → Import Git Repository
   - Selecione o repositório
   - Root Directory: `frontend`

3. **Configurar build**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variáveis de ambiente**
   ```
   VITE_API_URL=https://seu-backend.up.railway.app
   ```

5. **Deploy**
   - Vercel fará deploy automático
   - Domínio: `https://seu-app.vercel.app`

6. **Configurar domínio customizado** (opcional)
   - Settings → Domains
   - Adicionar: `dentalcloud.com.br`

---

## 3. Configurar Stripe Webhooks

1. **Acessar Dashboard Stripe**
   - https://dashboard.stripe.com/webhooks

2. **Adicionar endpoint**
   ```
   URL: https://seu-backend.up.railway.app/api/webhooks/stripe
   Events: 
   - checkout.session.completed
   - invoice.payment_succeeded
   - invoice.payment_failed
   - customer.subscription.deleted
   ```

3. **Copiar Webhook Secret**
   - Adicionar em Railway: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 4. Configurar DNS (Domínio Próprio)

### Cloudflare (Recomendado)

1. **Adicionar domínio no Cloudflare**
   - Adicionar site
   - Atualizar nameservers no registro.br

2. **Configurar DNS**
   ```
   Tipo: CNAME
   Nome: @
   Conteúdo: cname.vercel-dns.com
   Proxy: Ativado (laranja)
   
   Tipo: CNAME
   Nome: api
   Conteúdo: seu-app.up.railway.app
   Proxy: Ativado
   ```

3. **Configurar SSL**
   - SSL/TLS → Full (strict)
   - Edge Certificates → Always Use HTTPS

---

## 5. Monitoramento

### Sentry (Erros)

```bash
npm install @sentry/node @sentry/react
```

```javascript
// backend/server.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Uptime Robot (Disponibilidade)

1. Acesse: https://uptimerobot.com
2. Add New Monitor
3. URL: `https://seu-backend.up.railway.app/health`
4. Interval: 5 minutos

---

## 6. Backup Automático

### Railway

```bash
# Criar backup diário
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Agendar com cron (Railway)
# Adicionar em railway.json:
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/health"
  }
}
```

---

## 7. CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: railway up
```

---

## 8. Checklist Pré-Deploy

### Backend
- [ ] Variáveis de ambiente configuradas
- [ ] PostgreSQL configurado
- [ ] Stripe webhooks configurados
- [ ] Rate limiting ativado
- [ ] Logs configurados
- [ ] Health check endpoint (`/health`)

### Frontend
- [ ] API_URL apontando para produção
- [ ] Build otimizado
- [ ] Assets comprimidos
- [ ] PWA configurado (opcional)
- [ ] Analytics configurado

### Segurança
- [ ] HTTPS obrigatório
- [ ] CORS configurado corretamente
- [ ] Secrets seguros (não commitados)
- [ ] Rate limiting ativo
- [ ] Validação de inputs

### Monitoramento
- [ ] Sentry configurado
- [ ] Uptime monitoring ativo
- [ ] Logs centralizados
- [ ] Alertas configurados

---

## 9. Custos Estimados

### Inicial (até 100 clientes)
- Railway (Backend + DB): $20/mês
- Vercel (Frontend): $0 (hobby)
- Cloudflare (CDN): $0 (free)
- **Total: ~$20/mês**

### Crescimento (100-500 clientes)
- Railway: $50/mês
- Vercel: $20/mês
- Cloudflare: $20/mês
- Sentry: $26/mês
- **Total: ~$116/mês**

### Escala (500+ clientes)
- Railway: $200/mês
- Vercel: $20/mês
- Cloudflare: $50/mês
- Sentry: $80/mês
- **Total: ~$350/mês**

---

## 10. Troubleshooting

### Backend não inicia
```bash
# Verificar logs
railway logs

# Verificar variáveis
railway variables

# Testar localmente
npm run start
```

### Frontend não conecta ao backend
```bash
# Verificar CORS
# Adicionar frontend URL no backend

# Verificar API_URL
console.log(import.meta.env.VITE_API_URL)
```

### Database connection error
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL
```

---

## Suporte

- **Documentação Railway:** https://docs.railway.app
- **Documentação Vercel:** https://vercel.com/docs
- **Documentação Stripe:** https://stripe.com/docs

---

**Última atualização:** Dezembro 2024
