import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2 } from "lucide-react";

export function FeedbackDashboard() {
  const { data: stats, isLoading } = trpc.feedback.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-10">Nenhum feedback coletado ainda</div>;
  }

  const chartData = [
    { name: "Útil", value: stats.helpful, fill: "#10b981" },
    { name: "Não Útil", value: stats.notHelpful, fill: "#ef4444" },
    { name: "Neutro", value: stats.neutral, fill: "#6b7280" },
  ];

  const barData = [
    { category: "Satisfação", percentage: stats.satisfactionRate },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Feedback</h1>
        <p className="text-gray-600 mt-2">Analise o feedback coletado do Wilbor</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Útil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.helpful}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Não Útil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.notHelpful}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Satisfação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.satisfactionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Feedback</CardTitle>
            <CardDescription>Proporção de respostas úteis vs não úteis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Satisfação</CardTitle>
            <CardDescription>Percentual de respostas úteis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="percentage" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>Análise do feedback coletado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.satisfactionRate >= 80 ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✓ Excelente satisfação!</p>
              <p className="text-green-700 text-sm mt-1">
                {stats.satisfactionRate}% das respostas foram consideradas úteis. Continue assim!
              </p>
            </div>
          ) : stats.satisfactionRate >= 60 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">⚠ Satisfação moderada</p>
              <p className="text-yellow-700 text-sm mt-1">
                {stats.satisfactionRate}% das respostas foram úteis. Há espaço para melhorias.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">✗ Baixa satisfação</p>
              <p className="text-red-700 text-sm mt-1">
                Apenas {stats.satisfactionRate}% das respostas foram úteis. Revise a base de conhecimento.
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.helpful}</p>
              <p className="text-sm text-gray-600">Respostas Úteis</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.notHelpful}</p>
              <p className="text-sm text-gray-600">Não Úteis</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.neutral}</p>
              <p className="text-sm text-gray-600">Neutro</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
