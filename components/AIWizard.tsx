import React, { useState, useRef, useEffect } from 'react';
import { Send, User, X, Terminal, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Project } from '../types';

interface AIWizardProps {
  onCancel: () => void;
  onProjectGenerated: (project: Omit<Project, 'id' | 'lastUpdated'>) => void;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const AIWizard: React.FC<AIWizardProps> = ({ onCancel, onProjectGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi, I'm SpecArc AI.\n\nTell me what you're building, who it's for, or where you're stuck, and I'll help shape it into a build-ready brief." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<ChatTurn[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const sentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // The Gemini key and the create_project tool schema live server-side in
      // the gemini-chat edge function, so the browser never sees the API key.
      const { data, error: invokeError } = await supabase.functions.invoke('gemini-chat', {
        body: { history: historyRef.current, message: sentInput },
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      // Keep our own turn log in sync so the next call carries full context.
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', parts: [{ text: sentInput }] },
        { role: 'model', parts: [{ text: data?.text ?? '' }] },
      ];

      if (data?.functionCall?.name === 'create_project') {
        const projectData = data.functionCall.args as Omit<Project, 'id' | 'lastUpdated'>;
        // Add IDs if missing
        projectData.personas = projectData.personas?.map((p: any) => ({ ...p, id: p.id || Math.random().toString() })) || [];
        projectData.features = projectData.features?.map((f: any) => ({ ...f, id: f.id || Math.random().toString() })) || [];
        projectData.userStories = projectData.userStories?.map((u: any) => ({ ...u, id: u.id || Math.random().toString() })) || [];
        projectData.competitors = projectData.competitors?.map((c: any) => ({ ...c, id: c.id || Math.random().toString() })) || [];

        onProjectGenerated(projectData);
        return;
      }

      const modelMessage: Message = { role: 'model', content: data?.text || 'Computing response...' };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error('AI Error:', err);
      setError('I hit a connection issue just now. Please try again.');
      setMessages(prev => [...prev, { role: 'model', content: 'I hit a connection issue just now. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 rounded-[2rem] overflow-hidden glass-panel relative fade-in border border-white/60 dark:border-white/10 shadow-[0_30px_80px_-26px_rgba(15,23,42,0.38)]">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_30%)] pointer-events-none"></div>

       {/* Header */}
       <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-5 flex items-center justify-between border-b border-white/50 dark:border-white/10 z-10">
          <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/40 blur-lg opacity-60"></div>
                <img
                  src="/specarc-mark.svg"
                  alt="SpecArc AI"
                  className="relative w-12 h-12 rounded-2xl border border-white/60 dark:border-white/10 shadow-[0_18px_30px_-16px_rgba(99,102,241,0.7)]"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">SpecArc <span className="text-indigo-600 dark:text-indigo-400">AI</span></h2>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-rose-500' : 'bg-green-500'} animate-pulse`}></div>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold tracking-[0.22em] uppercase">{error ? 'Connection Issue' : 'Chat Assistant'}</p>
                </div>
              </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 dark:text-white/60 hover:text-gray-700 dark:hover:text-white">
            <X size={22} />
          </button>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-5 space-y-5 z-10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-500`}>
                <div className={`flex gap-3 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border ${
                        msg.role === 'user'
                        ? 'bg-gray-900 dark:bg-white border-white/10 dark:border-white/10 text-white dark:text-gray-900'
                        : 'bg-white/85 dark:bg-slate-900/70 border-white/60 dark:border-white/10'
                    }`}>
                        {msg.role === 'user' ? (
                          <User size={20} />
                        ) : (
                          <img src="/specarc-mark.svg" alt="" className="w-10 h-10 rounded-xl" />
                        )}
                    </div>

                    <div className={`p-5 rounded-2xl shadow-sm backdrop-blur-md border leading-relaxed text-[15px] md:text-base ${
                        msg.role === 'user'
                        ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900 rounded-tr-md'
                        : 'bg-white/85 dark:bg-slate-900/70 border-white/70 dark:border-white/10 text-gray-700 dark:text-gray-100 rounded-tl-md'
                    }`}>
                         {msg.role === 'model' && (
                            <div className="flex items-center gap-2 mb-2">
                                <Terminal size={12} className="text-indigo-500 dark:text-indigo-400" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">SpecArc AI</span>
                            </div>
                        )}
                        <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                </div>
            </div>
          ))}

          {isLoading && (
              <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[92%]">
                      <div className="w-10 h-10 rounded-xl bg-white/85 dark:bg-slate-900/70 border border-white/60 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                          <img src="/specarc-mark.svg" alt="" className="w-10 h-10 rounded-xl" />
                      </div>
                      <div className="bg-white/85 dark:bg-slate-900/70 p-4 rounded-2xl rounded-tl-md border border-white/70 dark:border-white/10 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                          <div className="flex gap-1">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-150"></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400 text-[11px] font-bold tracking-[0.16em] uppercase animate-pulse">Thinking</span>
                      </div>
                  </div>
              </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="p-5 bg-white/65 dark:bg-slate-900/65 border-t border-white/50 dark:border-white/10 backdrop-blur-md z-20">
          <div className="relative max-w-4xl mx-auto flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Describe your product idea..."
                disabled={isLoading}
                className="w-full bg-white/90 dark:bg-slate-950/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 rounded-2xl py-4 pl-5 pr-16 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all text-base font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl flex items-center justify-center transition-all shadow-[0_16px_32px_-16px_rgba(99,102,241,0.7)] disabled:opacity-50 disabled:shadow-none"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} strokeWidth={2.5} />}
              </button>
          </div>
       </div>
    </div>
  );
};
