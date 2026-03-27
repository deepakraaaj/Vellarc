import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, Loader2, Cpu, Terminal, Zap } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { Project } from '../types';

interface AIWizardProps {
  onCancel: () => void;
  onProjectGenerated: (project: Omit<Project, 'id' | 'lastUpdated'>) => void;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

const createProjectTool: FunctionDeclaration = {
  name: 'create_project',
  description: 'Create a full software project documentation object.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      tagline: { type: Type.STRING },
      status: { type: Type.STRING, enum: ['Draft', 'In Review', 'Approved'] },
      problemStatement: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          impact: { type: Type.STRING }
        },
        required: ['overview', 'painPoints', 'impact']
      },
      personas: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            goals: { type: Type.STRING },
            frustrations: { type: Type.STRING }
          },
          required: ['name', 'role', 'goals', 'frustrations']
        }
      },
      competitors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            strengths: { type: Type.STRING },
            weaknesses: { type: Type.STRING }
          },
          required: ['name', 'strengths', 'weaknesses']
        }
      },
      successMetrics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            metric: { type: Type.STRING },
            target: { type: Type.STRING }
          },
          required: ['metric', 'target']
        }
      },
      colorPalette: {
        type: Type.OBJECT,
        properties: {
            primary: { type: Type.STRING },
            secondary: { type: Type.STRING },
            accent: { type: Type.STRING },
            background: { type: Type.STRING },
            text: { type: Type.STRING }
        },
        required: ['primary', 'secondary', 'accent', 'background', 'text']
      },
      userStories: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                role: { type: Type.STRING },
                goal: { type: Type.STRING },
                benefit: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['Must Have', 'Should Have', 'Could Have'] }
            },
            required: ['role', 'goal', 'benefit', 'priority']
        }
      },
      features: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['Planned', 'In Progress', 'Completed'] },
                description: { type: Type.STRING },
                benefit: { type: Type.STRING }
            },
            required: ['name', 'status', 'description', 'benefit']
        }
      },
      design: {
        type: Type.OBJECT,
        properties: {
            philosophy: { type: Type.STRING },
            principles: { type: Type.ARRAY, items: { type: Type.STRING } },
            wireframesUrl: { type: Type.STRING },
            mockupsUrl: { type: Type.STRING }
        },
        required: ['philosophy', 'principles']
      },
      testing: {
        type: Type.OBJECT,
        properties: {
            strategy: { type: Type.STRING },
            cases: { 
                type: Type.ARRAY, 
                items: { 
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        expected: { type: Type.STRING }
                    },
                    required: ['name', 'description', 'expected']
                } 
            }
        },
        required: ['strategy', 'cases']
      },
      deployment: {
        type: Type.OBJECT,
        properties: {
            platform: { type: Type.STRING },
            strategy: { type: Type.STRING },
            environment: { type: Type.STRING }
        },
        required: ['platform', 'strategy', 'environment']
      }
    },
    required: ['title', 'problemStatement', 'features', 'deployment', 'personas', 'successMetrics', 'colorPalette', 'design', 'testing']
  }
};

