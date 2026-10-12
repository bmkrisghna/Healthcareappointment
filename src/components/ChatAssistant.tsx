import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

function generateReply(question: string, fifoCount: number, priorityCount: number, avgWait: number): string {
  const q = question.toLowerCase();

  if (q.includes('wait') || q.includes('long') || q.includes('queue')) {
    if (priorityCount === 0) return 'There are currently no patients waiting. You should be seen immediately.';
    const estMin = avgWait > 0 ? avgWait : priorityCount * 8;
    return `There are ${priorityCount} patients in the priority queue ahead of you. Estimated wait time: ~${estMin} minutes. Emergency and Critical cases are always served first, which may extend your wait.`;
  }

  if (q.includes('emergency') || q.includes('critical')) {
    return 'Emergency and Critical patients are given highest priority (severity weight 3-4) and are served before Urgent and Routine cases. Average emergency response time is under 1 second in our system.';
  }

  if (q.includes('doctor') || q.includes('who')) {
    return 'We have 3 doctors available: Dr. Sarah Chen (General Medicine), Dr. James Patel (Cardiology), and Dr. Maria Gomez (Emergency Care). Patients are assigned in round-robin fashion to balance workload.';
  }

  if (q.includes('slot') || q.includes('appointment') || q.includes('book')) {
    return 'Slots are allocated automatically using a circular queue that distributes patients across doctors in round-robin order. Each doctor has 8 time slots per day.';
  }

  if (q.includes('position') || q.includes('number') || q.includes('spot')) {
    return `Your position depends on severity. Currently ${fifoCount} patients are in the FIFO queue and ${priorityCount} in the priority queue. Emergency cases jump ahead of routine patients.`;
  }

  return "I can help with questions about wait times, queue position, emergency priority, doctor availability, and slot allocation. Try asking: 'How long is my wait?' or 'How does emergency priority work?'";
}

export function ChatAssistant() {
  const { fifoQueue, priorityQueue, analytics } = useStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Hello! I am your healthcare assistant. Ask me about wait times, queue position, or how priority works.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input.trim() };
    const reply = generateReply(
      input,
      fifoQueue.length,
      priorityQueue.length,
      analytics.averageWaitingTime
    );
    setMessages((prev) => [...prev, userMsg, { role: 'bot', text: reply }]);
    setInput('');
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-[90] bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 animate-pop"
        aria-label="Open chat assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-5 z-[90] w-[calc(100vw-2.5rem)] sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[60vh] animate-pop">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-teal-600 rounded-t-2xl">
            <Bot size={20} className="text-white" />
            <div>
              <h3 className="text-white font-semibold text-sm">Health Assistant</h3>
              <p className="text-teal-100 text-xs">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 dark:text-slate-200"
              aria-label="Chat message input"
            />
            <button
              onClick={send}
              className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition-colors"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
