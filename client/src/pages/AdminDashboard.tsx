import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Trophy, 
  ArrowLeft,
  Activity,
  CreditCard,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  
  // 1. Busca de Dados Reais do Cérebro de Gestão
  const { data: metrics, isLoading, error } = trpc.admin.getBusinessMetrics.useQuery();

  if (isLoading) return <AdminSkeleton />;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-red-400 font-mono">ACESSO NEGADO: APENAS ADMINISTRADORES</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Estratégico */}
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Activity className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Wilbor CEO Panel</h1>
              <p className="text-slate-500 text-xs font-mono tracking-widest">REAL-TIME ROI MONITORING</p>
            </div>
          </div>
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-400 gap-2" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="size-4" /> Voltar ao App
          </Button>
        </header>

        {/* Grid de Métricas Principais (Escala de 100k/dia) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <MetricCard 
            title="Usuários Ativos (30d)" 
            value={metrics.activeUsers.toString()} 
            icon={<Users className="text-blue-400" />}
            desc="Crescimento orgânico"
          />
          <MetricCard 
            title="Taxa de Conversão" 
            value={metrics.conversionRate} 
            icon={<TrendingUp className="text-emerald-400" />}
            desc="Grátis para Premium"
          />
          <MetricCard 
            title="Faturamento Bruto" 
            value={`R$ ${(metrics.revenue.brl + (metrics.revenue.usd * 5) + (metrics.revenue.eur * 5.4)).toLocaleString()}`} 
            icon={<DollarSign className="text-yellow-400" />}
            desc="Total convertido (estimado)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Faturamento por Moeda (Moeda Forte) */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Globe className="size-4" /> Distribuição Global
            </h3>
            <div className="space-y-6">
              <CurrencyRow label="Brasil (BRL)" value={metrics.revenue.brl} symbol="R$" />
              <CurrencyRow label="Estados Unidos (USD)" value={metrics.revenue.usd} symbol="$" />
              <CurrencyRow label="Europa (EUR)" value={metrics.revenue.eur} symbol="€" />
            </div>
          </Card>

          {/* Top E-books (Renda Rápida) */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Trophy className="size-4 text-yellow-500" /> Top 3 E-books mais vendidos
            </h3>
            <div className="space-y-4">
              {metrics.topEbooks.map((ebook: any, index: number) => (
                <div key={ebook.ebookId} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-purple-500 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                      #{index + 1}
                    </div>
                    <span className="font-bold text-slate-200">{ebook.ebookId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono">
                    <CreditCard className="size-4" /> {ebook.salesCount} vendas
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componentes Auxiliares de Interface de Elite
function MetricCard({ title, value, icon, desc }: any) {
  return (
    <Card className="bg-slate-900 border-slate-800 p-6 hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-950 rounded-lg">{icon}</div>
      </div>
      <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
      <div className="text-3xl font-black text-white mb-2">{value}</div>
      <p className="text-slate-600 text-[10px] uppercase font-mono tracking-tighter">{desc}</p>
    </Card>
  );
}

function CurrencyRow({ label, value, symbol }: any) {
  return (
    <div className="flex items-center justify-between group">
      <span className="text-slate-400 text-sm">{label}</span>
      <div className="text-right">
        <div className="text-lg font-mono font-bold text-white group-hover:text-purple-400 transition-colors">
          {symbol} {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}

function AdminSkeleton() {
  return <div className="p-8 bg-slate-950 min-h-screen space-y-8"><Skeleton className="h-20 w-full bg-slate-900" /><Skeleton className="h-64 w-full bg-slate-900" /></div>;
}
