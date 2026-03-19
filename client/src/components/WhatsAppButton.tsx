import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  variant?: "floating" | "fixed";
  className?: string;
}

export function WhatsAppButton({
  phoneNumber = "+5512997999971",
  message = "Olá! Gostaria de conhecer o Wilbor",
  variant = "floating",
  className = "",
}: WhatsAppButtonProps) {
  // Remove caracteres especiais do número
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  
  // Encode da mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // URL do WhatsApp
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  if (variant === "floating") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${className}`}
        aria-label="Fale conosco no WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    );
  }

  // Variant: fixed button - texto e ícone verde, fundo branco com borda
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-white border-2 border-green-500 text-green-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-green-50 ${className}`}
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      Fale no WhatsApp
    </a>
  );
}