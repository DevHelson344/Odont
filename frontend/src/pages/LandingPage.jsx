import { useState } from 'react';
import { Check, Calendar, Users, TrendingUp, Clock, Bell, BarChart3, Smartphone } from 'lucide-react';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nome_clinica: '',
    nome_admin: '',
    email: '',
    telefone: '',
    senha: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implementar cadastro
    console.log('Cadastro:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DentalCloud</span>
          </div>
          <button className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
            Entrar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Transforme Seu Consultório Odontológico
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Sistema completo de gestão que reduz faltas em 40%, aumenta faturamento em 25% 
          e economiza 10 horas por semana em tarefas administrativas
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Começar Teste Grátis de 14 Dias
          </button>
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:border-gray-400 transition">
            Ver Demonstração
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          ✓ Sem cartão de crédito ✓ Configuração em 5 minutos ✓ Suporte em português
        </p>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">2.500+</div>
            <div className="text-blue-100">Dentistas Ativos</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">40%</div>
            <div className="text-blue-100">Redução de Faltas</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">R$ 15k</div>
            <div className="text-blue-100">Aumento Médio/Mês</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.9/5</div>
            <div className="text-blue-100">Avaliação Média</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Tudo que Você Precisa em Um Só Lugar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Calendar className="w-12 h-12 text-blue-600" />}
            title="Agenda Inteligente"
            description="Visualização diária/semanal com drag & drop, bloqueios automáticos e otimização de horários"
          />
          <FeatureCard
            icon={<Bell className="w-12 h-12 text-blue-600" />}
            title="WhatsApp Automático"
            description="Confirmações e lembretes enviados automaticamente, reduzindo faltas em até 40%"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-blue-600" />}
            title="Fila de Encaixe"
            description="Notifique pacientes automaticamente quando surgir um horário disponível"
          />
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12 text-blue-600" />}
            title="Relatórios Avançados"
            description="Dashboard com métricas em tempo real: faturamento, taxa de ocupação e performance"
          />
          <FeatureCard
            icon={<Clock className="w-12 h-12 text-blue-600" />}
            title="Sala de Espera Digital"
            description="Pacientes acompanham tempo de espera em tempo real pelo celular"
          />
          <FeatureCard
            icon={<Smartphone className="w-12 h-12 text-blue-600" />}
            title="App Mobile"
            description="Acesse de qualquer lugar, iOS e Android, com sincronização em tempo real"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Planos Transparentes e Acessíveis
          </h2>
          <p className="text-center text-gray-600 mb-16">
            Escolha o plano ideal para o seu consultório. Cancele quando quiser.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              name="Básico"
              price="97"
              description="Ideal para dentistas autônomos"
              features={[
                '1 dentista',
                'Até 100 pacientes',
                'Agenda completa',
                'WhatsApp automático',
                'Suporte por email'
              ]}
            />
            <PricingCard
              name="Profissional"
              price="197"
              description="Para clínicas pequenas"
              features={[
                'Até 3 dentistas',
                'Até 500 pacientes',
                'Tudo do Básico +',
                'Fila de encaixe',
                'Relatórios avançados',
                'Suporte prioritário'
              ]}
              highlighted
            />
            <PricingCard
              name="Clínica"
              price="397"
              description="Para clínicas completas"
              features={[
                'Dentistas ilimitados',
                'Pacientes ilimitados',
                'Tudo do Profissional +',
                'Multi-unidades',
                'API completa',
                'Gerente de sucesso'
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          O Que Nossos Clientes Dizem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            name="Dr. Carlos Silva"
            role="Ortodontista - São Paulo"
            text="Reduzi minhas faltas em 45% no primeiro mês. O sistema de confirmação automática é incrível!"
          />
          <TestimonialCard
            name="Dra. Ana Paula"
            role="Clínica Odonto+ - Rio de Janeiro"
            text="Aumentamos nosso faturamento em R$ 18 mil/mês otimizando a agenda com a fila de encaixe."
          />
          <TestimonialCard
            name="Dr. Roberto Lima"
            role="Implantodontista - Brasília"
            text="Economizo 12 horas por semana em tarefas administrativas. Agora foco no que importa: meus pacientes."
          />
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto Para Transformar Seu Consultório?
          </h2>
          <p className="text-xl mb-8">
            Junte-se a mais de 2.500 dentistas que já aumentaram seu faturamento
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              placeholder="Nome da Clínica"
              className="w-full px-4 py-3 rounded-lg text-gray-900"
              value={formData.nome_clinica}
              onChange={(e) => setFormData({...formData, nome_clinica: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Seu Nome"
              className="w-full px-4 py-3 rounded-lg text-gray-900"
              value={formData.nome_admin}
              onChange={(e) => setFormData({...formData, nome_admin: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Seu Email"
              className="w-full px-4 py-3 rounded-lg text-gray-900"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Telefone"
              className="w-full px-4 py-3 rounded-lg text-gray-900"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Crie uma Senha"
              className="w-full px-4 py-3 rounded-lg text-gray-900"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              required
            />
            <button
              type="submit"
              className="w-full px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Começar Teste Grátis Agora
            </button>
            <p className="text-sm text-blue-100">
              14 dias grátis • Sem cartão de crédito • Cancele quando quiser
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-white">DentalCloud</span>
          </div>
          <p className="mb-4">Sistema profissional de gestão para consultórios odontológicos</p>
          <div className="flex justify-center gap-8 text-sm">
            <a href="#" className="hover:text-white">Termos de Uso</a>
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Suporte</a>
            <a href="#" className="hover:text-white">Blog</a>
          </div>
          <p className="mt-8 text-sm">© 2024 DentalCloud. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, description, features, highlighted }) {
  return (
    <div className={`p-8 rounded-xl ${highlighted ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white shadow-sm'}`}>
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className={`mb-4 ${highlighted ? 'text-blue-100' : 'text-gray-600'}`}>{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">R$ {price}</span>
        <span className={highlighted ? 'text-blue-100' : 'text-gray-600'}>/mês</span>
      </div>
      <button className={`w-full py-3 rounded-lg font-semibold mb-6 transition ${
        highlighted 
          ? 'bg-white text-blue-600 hover:bg-gray-100' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}>
        Começar Agora
      </button>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className={`w-5 h-5 flex-shrink-0 ${highlighted ? 'text-white' : 'text-green-500'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TestimonialCard({ name, role, text }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <p className="text-gray-700 mb-4 italic">"{text}"</p>
      <div>
        <div className="font-bold">{name}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </div>
  );
}
