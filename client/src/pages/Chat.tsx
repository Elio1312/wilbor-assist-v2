import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Send, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";

export default function Chat() {
  const [selectedBaby, setSelectedBaby] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("geral");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: babies } = trpc.wilbor.getBabies.useQuery(
    { userId: 1 }, // TODO: Get from auth context
    { enabled: !!selectedBaby }
  );

  const sendMessageMutation = trpc.wilbor.sendMessage.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedBaby) return;

    const userMessage = message;
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await sendMessageMutation.mutateAsync({
        userId: 1, // TODO: Get from auth context
        babyId: parseInt(selectedBaby),
        message: userMessage,
        category: selectedCategory as any,
      });

      if (result.emergency) {
        setEmergency(true);
        setMessages((prev) => [...prev, { role: "assistant", content: result.message }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: result.message }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Desculpe, ocorreu um erro. Tente novamente." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="h-screen max-h-[calc(100vh-2rem)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle>Chat com Wilbor</CardTitle>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Select value={selectedBaby} onValueChange={setSelectedBaby}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um bebê" />
                </SelectTrigger>
                <SelectContent>
                  {babies?.map((baby) => (
                    <SelectItem key={baby.id} value={baby.id.toString()}>
                      {baby.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="sono">Sono</SelectItem>
                  <SelectItem value="colica">Cólica</SelectItem>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="salto">Salto de Desenvolvimento</SelectItem>
                  <SelectItem value="seguranca">Segurança</SelectItem>
                  <SelectItem value="sos">SOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {emergency && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Situação de emergência detectada. Procure atendimento médico imediatamente!
                </AlertDescription>
              </Alert>
            )}

            {messages.length === 0 && selectedBaby && (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <p className="text-gray-600 mb-2">Olá! Sou a Wilbor.</p>
                  <p className="text-gray-500 text-sm">
                    Estou aqui para ajudar com suas dúvidas sobre o desenvolvimento e cuidados do seu bebê.
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!selectedBaby || isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!selectedBaby || !message.trim() || isLoading}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
