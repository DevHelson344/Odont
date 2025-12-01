# 📚 Documentação DentalCloud

## Documentos Disponíveis

### Para Desenvolvedores
- **[TECHNICAL-ROADMAP.md](./TECHNICAL-ROADMAP.md)** - Roadmap técnico completo com fases de desenvolvimento
- **[.env.production.example](./.env.production.example)** - Exemplo de configuração para produção

### Para Negócio
- **[EXECUTIVE-SUMMARY.md](./EXECUTIVE-SUMMARY.md)** - Resumo executivo completo do projeto
- **[SALES-STRATEGY.md](./SALES-STRATEGY.md)** - Estratégia de vendas, monetização e projeções
- **[PITCH-DECK.md](./PITCH-DECK.md)** - Pitch completo para investidores
- **[PROFESSIONAL-UPGRADE.md](./PROFESSIONAL-UPGRADE.md)** - Visão geral das transformações realizadas

### Para Lançamento
- **[LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md)** - Checklist completo de lançamento

## Estrutura do Projeto

```
dentalcloud/
├── backend/
│   ├── server.js              # Servidor com multi-tenancy
│   ├── database.js            # Schema profissional
│   ├── payments.js            # Integração Stripe
│   └── .env.example           # Configurações
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx    # Landing page
│       │   ├── SuperAdmin.jsx     # Painel super admin
│       │   └── ...
│       └── ...
├── docs/                      # Esta pasta
├── README.md                  # Documentação principal
└── start.bat                  # Script de inicialização
```

## Início Rápido

```bash
# Executar sistema
start.bat

# Acessar
Frontend: http://localhost:3000
Backend: http://localhost:3002
```

## Próximos Passos

1. Ler [EXECUTIVE-SUMMARY.md](./EXECUTIVE-SUMMARY.md) para visão geral
2. Revisar [SALES-STRATEGY.md](./SALES-STRATEGY.md) para modelo de negócio
3. Seguir [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md) para lançamento
4. Consultar [TECHNICAL-ROADMAP.md](./TECHNICAL-ROADMAP.md) para desenvolvimento
