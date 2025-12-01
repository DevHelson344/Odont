import { useState, useEffect } from 'react';
import { Building2, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi';

export default function SuperAdmin() {
  const api = useApi();
  const [metrics, setMetrics] = useState(null);
  const [organizacoes, setOrganizacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsData, orgsData] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/organizacoes')
      ]);
      setMetrics(metricsData);
      setOrganizacoes(orgsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Painel Super Admin</h1>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<Building2 className="w-8 h-8 text-blue-600" />}
          title="Organizações Ativas"
          value={metrics?.organizacoes_ativas || 0}
          color="blue"
        />
        <MetricCard
          icon={<DollarSign className="w-8 h-8 text-green-600" />}
          title="MRR"
          value={`R$ ${(metrics?.mrr || 0).toLocaleString('pt-BR')}`}
          color="green"
        />
        <MetricCard
          icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
          title="ARR"
          value={`R$ ${(metrics?.arr || 0).toLocaleString('pt-BR')}`}
          color="purple"
        />
        <MetricCard
          icon={<Users className="w-8 h-8 text-orange-600" />}
          title="Total Usuários"
          value={organizacoes.reduce((sum, org) => sum + (org.total_usuarios || 0), 0)}
          color="orange"
        />
      </div>

      {/* Lista de Organizações */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Todas as Organizações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Organização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usuários
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pacientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {organizacoes.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{org.nome}</div>
                      <div className="text-sm text-gray-500">{org.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      org.plano === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                      org.plano === 'basico' ? 'bg-blue-100 text-blue-800' :
                      org.plano === 'profissional' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {org.plano.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      org.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      org.status === 'trial_expirado' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {org.total_usuarios || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {org.total_pacientes || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(org.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alertas */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">Trials Expirando</h3>
            <p className="text-sm text-yellow-800">
              {organizacoes.filter(o => o.plano === 'trial').length} organizações em período de trial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}
