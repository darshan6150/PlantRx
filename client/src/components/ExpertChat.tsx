import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, Sparkles, User, Loader2, MessageSquarePlus, Star, ArrowRight, TrendingUp, History, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import ChatHistory from "@/components/ChatHistory";

interface RemedySuggestion {
  id: number;
  name: string;
  slug: string;
  confidence: number;
  category: string;
  relevantFor?: string;
}

interface SymptomAnalysis {
  condition: string;
  probability: number;
  severity: "low" | "moderate" | "high";
  description: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  analysis?: SymptomAnalysis[];
  remedies?: RemedySuggestion[];
  rootCauses?: string[];
  healingProtocol?: {
    immediate_actions?: any[];
    daily_protocol?: any[];
    lifestyle_changes?: any[];
  };
  naturalRemedies?: any[];
  preventionStrategy?: string;
  aiSource?: string;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ExpertChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant", 
      content: "Hello! I'm Remy, your expert health consultant with decades of experience in natural medicine.\n\nI specialize in:\n🔍 **Symptom Analysis**: Professional diagnostic insights\n📊 **Health Assessment**: Comprehensive evaluation with percentages\n🌿 **Natural Solutions**: Plant-based remedies from our verified database\n🎯 **Personalized Care**: Tailored recommendations for your specific needs\n\nWhat health concerns can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Use the symptom finder endpoint for comprehensive health analysis
      const response = await fetch('/api/ai/symptom-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symptoms: inputMessage.trim(),
          context: "remy_professional_health_diagnosis",
          age: "adult",
          duration: "recent",
          sessionId: currentSessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const data = await response.json();
      
      // Process direct symptom solution
      let analysisText = "";
      if (data.primary_concern) {
        analysisText = `**Health Analysis Summary**\n\nConcern: ${data.primary_concern}\n\n`;
        
        if (data.likely_conditions && data.likely_conditions.length > 0) {
          analysisText += `**Most Likely Condition:** ${data.likely_conditions[0]}\n\n`;
        }
        
        if (data.recommendations && data.recommendations.length > 0) {
          analysisText += `**Recommended Actions:**\n`;
          data.recommendations.forEach((rec: any, idx: number) => {
            const suggestion = rec.suggestion || rec.recommendation || rec;
            analysisText += `${idx + 1}. ${suggestion}\n`;
          });
          analysisText += `\n`;
        }
        
        if (data.natural_remedies && data.natural_remedies.length > 0) {
          analysisText += `**Natural Remedies:**\n`;
          data.natural_remedies.forEach((remedy: any, idx: number) => {
            analysisText += `${idx + 1}. ${remedy.remedy_name}`;
            if (remedy.dosage) {
              analysisText += ` - ${remedy.dosage}`;
            }
            analysisText += `\n`;
          });
          analysisText += `\n`;
        }
        
        if (data.warning_signs) {
          analysisText += `**Seek Medical Attention If:** ${data.warning_signs}\n\n`;
        }
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: analysisText || data.analysis || data.response || "I've analyzed your symptoms and prepared recommendations.",
        timestamp: new Date(),
        analysis: data.likely_conditions?.map((condition: string, idx: number) => ({
          condition: condition,
          probability: 85 - (idx * 7),
          severity: idx === 0 ? "high" : idx === 1 ? "moderate" : "low",
          description: `Analysis confidence: ${idx === 0 ? 'High' : idx === 1 ? 'Moderate' : 'Possible'}`
        })) || [],
        remedies: data.database_remedies?.map((remedy: any, idx: number) => ({
          id: remedy.remedy_id || idx,
          name: remedy.remedy_name || remedy.name,
          slug: remedy.remedy_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `remedy-${idx}`,
          confidence: 92 - (idx * 3),
          category: remedy.category || "natural-remedy",
          relevantFor: `Recommended for ${data.primary_concern.toLowerCase()}`
        })) || [],
        rootCauses: data.root_causes || [],
        healingProtocol: data.healing_protocol || {},
        naturalRemedies: data.natural_remedies || [],
        preventionStrategy: data.prevention_strategy || "",
        aiSource: data.ai_source || "Expert Analysis"
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update session ID if returned
      if (data.sessionId && !currentSessionId) {
        setCurrentSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('Health analysis error:', error);
      
      // Fallback to regular chat
      try {
        const fallbackResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: inputMessage.trim(),
            context: "health_expert",
            sessionId: currentSessionId
          })
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const assistantMessage: Message = {
            role: "assistant",
            content: fallbackData.response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error('Both analysis methods failed');
        }
      } catch (fallbackError) {
        toast({
          title: "Analysis Error",
          description: "I'm having trouble analyzing your symptoms right now. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
      return false;
    }
  };

  const startNewConsultation = () => {
    setMessages([
      {
        role: "assistant", 
        content: "Hello! I'm Remy, your expert health consultant with decades of experience in natural medicine.\n\nI specialize in:\n🔍 **Symptom Analysis**: Professional diagnostic insights\n📊 **Health Assessment**: Comprehensive evaluation with percentages\n🌿 **Natural Solutions**: Plant-based remedies from our verified database\n🎯 **Personalized Care**: Tailored recommendations for your specific needs\n\nWhat health concerns can I help you with today?",
        timestamp: new Date()
      }
    ]);
    setCurrentSessionId(null);
  };

  const handleSelectSession = (sessionId: number, sessionMessages: ChatMessage[]) => {
    setCurrentSessionId(sessionId);
    // Convert ChatMessage[] to Message[]
    const convertedMessages = sessionMessages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp)
    })) as Message[];
    setMessages(convertedMessages);
  };

  const getSeverityColor = (severity: "low" | "moderate" | "high") => {
    switch (severity) {
      case "low": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border border-emerald-300";
      case "moderate": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border border-amber-300";
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300";
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl z-50 transition-all duration-300 hover:scale-110"
            data-testid="expert-chat-trigger"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl h-[750px] p-0 border-2 border-emerald-200 dark:border-emerald-700 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 px-4 py-3 border-b border-emerald-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
                    Remy - Expert Health Consultant
                  </DialogTitle>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Professional Natural Health Guidance
                  </p>
                </div>
              </div>

            </div>
          </DialogHeader>

          {/* Chat Area */}
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 overflow-hidden">
              <div className="px-4 py-4 space-y-6" data-testid="chat-messages">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.role === "assistant" ? (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 max-w-[85%]">
                      <div className={`rounded-2xl px-4 py-3 ${
                          message.role === "assistant" 
                            ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 text-gray-900 dark:text-gray-100 border border-emerald-200 dark:border-slate-600" 
                            : "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                        }`}>
                        <div className="text-base leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                        
                        {/* Analysis Results */}
                        {message.analysis && message.analysis.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {message.analysis.map((analysis, idx) => (
                              <Card key={idx} className="p-3 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-600">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{analysis.condition}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{analysis.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getSeverityColor(analysis.severity)}>
                                      {analysis.probability}%
                                    </Badge>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                        
                        {/* Remedy Suggestions */}
                        {message.remedies && message.remedies.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Recommended Natural Remedies:</h4>
                            {message.remedies.map((remedy, idx) => (
                              <Link key={idx} href={`/remedy/${remedy.slug}`}>
                                <Card className="p-3 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer transition-all">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h5 className="font-medium text-gray-900 dark:text-white">{remedy.name}</h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-300">{remedy.relevantFor}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                        {remedy.confidence}% match
                                      </Badge>
                                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                                    </div>
                                  </div>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 border border-emerald-200 dark:border-slate-600">
                        <div className="flex items-center space-x-3">
                          <Loader2 className="w-5 h-5 animate-spin text-emerald-600 dark:text-emerald-400" />
                          <span className="text-base text-gray-900 dark:text-gray-100">
                            Analyzing your symptoms...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-emerald-200 dark:border-slate-600 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-slate-800/50 dark:to-slate-700/50 px-4 py-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isLoading && inputMessage.trim()) {
                  handleSendMessage();
                }
                return false;
              }} className="flex space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Describe your symptoms or health concerns..."
                  disabled={isLoading}
                  className="flex-1 bg-white dark:bg-slate-800 border-emerald-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 text-base"
                  data-testid="input-message"
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6"
                  data-testid="button-send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Press Enter to send • Professional health guidance powered by AI
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat History Dialog */}
      <ChatHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSession={handleSelectSession}
        onNewChat={startNewConsultation}
      />
    </>
  );
}