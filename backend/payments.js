import Stripe from 'stripe';
import db from './database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...');

// Criar checkout session para assinatura
export async function createCheckoutSession(organizacao_id, plano_id, success_url, cancel_url) {
  try {
    // Buscar dados do plano
    const plano = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM planos WHERE id = ?', [plano_id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!plano) {
      throw new Error('Plano não encontrado');
    }

    // Buscar organização
    const org = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM organizacoes WHERE id = ?', [organizacao_id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Criar ou buscar customer no Stripe
    let customerId = org.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: org.email,
        name: org.nome,
        metadata: {
          organizacao_id: organizacao_id.toString()
        }
      });
      customerId = customer.id;
      
      // Salvar customer ID
      await new Promise((resolve, reject) => {
        db.run('UPDATE organizacoes SET stripe_customer_id = ? WHERE id = ?', 
          [customerId, organizacao_id], (err) => {
            if (err) reject(err);
            else resolve();
          });
      });
    }

    // Criar checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Plano ${plano.nome}`,
              description: plano.descricao,
            },
            unit_amount: Math.round(plano.valor_mensal * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url,
      cancel_url,
      metadata: {
        organizacao_id: organizacao_id.toString(),
        plano_id: plano_id.toString()
      }
    });

    return session;
  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    throw error;
  }
}

// Webhook handler para eventos do Stripe
export async function handleStripeWebhook(event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
      
      default:
        console.log(`Evento não tratado: ${event.type}`);
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    throw error;
  }
}

async function handleCheckoutCompleted(session) {
  const organizacao_id = parseInt(session.metadata.organizacao_id);
  const plano_id = parseInt(session.metadata.plano_id);
  
  // Buscar plano
  const plano = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM planos WHERE id = ?', [plano_id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  // Criar assinatura no banco
  await new Promise((resolve, reject) => {
    db.run(`INSERT INTO assinaturas (organizacao_id, plano, valor, status, metodo_pagamento, stripe_subscription_id, data_inicio)
            VALUES (?, ?, ?, 'ativa', 'stripe', ?, DATE('now'))`,
      [organizacao_id, plano.nome.toLowerCase(), plano.valor_mensal, session.subscription],
      (err) => {
        if (err) reject(err);
        else resolve();
      });
  });

  // Atualizar organização
  await new Promise((resolve, reject) => {
    db.run(`UPDATE organizacoes 
            SET plano = ?, status = 'ativo', data_proxima_cobranca = DATE('now', '+1 month')
            WHERE id = ?`,
      [plano.nome.toLowerCase(), organizacao_id],
      (err) => {
        if (err) reject(err);
        else resolve();
      });
  });

  console.log(`✅ Assinatura ativada para organização ${organizacao_id}`);
}

async function handlePaymentSucceeded(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const organizacao_id = parseInt(subscription.metadata.organizacao_id);

  // Atualizar próxima cobrança
  await new Promise((resolve, reject) => {
    db.run(`UPDATE organizacoes 
            SET data_proxima_cobranca = DATE('now', '+1 month'), status = 'ativo'
            WHERE id = ?`,
      [organizacao_id],
      (err) => {
        if (err) reject(err);
        else resolve();
      });
  });

  console.log(`✅ Pagamento processado para organização ${organizacao_id}`);
}

async function handlePaymentFailed(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const organizacao_id = parseInt(subscription.metadata.organizacao_id);

  // Marcar como pagamento pendente
  await new Promise((resolve, reject) => {
    db.run(`UPDATE organizacoes SET status = 'pagamento_pendente' WHERE id = ?`,
      [organizacao_id],
      (err) => {
        if (err) reject(err);
        else resolve();
      });
  });

  console.log(`⚠️ Falha no pagamento para organização ${organizacao_id}`);
}

async function handleSubscriptionCanceled(subscription) {
  const organizacao_id = parseInt(subscription.metadata.organizacao_id);

  // Cancelar assinatura
  await new Promise((resolve, reject) => {
    db.run(`UPDATE assinaturas SET status = 'cancelada', data_fim = DATE('now')
            WHERE stripe_subscription_id = ?`,
      [subscription.id],
      (err) => {
        if (err) reject(err);
        else resolve();
      });
  });

  // Atualizar organização
  await new Promise((resolve, reject) => {
    db.run(`UPDATE organizacoes SET status = 'cancelado' WHERE id = ?`,
      [organizacao_id],
      (err) => {
        if (err) reject(err);
        else resolve();
      });
  });

  console.log(`❌ Assinatura cancelada para organização ${organizacao_id}`);
}

// Cancelar assinatura
export async function cancelSubscription(organizacao_id) {
  try {
    // Buscar assinatura ativa
    const assinatura = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM assinaturas 
              WHERE organizacao_id = ? AND status = 'ativa'
              ORDER BY id DESC LIMIT 1`,
        [organizacao_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    if (!assinatura || !assinatura.stripe_subscription_id) {
      throw new Error('Assinatura não encontrada');
    }

    // Cancelar no Stripe
    await stripe.subscriptions.cancel(assinatura.stripe_subscription_id);

    return { success: true };
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    throw error;
  }
}

// Criar portal do cliente
export async function createCustomerPortal(organizacao_id, return_url) {
  try {
    const org = await new Promise((resolve, reject) => {
      db.get('SELECT stripe_customer_id FROM organizacoes WHERE id = ?', 
        [organizacao_id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    if (!org || !org.stripe_customer_id) {
      throw new Error('Customer não encontrado');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url,
    });

    return session;
  } catch (error) {
    console.error('Erro ao criar portal:', error);
    throw error;
  }
}

export default {
  createCheckoutSession,
  handleStripeWebhook,
  cancelSubscription,
  createCustomerPortal
};