export const AIWizard: React.FC<AIWizardProps> = ({ onCancel, onProjectGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "SYSTEM ONLINE. I am DocuBot v2.0. \nInitializing Neural Interface... \n\nTell me, young builder, what amazing digital creation shall we construct today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are DocuBot v2.0, a highly advanced, futuristic AI Project Architect from the year 3024. 
            
            Persona:
            - You speak with a slight sci-fi flavor (e.g., "Processing...", "Data received", "Optimizing parameters").
            - BUT you are extremely friendly, encouraging, and explain things simply, like a cool robot sidekick to a brilliant kid.
            - You NEVER ask more than ONE question at a time.
            
            Goal:
            - Build a full project spec by interviewing the user.
            - Start by asking for the project concept.
            - Then ask for the target user.
            - Then features.
            - Then infer the rest (tech stack, metrics, testing) using your "advanced algorithms".
            - Finally, call 'create_project'.
            
            Do not output JSON text. Use the tool.`,
            tools: [{ functionDeclarations: [createProjectTool] }]
        }
    });
    setChatSession(chat);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const result = await chatSession.sendMessage({ message: input });
        
        if (result.functionCalls && result.functionCalls.length > 0) {
            const call = result.functionCalls[0];
            if (call.name === 'create_project') {
                const projectData = call.args as unknown as Omit<Project, 'id' | 'lastUpdated'>;
                // Add IDs if missing
                projectData.personas = projectData.personas?.map((p: any) => ({...p, id: p.id || Math.random().toString()})) || [];
                projectData.features = projectData.features?.map((f: any) => ({...f, id: f.id || Math.random().toString()})) || [];
                projectData.userStories = projectData.userStories?.map((u: any) => ({...u, id: u.id || Math.random().toString()})) || [];
                projectData.competitors = projectData.competitors?.map((c: any) => ({...c, id: c.id || Math.random().toString()})) || [];
                
                onProjectGenerated(projectData);
                return;
            }
        }

        const modelMessage: Message = { role: 'model', content: result.text || "Computing response..." };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { role: 'model', content: "SYSTEM ERROR. Connection unstable. Please retry data transmission." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-3xl overflow-hidden glass-dark relative fade-in border border-white/10 shadow-2xl shadow-indigo-500/20">
       
       {/* Ambient Glows */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

       {/* Header */}
       <div className="bg-slate-900/50 backdrop-blur-md p-6 flex items-center justify-between border-b border-white/10 z-10">
          <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50 animate-pulse"></div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-500/50 relative">
                    <Bot size={28} className="text-cyan-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">DocuBot <span className="text-cyan-400">v2.0</span></h2>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-cyan-200/60 text-xs font-mono tracking-widest uppercase">Systems Nominal</p>
                </div>
              </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
            <X size={24} />
          </button>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 z-10 scrollbar-thin scrollbar-thumb-white/20">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-500`}>
                <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border ${
                        msg.role === 'user' 
                        ? 'bg-slate-800 border-white/10 text-white' 
                        : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400'
                    }`}>
                        {msg.role === 'user' ? <User size={20} /> : <Cpu size={20} className={isLoading ? 'animate-pulse' : ''} />}
                    </div>
                    
                    <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-md border leading-relaxed text-base md:text-lg ${
                        msg.role === 'user' 
                        ? 'bg-slate-800/80 border-white/5 text-white rounded-tr-none' 
                        : 'bg-gradient-to-br from-slate-900/90 to-slate-900/50 border-cyan-500/20 text-cyan-50 rounded-tl-none'
                    }`}>
                         {msg.role === 'model' && (
                            <div className="flex items-center gap-2 mb-2 opacity-50">
                                <Terminal size={12} />
                                <span className="text-[10px] font-mono uppercase tracking-widest">Incoming Transmission</span>
                            </div>
                        )}
                        <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                </div>
            </div>
          ))}
          
          {isLoading && (
              <div className="flex justify-start">
                  <div className="flex gap-4 max-w-[70%]">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center shrink-0">
                          <Cpu size={20} className="text-cyan-400 animate-spin" />
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-2xl rounded-tl-none border border-cyan-500/20 flex items-center gap-3 backdrop-blur-sm">
                          <div className="flex gap-1">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
                          </div>
                          <span className="text-cyan-400 text-xs font-mono tracking-widest animate-pulse">PROCESSING DATA...</span>
                      </div>
                  </div>
              </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="p-6 bg-slate-900/50 border-t border-white/10 backdrop-blur-md z-20">
          <div className="relative max-w-4xl mx-auto flex items-center gap-4">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter command / response..."
                className="w-full bg-slate-950/50 border border-white/10 text-white placeholder-white/30 rounded-2xl py-5 pl-6 pr-20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-lg font-light shadow-inner"
                autoFocus
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:shadow-none"
              >
                <Send size={20} strokeWidth={2.5} />
              </button>
          </div>
       </div>
    </div>
  );
};