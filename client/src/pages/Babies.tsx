import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Baby } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Babies() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    sex: "unknown",
    weightGrams: "",
    gestationalWeeks: "",
    syndromes: "",
  });

  const { data: babies, refetch } = trpc.wilbor.getBabies.useQuery({
    userId: 1, // TODO: Get from auth context
  });

  const createBabyMutation = trpc.wilbor.createBaby.useMutation();

  const handleCreateBaby = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createBabyMutation.mutateAsync({
        userId: 1, // TODO: Get from auth context
        name: formData.name,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
        sex: formData.sex as "male" | "female" | "unknown",
        weightGrams: formData.weightGrams ? parseInt(formData.weightGrams) : undefined,
        gestationalWeeks: formData.gestationalWeeks ? parseInt(formData.gestationalWeeks) : undefined,
        syndromes: formData.syndromes || undefined,
      });

      setFormData({
        name: "",
        birthDate: "",
        sex: "unknown",
        weightGrams: "",
        gestationalWeeks: "",
        syndromes: "",
      });
      setOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating baby:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Bebês</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Bebê
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Bebê</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBaby} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Bebê</Label>
                  <Input
                    id="name"
                    placeholder="Ex: João"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="sex">Sexo</Label>
                  <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Menino</SelectItem>
                      <SelectItem value="female">Menina</SelectItem>
                      <SelectItem value="unknown">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weight">Peso ao Nascer (gramas)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ex: 3500"
                    value={formData.weightGrams}
                    onChange={(e) => setFormData({ ...formData, weightGrams: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="gestational">Semanas Gestacionais ao Nascer</Label>
                  <Input
                    id="gestational"
                    type="number"
                    placeholder="Ex: 40"
                    value={formData.gestationalWeeks}
                    onChange={(e) => setFormData({ ...formData, gestationalWeeks: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="syndromes">Condições Especiais (opcional)</Label>
                  <Input
                    id="syndromes"
                    placeholder="Ex: Síndrome de Down, Cardiopatia"
                    value={formData.syndromes}
                    onChange={(e) => setFormData({ ...formData, syndromes: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!babies || babies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Baby className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Você ainda não tem bebês cadastrados</p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeiro Bebê
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Bebê</DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {babies.map((baby) => (
              <Card key={baby.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Baby className="w-5 h-5 text-pink-600" />
                    {baby.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {baby.birthDate && (
                    <div>
                      <p className="text-sm text-gray-600">Data de Nascimento</p>
                      <p className="font-medium">
                        {new Date(baby.birthDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                  {baby.sex && (
                    <div>
                      <p className="text-sm text-gray-600">Sexo</p>
                      <p className="font-medium">
                        {baby.sex === "male" ? "Menino" : baby.sex === "female" ? "Menina" : "Não informado"}
                      </p>
                    </div>
                  )}
                  {baby.weightGrams && (
                    <div>
                      <p className="text-sm text-gray-600">Peso ao Nascer</p>
                      <p className="font-medium">{baby.weightGrams}g</p>
                    </div>
                  )}
                  {baby.syndromes && (
                    <div>
                      <p className="text-sm text-gray-600">Condições Especiais</p>
                      <p className="font-medium">{baby.syndromes}</p>
                    </div>
                  )}
                  <Button className="w-full mt-4">Ver Detalhes</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
