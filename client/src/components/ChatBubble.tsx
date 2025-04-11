interface ChatBubbleProps {
  onClick: () => void;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  return (
    <button 
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center transition animate-pulse-soft"
      aria-label="Open chat assistant"
    >
      <i className="fas fa-comment-dots text-xl"></i>
    </button>
  );
}
