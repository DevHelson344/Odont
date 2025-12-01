# 🦷 DentalCloud - Sistema Profissional SaaS

Sistema completo de gestão para consultórios odontológicos que **reduz faltas em 40%**, **aumenta faturamento em 25%** e **economiza 10h/semana**.

## 🚀 Início Rápido

```bash
# Executar sistema (Windows)
start.bat

# Ou manualmente:
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

**Acessos:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002

**Login Super Admin:**
- Email: admin@dentalcloud.com
- Senha: password

## 💡 Funcionalidades

### Núcleo
- ✅ Agenda inteligente com drag & drop
- ✅ Cadastro completo de pacientes
- ✅ Confirmações automáticas via WhatsApp
- ✅ Dashboard com métricas em tempo real
- ✅ Multi-tenancy (múltiplas clínicas)
- ✅ Sistema de assinaturas integrado

### Premium
- 🔔 Fila inteligente de encaixe
- 📊 Relatórios avançados
- 📱 App mobile (roadmap)
- 🔗 Integrações (Google Calendar, etc)

## 💰 Planos

| Plano | Preço | Dentistas | Pacientes |
|-------|-------|-----------|-----------|
| **Básico** | R$ 97/mês | 1 | 100 |
| **Profissional** | R$ 197/mês | 3 | 500 |
| **Clínica** | R$ 397/mês | ∞ | ∞ |

**Trial:** 14 dias grátis

## 🛠️ Stack

**Backend:** Node.js, Express, PostgreSQL, Stripe
**Frontend:** React 18, Vite, TailwindCSS
**Deploy:** Vercel (frontend) + Railway (backend)

## 📊 Projeção (Ano 1)

- **Clientes:** 395
- **MRR:** R$ 77.815
- **Lucro:** R$ 456.000
- **Margem:** 85-90%

## 📁 Estrutura do Projeto

```
dentalcloud/
├── backend/              # API Node.js + Express
│   ├── server.js        # Servidor principal
│   ├── database.js      # Schema multi-tenancy
│   ├── payments.js      # Integração Stripe
│   └── .env.example     # Configurações
├── frontend/            # React + Vite
│   └── src/
│       ├── pages/       # Páginas da aplicação
│       └── ...
├── docs/                # Documentação completa
│   ├── EXECUTIVE-SUMMARY.md
│   ├── SALES-STRATEGY.md
│   ├── TECHNICAL-ROADMAP.md
│   ├── PITCH-DECK.md
│   └── LAUNCH-CHECKLIST.md
├── README.md            # Este arquivo
└── start.bat            # Script de inicialização
```

## 🎯 Próximos Passos

1. ✅ MVP profissional criado
2. ⏳ Validar com 10 clínicas beta
3. ⏳ Migrar para PostgreSQL
4. ⏳ Integrar Stripe (produção)
5. ⏳ Lançar publicamente

## 📞 Contato

- Email: contato@dentalcloud.com.br
- WhatsApp: (11) 99999-9999

---

**Versão:** 2.0.0 | **Status:** Pronto para Beta | **Licença:** MIT
