import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  MessageSquare, 
  Calendar, 
  Trash2, 
  X,
  Plus,
  ChevronRight,
  Clock,
  Bot
} from 'lucide-react';
import { format } from 'date-fns';

interface ChatSession {
  id: number;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: number, messages: ChatMessage[]) => void;
  onNewChat: () => void;
}

export default function ChatHistory({ isOpen, onClose, onSelectSession, onNewChat }: ChatHistoryProps) {
  // No authentication required for chat history
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);

  // Load chat sessions
  const loadSessions = async () => {
    // Chat history available to all users
    
    setLoading(true);
    try {
      const response = await fetch('/api/chat/sessions', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for a session
  const loadSessionMessages = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const messages = await response.json();
        setSessionMessages(messages);
        return messages;
      }
    } catch (error) {
      console.error('Failed to load session messages:', error);
    }
    return [];
  };

  // Delete a chat session
  const deleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  // Select a chat session
  const handleSelectSession = async (session: ChatSession) => {
    const messages = await loadSessionMessages(session.id);
    setSelectedSession(session);
    onSelectSession(session.id, messages);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  if (false) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center">Chat History</DialogTitle>
            <DialogDescription className="text-center">
              Access your saved health conversations
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Sign in to Access Your Chat History
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Save your health conversations and access them anytime by creating an account.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/signup'}>
                Sign Up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-green-600" />
            Your Health Chat History
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
            All your personalized symptom analysis conversations
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 py-4">
          <Button 
            onClick={() => { onNewChat(); onClose(); }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start New Chat
          </Button>
          <Badge variant="outline" className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {sessions.length} saved chats
          </Badge>
        </div>

        <ScrollArea className="flex-1 max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Chat History Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start your first health conversation to begin building your personal chat history.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <Card 
                  key={session.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleSelectSession(session)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {session.title}
                        </h4>
                        {session.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {session.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(session.createdAt), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(session.updatedAt), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => deleteSession(session.id, e)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t pt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your health conversations are private and secure • Only you can access your chat history
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}