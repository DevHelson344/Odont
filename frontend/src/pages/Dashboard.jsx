import { useApi } from "../hooks/useApi";
import { Calendar, DollarSign, UserX, Clock, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { data: dashboard, loading } = useApi("/dashboard");

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-200 to-cyan-400 text-white p-6 rounded-xl mb-8 shadow-lg">
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart3 className="w-8 h-8 mr-3" />
          Dashboard
        </h1>
        <p className="text-teal-100 mt-2">Visão geral do consultório</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-200 to-cyan-400 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center">
            <Calendar className="w-10 h-10 text-white/90" />
            <div className="ml-4">
              <p className="text-blue-100 text-sm">Agendamentos Hoje</p>
              <p className="text-3xl font-bold">
                {dashboard?.agendamentos_hoje || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-200 to-teal-400 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center">
            <DollarSign className="w-10 h-10 text-white/90" />
            <div className="ml-4">
              <p className="text-emerald-100 text-sm">Faturamento Hoje</p>
              <p className="text-3xl font-bold">
                R$ {dashboard?.faturamento_hoje?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-200 to-pink-400 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <div className="flex items-center">
            <UserX className="w-10 h-10 text-white/90" />
            <div className="ml-4">
              <p className="text-rose-100 text-sm">Faltas (30 dias)</p>
              <p className="text-3xl font-bold">{dashboard?.faltas_mes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Visão do Consultório
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
            <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Tempo Médio</p>
            <p className="font-semibold text-gray-800">45 min</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
            <p className="text-sm text-gray-600">Taxa Ocupação</p>
            <p className="font-semibold text-gray-800">85%</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
            <UserX className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm text-gray-600">Taxa Faltas</p>
            <p className="font-semibold text-gray-800">12%</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600">Ticket Médio</p>
            <p className="font-semibold text-gray-800">R$ 180</p>
          </div>
        </div>
      </div>
    </div>
  );
}
