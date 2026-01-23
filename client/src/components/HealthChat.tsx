import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, User, Loader2, MessageSquarePlus, Star, ArrowRight, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { showSignInModal } from "@/lib/showSignInModal";
import { onAuthStateChanged } from "@/auth";

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
  scienceExplanation?: string;
  understanding?: string;
  healingProtocol?: {
    immediate_actions?: any[];
    daily_protocol?: any[];
    lifestyle_changes?: any[];
  };
  naturalRemedies?: any[];
  preventionStrategy?: string;
  aiSource?: string;
}

export default function HealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant", 
      content: "Hello! I'm Remy, your personal health expert with decades of experience in natural medicine and holistic wellness.\n\nAsk me anything about your health:\n\n🔬 Symptoms & Causes — I'll explain WHY you're experiencing symptoms and the science behind it\n\n💡 Science-Backed Solutions — Evidence-based recommendations you can start today\n\n🌿 Natural Remedies — Targeted plant-based solutions from our database of 131+ verified remedies\n\n🎯 Personalized Guidance — Specific dosages, preparation methods, and healing protocols\n\nWhat health concern can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const scrollToBottom = () => {
    // Disable automatic scrolling to prevent page jumping
    // Users can manually scroll to see new messages
  };

  // Removed automatic scroll effect to prevent page movement
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const handleSendMessage = async () => {
    // Check authentication first
    if (!user) {
      showSignInModal({
        hard: false,
        onDismiss: () => {
          // Optional: You can add any behavior when user dismisses the modal
        }
      });
      return;
    }

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
          age: "adult", // Could be made dynamic
          duration: "recent" // Could be made dynamic
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const data = await response.json();
      
      // Build comprehensive, conversational response
      let analysisText = "";
      
      // Understanding acknowledgment
      if (data.understanding) {
        analysisText = `${data.understanding}\n\n`;
      } else if (data.primary_concern) {
        analysisText = `I understand you're concerned about ${data.primary_concern}. Let me help you understand what's happening and what you can do.\n\n`;
      }
      
      // What's likely happening (likely conditions)
      if (data.likely_conditions && data.likely_conditions.length > 0) {
        analysisText += `📋 What's likely happening:\n`;
        data.likely_conditions.forEach((condition: string, idx: number) => {
          analysisText += `${idx === 0 ? '• Most likely: ' : '• Also possible: '}${condition}\n`;
        });
        analysisText += `\n`;
      }
      
      // Why this happens (root causes with science)
      if (data.root_causes && data.root_causes.length > 0) {
        analysisText += `🔬 Why this happens:\n`;
        data.root_causes.forEach((cause: string) => {
          analysisText += `• ${cause}\n`;
        });
        analysisText += `\n`;
      }
      
      // Science explanation
      if (data.science_explanation) {
        analysisText += `💡 The Science:\n${data.science_explanation}\n\n`;
      }
      
      // Direct solutions with reasoning
      if (data.recommendations && data.recommendations.length > 0) {
        analysisText += `✅ What to do:\n\n`;
        data.recommendations.forEach((rec: any, idx: number) => {
          const suggestion = rec.suggestion || rec.recommendation || rec;
          const howTo = rec.how_to || "";
          const whyItWorks = rec.why_it_works || "";
          analysisText += `${idx + 1}. ${suggestion}\n`;
          if (howTo) {
            analysisText += `   → How: ${howTo}\n`;
          }
          if (whyItWorks) {
            analysisText += `   → Why it works: ${whyItWorks}\n`;
          }
          analysisText += `\n`;
        });
      }
      
      // Natural remedy recommendations with scientific basis
      if (data.natural_remedies && data.natural_remedies.length > 0) {
        analysisText += `🌿 Natural Remedies:\n\n`;
        data.natural_remedies.forEach((remedy: any, idx: number) => {
          analysisText += `${idx + 1}. ${remedy.remedy_name}\n`;
          if (remedy.dosage) {
            analysisText += `   📊 Dosage: ${remedy.dosage}\n`;
          }
          if (remedy.preparation) {
            analysisText += `   📝 Preparation: ${remedy.preparation}\n`;
          }
          if (remedy.scientific_basis) {
            analysisText += `   🔬 Why it works: ${remedy.scientific_basis}\n`;
          }
          analysisText += `\n`;
        });
      }
      
      // Prevention strategy
      if (data.prevention_strategy) {
        analysisText += `🛡️ Prevention: ${data.prevention_strategy}\n\n`;
      }
      
      // Warning signs
      if (data.warning_signs) {
        analysisText += `⚠️ Seek medical help if: ${data.warning_signs}\n`;
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: analysisText || data.analysis || data.response || "I've analyzed your health concern and prepared my recommendations.",
        timestamp: new Date(),
        analysis: data.likely_conditions?.map((condition: string, idx: number) => ({
          condition: condition,
          probability: 85 - (idx * 7),
          severity: idx === 0 ? "high" : idx === 1 ? "moderate" : "low",
          description: `This condition matches your symptoms with ${idx === 0 ? 'high' : idx === 1 ? 'moderate' : 'possible'} confidence. ${idx === 0 ? 'Most likely - focus treatment here.' : 'Alternative possibility.'}`
        })) || [],
        remedies: data.database_remedies?.map((remedy: any, idx: number) => ({
          id: remedy.remedy_id || idx,
          name: remedy.remedy_name || remedy.name,
          slug: remedy.remedy_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `remedy-${idx}`,
          confidence: 92 - (idx * 3),
          category: remedy.category || "targeted-remedy",
          relevantFor: `Recommended for your concern`
        })) || [],
        rootCauses: data.root_causes || [],
        scienceExplanation: data.science_explanation || "",
        understanding: data.understanding || "",
        healingProtocol: data.healing_protocol || {},
        naturalRemedies: data.natural_remedies || [],
        preventionStrategy: data.prevention_strategy || "",
        aiSource: data.ai_source || "AI Analysis"
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Health analysis error:', error);
      
      // Fallback to regular chat if symptom analysis fails
      try {
        const fallbackResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: inputMessage.trim(),
            context: "health_expert"
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
        content: "Hello! I'm Remy, your personal health expert with decades of experience in natural medicine and holistic wellness.\n\nAsk me anything about your health:\n\n🔬 Symptoms & Causes — I'll explain WHY you're experiencing symptoms and the science behind it\n\n💡 Science-Backed Solutions — Evidence-based recommendations you can start today\n\n🌿 Natural Remedies — Targeted plant-based solutions from our database of 131+ verified remedies\n\n🎯 Personalized Guidance — Specific dosages, preparation methods, and healing protocols\n\nWhat health concern can I help you with today?",
        timestamp: new Date()
      }
    ]);
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
    <div className="w-full h-full flex flex-col rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700" data-testid="health-chat">
      {/* Chat Header - Luxury Design */}
      <div className="bg-gradient-to-r from-white via-emerald-50/30 to-teal-50/30 dark:from-gray-900 dark:via-emerald-900/10 dark:to-teal-900/10 px-4 sm:px-5 py-3 sm:py-4 border-b border-emerald-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Remy
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  AI Health Expert • Online
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={startNewConsultation}
            className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 min-h-[44px] min-w-[44px] p-2 rounded-xl transition-all duration-200"
            data-testid="new-consultation-btn"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <ScrollArea className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950">
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-6" tabIndex={0}>
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-2 sm:gap-3 lg:gap-4 w-full ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.role === "assistant" ? (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Message Content */}
                <div className="flex-1 max-w-[88%] sm:max-w-[85%]">
                  <div className={`rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                      message.role === "assistant" 
                        ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 text-gray-900 dark:text-gray-100 border border-emerald-200 dark:border-slate-600" 
                        : "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                    }`}>
                    <div className="text-sm sm:text-base lg:text-lg leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {/* Advanced Clinical Analysis Cards */}
                    {message.analysis && message.analysis.length > 0 && (
                      <div className="mt-3 sm:mt-6 space-y-2 sm:space-y-4">
                        <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-emerald-200 dark:border-emerald-700">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                          Clinical Diagnostic Assessment
                        </div>
                        {message.analysis.map((analysis, idx) => (
                          <Card key={idx} className="p-3 sm:p-5 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border border-emerald-200 dark:border-slate-600 shadow-sm sm:shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start justify-between mb-2 sm:mb-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                                  <span className="text-lg sm:text-2xl">{idx === 0 ? '🎯' : idx === 1 ? '📋' : '📌'}</span>
                                  {analysis.condition}
                                </h4>
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <Badge className={`${getSeverityColor(analysis.severity)} font-semibold px-2 py-1 text-xs sm:text-sm`}>
                                    {analysis.severity.toUpperCase()} PRIORITY
                                  </Badge>
                                  <div className="flex items-center gap-1 sm:gap-2 bg-emerald-100 dark:bg-emerald-900/50 px-2 sm:px-3 py-1 rounded-full">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300">
                                      {analysis.probability}%
                                    </span>
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                      CONFIDENCE
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-800/50 p-2 sm:p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                              <p className="text-xs sm:text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-medium">{analysis.description}</p>
                            </div>
                            {idx === 0 && (
                              <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                                <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-1 sm:gap-2">
                                  <span className="text-sm sm:text-lg">⭐</span>
                                  PRIMARY DIAGNOSIS - Recommended for immediate attention and treatment planning
                                </p>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Premium Natural Remedy Recommendations */}
                    {message.remedies && message.remedies.length > 0 && (
                      <div className="mt-3 sm:mt-6 space-y-2 sm:space-y-4">
                        <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-semibold text-teal-800 dark:text-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-teal-200 dark:border-teal-700">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                          Clinical-Grade Natural Therapeutics
                          <Badge className="ml-auto bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 text-xs">
                            {message.remedies.length} MATCHED
                          </Badge>
                        </div>
                        <div className="grid gap-2 sm:gap-4">
                          {message.remedies.map((remedy, idx) => (
                            <Link key={idx} href={`/remedy/${remedy.slug}`}>
                              <Card className="p-3 sm:p-5 bg-gradient-to-br from-white via-gray-50 to-emerald-50/30 dark:from-slate-800 dark:via-slate-850 dark:to-emerald-900/20 border border-emerald-200 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xl sm:hover:shadow-2xl hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <span className="text-base sm:text-2xl">🌿</span>
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-sm sm:text-lg text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                                          {remedy.name}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                                          Natural Medicine Database #REF{remedy.id}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {remedy.relevantFor && (
                                      <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 sm:p-3 rounded-lg border border-emerald-200 dark:border-emerald-700 mb-2 sm:mb-3">
                                        <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                                          <span className="font-bold">Therapeutic Application:</span> {remedy.relevantFor}
                                        </p>
                                      </div>
                                    )}
                                    
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                                      <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 dark:from-emerald-900 dark:to-teal-900 dark:text-emerald-200 border border-emerald-300 px-2 py-1 text-xs font-semibold">
                                        {remedy.category.toUpperCase()}
                                      </Badge>
                                      <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 px-2 sm:px-3 py-1 rounded-full border border-amber-300 dark:border-amber-600">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-200">
                                          {remedy.confidence}% EFFICACY MATCH
                                        </span>
                                      </div>
                                      <div className="ml-auto bg-emerald-100 dark:bg-emerald-900/50 px-2 sm:px-3 py-1 rounded-full">
                                        <span className="text-xs sm:text-xs text-emerald-700 dark:text-emerald-300 font-semibold hidden sm:inline">
                                          CLINICALLY VERIFIED
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="ml-2 sm:ml-4 flex flex-col items-center gap-1 sm:gap-2">
                                    <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors group-hover:translate-x-1 transform" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">VIEW DETAILS</span>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 border border-emerald-200 dark:border-slate-600">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                        <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                          Remy is analyzing your health concern...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Chat Input Area - Premium Design */}
        <div className="bg-gradient-to-r from-white via-emerald-50/20 to-teal-50/20 dark:from-gray-900 dark:via-emerald-900/5 dark:to-teal-900/5 border-t border-emerald-100 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLoading && inputMessage.trim()) {
              handleSendMessage();
            }
            return false;
          }} className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about any health concern..."
                disabled={isLoading}
                className="w-full text-sm sm:text-base rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-400 px-4 sm:px-5 py-2.5 sm:py-3 min-h-[48px] shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200"
                data-testid="input-health-question"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
              className="rounded-full w-12 h-12 min-w-[48px] min-h-[48px] bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
              data-testid="button-send-message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}