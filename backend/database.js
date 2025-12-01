import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('agenda-pro.db');

// Inicializar tabelas com multi-tenancy
db.serialize(() => {
  // Organizações (Clínicas)
  db.run(`CREATE TABLE IF NOT EXISTS organizacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    email TEXT NOT NULL,
    telefone TEXT,
    endereco TEXT,
    plano TEXT DEFAULT 'trial',
    status TEXT DEFAULT 'ativo',
    data_trial_fim DATE,
    data_proxima_cobranca DATE,
    subdominio TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Assinaturas
  db.run(`CREATE TABLE IF NOT EXISTS assinaturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizacao_id INTEGER NOT NULL,
    plano TEXT NOT NULL,
    valor REAL NOT NULL,
    status TEXT DEFAULT 'ativa',
    metodo_pagamento TEXT,
    stripe_subscription_id TEXT,
    mercadopago_subscription_id TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id)
  )`);

  // Planos
  db.run(`CREATE TABLE IF NOT EXISTS planos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    valor_mensal REAL NOT NULL,
    valor_anual REAL,
    max_dentistas INTEGER,
    max_pacientes INTEGER,
    features TEXT,
    ativo BOOLEAN DEFAULT 1
  )`);

  // Usuários (com organização)
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizacao_id INTEGER,
    email TEXT NOT NULL,
    senha TEXT NOT NULL,
    nome TEXT NOT NULL,
    tipo TEXT DEFAULT 'dentista',
    paciente_id INTEGER,
    ativo BOOLEAN DEFAULT 1,
    ultimo_acesso DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes (id),
    UNIQUE(organizacao_id, email)
  )`);

  // Pacientes (com organização)
  db.run(`CREATE TABLE IF NOT EXISTS pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizacao_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    cpf TEXT,
    telefone TEXT,
    email TEXT,
    data_nascimento DATE,
    endereco TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id)
  )`);

  // Procedimentos (com organização)
  db.run(`CREATE TABLE IF NOT EXISTS procedimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizacao_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    duracao INTEGER NOT NULL,
    valor REAL,
    ativo BOOLEAN DEFAULT 1,
    FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id)
  )`);

  // Agendamentos (com organização)
  db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizacao_id INTEGER NOT NULL,
    paciente_id INTEGER NOT NULL,
    dentista_id INTEGER NOT NULL,
    procedimento_id INTEGER NOT NULL,
    data_hora DATETIME NOT NULL,
    status TEXT DEFAULT 'agendado',
    observacoes TEXT,
    valor_cobrado REAL,
    confirmado BOOLEAN DEFAULT 0,
    lembrete_enviado BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes (id),
    FOREIGN KEY (dentista_id) REFERENCES usuarios (id),
    FOREIGN KEY (procedimento_id) REFERENCES procedimentos (id)
  )`);

  // Fila de encaixe (com organização)
  db.run(`CREATE TABLE IF NOT EXISTS fila_encaixe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizacao_id INTEGER NOT NULL,
    paciente_id INTEGER NOT NULL,
    procedimento_id INTEGER NOT NULL,
    data_preferencia DATE,
    ativo BOOLEAN DEFAULT 1,
    notificado BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes (id),
    FOREIGN KEY (procedimento_id) REFERENCES procedimentos (id)
  )`);

  // Logs de auditoria
  db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizacao_id INTEGER,
    usuario_id INTEGER,
    acao TEXT NOT NULL,
    entidade TEXT NOT NULL,
    entidade_id INTEGER,
    dados_anteriores TEXT,
    dados_novos TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
  )`);

  // Notificações
  db.run(`CREATE TABLE IF NOT EXISTS notificacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizacao_id INTEGER NOT NULL,
    usuario_id INTEGER,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    mensagem TEXT,
    lida BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
  )`);

  // Inserir planos padrão
  db.run(`INSERT OR IGNORE INTO planos (id, nome, descricao, valor_mensal, valor_anual, max_dentistas, max_pacientes, features) VALUES 
    (1, 'Básico', 'Ideal para dentistas autônomos', 97.00, 970.00, 1, 100, '["agenda", "pacientes", "whatsapp"]'),
    (2, 'Profissional', 'Para clínicas pequenas', 197.00, 1970.00, 3, 500, '["agenda", "pacientes", "whatsapp", "relatorios", "fila_encaixe"]'),
    (3, 'Clínica', 'Para clínicas completas', 397.00, 3970.00, -1, -1, '["agenda", "pacientes", "whatsapp", "relatorios", "fila_encaixe", "multi_unidades", "api"]')`);

  // Super admin
  db.run(`INSERT OR IGNORE INTO usuarios (id, email, senha, nome, tipo) VALUES 
    (1, 'admin@dentalcloud.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin', 'superadmin')`);

  console.log('✅ Banco de dados profissional inicializado');
});

export default db;
