import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './database.js';
import { format, addDays, isBefore, parseISO } from 'date-fns';
import cron from 'node-cron';
import rateLimit from 'express-rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || 'dental-pro-secret-key-change-in-production';
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());

// Middleware de autenticação
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // Verificar se organização está ativa
    if (decoded.organizacao_id) {
      db.get('SELECT status, plano FROM organizacoes WHERE id = ?', [decoded.organizacao_id], (err, org) => {
        if (err || !org || org.status !== 'ativo') {
          return res.status(403).json({ error: 'Organização inativa ou suspensa' });
        }
        req.organizacao = org;
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const superAdminAuth = (req, res, next) => {
  if (req.user.tipo !== 'superadmin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

const adminAuth = (req, res, next) => {
  if (!['admin', 'superadmin'].includes(req.user.tipo)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// Função de auditoria
function logAudit(organizacao_id, usuario_id, acao, entidade, entidade_id, dados) {
  db.run(`INSERT INTO audit_logs (organizacao_id, usuario_id, acao, entidade, entidade_id, dados_novos) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    [organizacao_id, usuario_id, acao, entidade, entidade_id, JSON.stringify(dados)]);
}

// ==================== ROTAS PÚBLICAS ====================

app.get('/', (req, res) => {
  res.json({ 
    message: 'DentalCloud API - Sistema Profissional',
    version: '2.0.0',
    status: 'online'
  });
});

// Cadastro de nova organização (trial)
app.post('/api/register', async (req, res) => {
  const { nome_clinica, nome_admin, email, senha, telefone, cnpj } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const dataTrialFim = format(addDays(new Date(), 14), 'yyyy-MM-dd');
    
    // Criar organização
    db.run(`INSERT INTO organizacoes (nome, email, telefone, cnpj, plano, status, data_trial_fim) 
            VALUES (?, ?, ?, ?, 'trial', 'ativo', ?)`,
      [nome_clinica, email, telefone, cnpj, dataTrialFim], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao criar organização' });
        
        const organizacao_id = this.lastID;
        
        // Criar usuário admin
        db.run(`INSERT INTO usuarios (organizacao_id, email, senha, nome, tipo) 
                VALUES (?, ?, ?, ?, 'admin')`,
          [organizacao_id, email, hashedPassword, nome_admin], function(err) {
            if (err) return res.status(500).json({ error: 'Erro ao criar usuário' });
            
            // Criar procedimentos padrão
            const procedimentos = [
              ['Consulta', 30, 80.00],
              ['Limpeza', 45, 120.00],
              ['Obturação', 60, 200.00],
              ['Extração', 45, 150.00],
              ['Canal', 90, 400.00]
            ];
            
            procedimentos.forEach(([nome, duracao, valor]) => {
              db.run(`INSERT INTO procedimentos (organizacao_id, nome, duracao, valor) VALUES (?, ?, ?, ?)`,
                [organizacao_id, nome, duracao, valor]);
            });
            
            logAudit(organizacao_id, this.lastID, 'CREATE', 'organizacao', organizacao_id, { nome_clinica });
            
            res.json({ 
              success: true,
              organizacao_id,
              trial_dias: 14,
              message: 'Organização criada com sucesso! Trial de 14 dias ativado.'
            });
          });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  
  db.get('SELECT * FROM usuarios WHERE email = ? AND ativo = 1', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
    
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) return res.status(401).json({ error: 'Senha incorreta' });
    
    // Atualizar último acesso
    db.run('UPDATE usuarios SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      tipo: user.tipo,
      organizacao_id: user.organizacao_id,
      nome: user.nome
    }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        tipo: user.tipo,
        nome: user.nome,
        organizacao_id: user.organizacao_id
      } 
    });
  });
});

// Listar planos
app.get('/api/planos', (req, res) => {
  db.all('SELECT * FROM planos WHERE ativo = 1', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(p => ({
      ...p,
      features: JSON.parse(p.features)
    })));
  });
});

// ==================== ROTAS AUTENTICADAS ====================

// Dashboard da organização
app.get('/api/dashboard', auth, adminAuth, (req, res) => {
  const hoje = format(new Date(), 'yyyy-MM-dd');
  const org_id = req.user.organizacao_id;
  
  db.get(`SELECT COUNT(*) as total FROM agendamentos 
          WHERE organizacao_id = ? AND DATE(data_hora) = ? AND status != 'cancelado'`, 
    [org_id, hoje], (err, agendamentos) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.get(`SELECT SUM(valor_cobrado) as faturamento FROM agendamentos 
              WHERE organizacao_id = ? AND DATE(data_hora) = ? AND status = 'concluido'`, 
        [org_id, hoje], (err, faturamento) => {
          if (err) return res.status(500).json({ error: err.message });
          
          db.get(`SELECT COUNT(*) as total FROM pacientes WHERE organizacao_id = ? AND ativo = 1`, 
            [org_id], (err, pacientes) => {
              if (err) return res.status(500).json({ error: err.message });
              
              res.json({
                agendamentos_hoje: agendamentos.total || 0,
                faturamento_hoje: faturamento.faturamento || 0,
                total_pacientes: pacientes.total || 0
              });
            });
        });
    });
});

// PACIENTES
app.get('/api/pacientes', auth, (req, res) => {
  db.all('SELECT * FROM pacientes WHERE organizacao_id = ? AND ativo = 1 ORDER BY nome', 
    [req.user.organizacao_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

app.post('/api/pacientes', auth, adminAuth, (req, res) => {
  const { nome, telefone, email, cpf, data_nascimento } = req.body;
  const org_id = req.user.organizacao_id;
  
  db.run(`INSERT INTO pacientes (organizacao_id, nome, telefone, email, cpf, data_nascimento) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    [org_id, nome, telefone, email, cpf, data_nascimento], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      logAudit(org_id, req.user.id, 'CREATE', 'paciente', this.lastID, { nome, email });
      res.json({ id: this.lastID });
    });
});

// AGENDAMENTOS
app.get('/api/agendamentos', auth, (req, res) => {
  const { data } = req.query;
  const org_id = req.user.organizacao_id;
  
  let query = `
    SELECT a.*, p.nome as paciente_nome, p.telefone, 
           pr.nome as procedimento_nome, pr.duracao, pr.valor,
           u.nome as dentista_nome
    FROM agendamentos a
    JOIN pacientes p ON a.paciente_id = p.id
    JOIN procedimentos pr ON a.procedimento_id = pr.id
    JOIN usuarios u ON a.dentista_id = u.id
    WHERE a.organizacao_id = ?
  `;
  
  let params = [org_id];
  
  if (data) {
    query += ' AND DATE(a.data_hora) = ?';
    params.push(data);
  }
  
  query += ' ORDER BY a.data_hora';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/agendamentos', auth, (req, res) => {
  const { paciente_id, procedimento_id, data_hora, observacoes, valor_cobrado } = req.body;
  const org_id = req.user.organizacao_id;
  
  db.run(`INSERT INTO agendamentos (organizacao_id, paciente_id, dentista_id, procedimento_id, data_hora, observacoes, valor_cobrado) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [org_id, paciente_id, req.user.id, procedimento_id, data_hora, observacoes, valor_cobrado], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      logAudit(org_id, req.user.id, 'CREATE', 'agendamento', this.lastID, { paciente_id, data_hora });
      res.json({ id: this.lastID });
    });
});

// ==================== SUPER ADMIN ====================

app.get('/api/admin/organizacoes', auth, superAdminAuth, (req, res) => {
  db.all(`SELECT o.*, COUNT(DISTINCT u.id) as total_usuarios, COUNT(DISTINCT p.id) as total_pacientes
          FROM organizacoes o
          LEFT JOIN usuarios u ON o.id = u.organizacao_id
          LEFT JOIN pacientes p ON o.id = p.organizacao_id
          GROUP BY o.id
          ORDER BY o.created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/admin/metrics', auth, superAdminAuth, (req, res) => {
  db.get('SELECT COUNT(*) as total FROM organizacoes WHERE status = "ativo"', (err, orgs) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get('SELECT SUM(valor) as mrr FROM assinaturas WHERE status = "ativa"', (err, revenue) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        organizacoes_ativas: orgs.total || 0,
        mrr: revenue.mrr || 0,
        arr: (revenue.mrr || 0) * 12
      });
    });
  });
});

// Cron job para verificar trials expirados
cron.schedule('0 0 * * *', () => {
  const hoje = format(new Date(), 'yyyy-MM-dd');
  db.run(`UPDATE organizacoes SET status = 'trial_expirado' 
          WHERE plano = 'trial' AND data_trial_fim < ? AND status = 'ativo'`, [hoje]);
  console.log('✅ Verificação de trials executada');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 DentalCloud API rodando na porta ${PORT}`);
});

export default app;
