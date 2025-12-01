# 🚂 Deploy Backend no Railway - Guia Completo

## Método 1: Via Dashboard (MAIS FÁCIL - 5 minutos)

### Passo 1: Criar Conta
1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub

### Passo 2: Deploy do Repositório
1. Clique em **"Deploy from GitHub repo"**
2. Selecione: **DevHelson344/Odont**
3. Clique em **"Deploy Now"**

### Passo 3: Configurar o Backend
1. Após o deploy, clique no serviço criado
2. Vá em **Settings** (ícone de engrenagem)
3. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Build Command**: `npm install`

### Passo 4: Gerar URL Pública
1. Vá em **Settings** → **Networking**
2. Clique em **"Generate Domain"**
3. Copie a URL gerada (ex: `https://odont-backend-production.up.railway.app`)

### Passo 5: Configurar Variáveis (Opcional)
1. Vá em **Variables**
2. Adicione:
   ```
   PORT=3002
   JWT_SECRET=seu-secret-super-seguro-aqui
   NODE_ENV=production
   ```

### Passo 6: Atualizar Frontend na Vercel
1. Acesse: https://vercel.com/dashboard
2. Abra seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Edite `VITE_API_URL`:
   - **Value**: Cole a URL do Railway (sem barra no final)
   - Exemplo: `https://odont-backend-production.up.railway.app`
5. Clique em **Save**
6. Vá em **Deployments** → Clique nos 3 pontinhos → **Redeploy**

---

## Método 2: Via CLI (Alternativo)

### Passo 1: Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Passo 2: Login
```bash
railway login
```

### Passo 3: Deploy
```bash
# Execute o script automático:
railway-deploy.bat

# OU manualmente:
cd backend
railway init
railway up
```

### Passo 4: Gerar Domínio
```bash
railway domain
```

---

## ✅ Verificar se Funcionou

### Teste 1: Backend
Acesse no navegador:
```
https://SUA-URL-RAILWAY.up.railway.app/
```

Deve retornar:
```json
{"message": "Agenda Odontológica API - Funcionando!"}
```

### Teste 2: Login
Acesse no navegador:
```
https://SUA-URL-RAILWAY.up.railway.app/api/procedimentos
```

Deve retornar uma lista de procedimentos.

### Teste 3: Frontend
1. Acesse seu site na Vercel
2. Tente fazer login:
   - Email: `admin@dental.com`
   - Senha: `password`
3. Se funcionar, está tudo certo! 🎉

---

## 🔧 Troubleshooting

### Erro: "Application failed to respond"
- Verifique se o **Start Command** está correto: `npm start`
- Verifique se o **Root Directory** está: `backend`

### Erro: "Module not found"
- Adicione **Build Command**: `npm install`

### Erro de CORS no frontend
Adicione no `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://seu-frontend.vercel.app'],
  credentials: true
}));
```

### Database não persiste
O Railway suporta SQLite, mas em caso de problemas:
1. Vá em **Data** → **Add Database** → **PostgreSQL**
2. Migre o código para usar PostgreSQL

---

## 💰 Limites Gratuitos Railway

- ✅ 500 horas/mês de execução
- ✅ $5 de crédito grátis/mês
- ✅ Suficiente para projetos pequenos/médios

---

## 📊 Monitoramento

No dashboard do Railway você pode ver:
- Logs em tempo real
- Uso de CPU/Memória
- Requisições HTTP
- Erros e crashes

---

## 🎯 Checklist Final

- [ ] Backend deployado no Railway
- [ ] Domínio público gerado
- [ ] URL copiada
- [ ] `VITE_API_URL` atualizada na Vercel
- [ ] Frontend redeploy feito
- [ ] Login testado e funcionando
- [ ] Agendamentos funcionando

---

**Pronto! Seu sistema está 100% online! 🚀**
