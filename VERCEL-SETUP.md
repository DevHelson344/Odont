# ⚡ Deploy Frontend na Vercel - Guia Completo

## Método 1: Via Dashboard (MAIS FÁCIL - 3 minutos)

### Passo 1: Criar Conta
1. Acesse: https://vercel.com/signup
2. Faça login com GitHub

### Passo 2: Importar Projeto
1. Clique em **"Add New..."** → **"Project"**
2. Clique em **"Import Git Repository"**
3. Procure e selecione: **DevHelson344/Odont**
4. Clique em **"Import"**

### Passo 3: Configurar Build
Configure exatamente assim:

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Passo 4: Variáveis de Ambiente
Clique em **"Environment Variables"** e adicione:

```
Name: VITE_API_URL
Value: https://SUA-URL-DO-RAILWAY.up.railway.app
```

⚠️ **IMPORTANTE:** 
- Cole a URL do Railway que você copiou
- **SEM barra (/) no final**
- Exemplo: `https://odont-backend-production.up.railway.app`

### Passo 5: Deploy
1. Clique em **"Deploy"**
2. Aguarde 1-2 minutos
3. Clique no link gerado (ex: `https://odont-app.vercel.app`)

---

## Método 2: Via CLI (Alternativo)

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Passo 2: Login
```bash
vercel login
```

### Passo 3: Deploy
```bash
cd agenda-odontologica/frontend
vercel
```

Responda as perguntas:
```
? Set up and deploy? Y
? Which scope? [sua conta]
? Link to existing project? N
? What's your project's name? odont_frontend
? In which directory is your code located? ./
? Want to override the settings? Y
  ? Build Command? npm run build
  ? Output Directory? dist
  ? Development Command? npm run dev
```

### Passo 4: Adicionar Variável de Ambiente
```bash
vercel env add VITE_API_URL
```

Cole a URL do Railway quando solicitado.

### Passo 5: Deploy em Produção
```bash
vercel --prod
```

---

## ✅ Verificar se Funcionou

### Teste 1: Acessar o Site
Acesse a URL da Vercel (ex: `https://odont-app.vercel.app`)

Deve aparecer a tela de login.

### Teste 2: Fazer Login
Credenciais de teste:
```
Email: admin@dental.com
Senha: password
```

Se entrar no dashboard, está funcionando! 🎉

### Teste 3: Criar Agendamento
1. Vá em "Agenda"
2. Clique em um horário
3. Preencha os dados
4. Salve

Se salvar e aparecer na agenda, está 100%! ✅

---

## 🔧 Troubleshooting

### Erro: "Failed to fetch" ou "ERR_CONNECTION_REFUSED"

**Causa:** Frontend não está conectando ao backend

**Solução:**
1. Verifique se o backend está rodando no Railway
2. Acesse: `https://SUA-URL-RAILWAY/` 
3. Deve retornar: `{"message": "Agenda Odontológica API - Funcionando!"}`
4. Se não funcionar, volte no Railway e verifique os logs

**Se o backend estiver OK:**
1. Vá na Vercel → Settings → Environment Variables
2. Verifique se `VITE_API_URL` está correto
3. Edite se necessário
4. Vá em Deployments → Redeploy

### Erro: "404 Not Found"

**Causa:** Rota não encontrada

**Solução:**
1. Verifique se o Root Directory está: `frontend`
2. Verifique se o Output Directory está: `dist`
3. Faça redeploy

### Erro de CORS

**Causa:** Backend bloqueando requisições do frontend

**Solução:**
1. Vá no Railway → Variables
2. Adicione:
   ```
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```
3. Aguarde o redeploy automático

### Build falhou

**Causa:** Erro de dependências ou código

**Solução:**
1. Vá em Deployments → Clique no deploy falhado
2. Veja os logs de erro
3. Corrija o código no GitHub
4. Push automático fará novo deploy

---

## 🎨 Personalizar Domínio (Opcional)

### Usar Domínio Próprio
1. Vá em Settings → Domains
2. Clique em "Add"
3. Digite seu domínio (ex: `agenda.seusite.com`)
4. Configure o DNS conforme instruções

### Usar Subdomínio Vercel
Por padrão você terá: `seu-projeto.vercel.app`

Para mudar:
1. Settings → Domains
2. Edite o domínio padrão

---

## 🔄 Atualizações Automáticas

Toda vez que você fizer push no GitHub:
- ✅ Vercel detecta automaticamente
- ✅ Faz build e deploy
- ✅ Atualiza o site em ~1 minuto

Para desabilitar:
1. Settings → Git
2. Desmarque "Production Branch"

---

## 📊 Monitoramento

No dashboard da Vercel você pode ver:
- Analytics de visitantes
- Tempo de carregamento
- Logs de build
- Uso de banda

---

## 💰 Limites Gratuitos Vercel

- ✅ 100 GB de banda/mês
- ✅ Builds ilimitados
- ✅ Deploy automático
- ✅ SSL grátis
- ✅ Suficiente para projetos pequenos/médios

---

## 🎯 Checklist Final

- [ ] Frontend deployado na Vercel
- [ ] URL pública gerada
- [ ] `VITE_API_URL` configurada
- [ ] Site acessível
- [ ] Login funcionando
- [ ] Agendamentos funcionando
- [ ] Backend Railway conectado

---

## 🚀 URLs Finais

Anote suas URLs:

```
Frontend (Vercel): https://_____________________.vercel.app
Backend (Railway): https://_____________________.up.railway.app
GitHub: https://github.com/DevHelson344/Odont
```

---

**Pronto! Seu sistema está 100% online e funcionando! 🎉**

Compartilhe a URL da Vercel com seus usuários!
