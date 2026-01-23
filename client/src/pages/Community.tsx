import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UpgradeInterstitial } from "@/components/FeatureLock";
import { Feature } from "@shared/subscriptionFeatures";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  Lock, 
  UserCheck, 
  Search, 
  Plus, 
  Filter,
  UserPlus,
  UserMinus,
  TrendingUp,
  Hash,
  Image,
  Send,
  MoreHorizontal,
  Flag,
  Eye,
  Trash2,
  Bookmark,
  Leaf,
  ShieldCheck,
  X
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

interface CommunityPost {
  id: number;
  title?: string;
  content: string;
  postType: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isPinned: boolean;
  createdAt: string;
  author: {
    id: number;
    username: string;
    fullName?: string;
    profilePictureUrl?: string;
    role: string;
    isVerified: boolean;
    email?: string;
  };
}

interface UserProfile {
  id: number;
  username: string;
  fullName?: string;
  profilePictureUrl?: string;
  role: string;
  isVerified: boolean;
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
}

const postTypes = [
  { value: "question", label: "❓ Question", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200" },
  { value: "advice", label: "💡 Advice", color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200" },
  { value: "story", label: "📖 Success Story", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200" },
  { value: "tip", label: "💪 Health Tip", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200" },
  { value: "discussion", label: "💬 Discussion", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" }
];

const categories = [
  "nutrition", "exercise", "mental-health", "remedies", "sleep", "stress", "immunity", "digestive", "skin-care", "general"
];

export default function Community() {
  return (
    <UpgradeInterstitial feature={Feature.COMMUNITY_FORUM}>
      <CommunityContent />
    </UpgradeInterstitial>
  );
}

function CommunityContent() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [selectedPostType, setSelectedPostType] = useState("discussion");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("world");
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [commentContent, setCommentContent] = useState("");

  // Comment management
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [commentsData, setCommentsData] = useState<Record<number, any[]>>({});
  const [commentsSidebarOpen, setCommentsSidebarOpen] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<CommunityPost | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication state - REQUIRED for community access
  useEffect(() => {
    const userData = localStorage.getItem('plantrx-user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.isAuthenticated) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch current user profile data (disabled for guest users)
  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    enabled: false,
  });

  // Fetch community posts based on active feed
  const { data: posts = [], isLoading: postsLoading } = useQuery<CommunityPost[]>({
    queryKey: ['/api/community/posts', activeTab],
    queryFn: () => {
      const params = new URLSearchParams();
      if (activeTab === "following") {
        params.append('following', 'true');
      }
      return fetch(`/api/community/posts?${params}`).then(res => res.json());
    },
  });



  // Search users
  const { data: userSearchResults = [], isLoading: userSearchLoading } = useQuery({
    queryKey: ['/api/community/users/search', userSearchQuery],
    queryFn: () => {
      if (!userSearchQuery || userSearchQuery.length < 2) return [];
      return fetch(`/api/community/users/search?query=${encodeURIComponent(userSearchQuery)}`).then(res => res.json());
    },
    enabled: !!userSearchQuery && userSearchQuery.length > 2,
  });

  // Like post handler
  const handleLikePost = (postId: number) => {
    likePostMutation.mutate(postId);
  };

  // Helper functions for comment management
  const toggleComments = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    setSelectedPostForComments(post);
    setCommentsSidebarOpen(true);
    
    // Fetch comments if not loaded yet
    if (!commentsData[postId]) {
      fetchComments(postId);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        credentials: 'include'
      });
      const comments = await response.json();
      setCommentsData(prev => ({ ...prev, [postId]: comments }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleCommentSubmit = async (postId: number) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: comment })
      });
      
      if (response.ok) {
        const newComment = await response.json();
        setCommentsData(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment]
        }));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        toast({
          title: "💬 Comment added!",
          description: "Your comment has been posted",
        });
        
        // Update post comments count
        queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      }
    } catch (error) {
      toast({
        title: "Comment failed",
        description: "Could not post comment",
        variant: "destructive",
      });
    }
  };

  // Content moderation function
  const checkContentModeration = (content: string): { isValid: boolean; reason?: string } => {
    const forbiddenWords = [
      'spam', 'scam', 'fake', 'buy now', 'get rich', 'miracle cure',
      'inappropriate', 'offensive', 'harmful', 'dangerous', 'illegal'
    ];
    
    const lowerContent = content.toLowerCase();
    
    // Check for forbidden words
    for (const word of forbiddenWords) {
      if (lowerContent.includes(word)) {
        return { isValid: false, reason: 'Content contains inappropriate language' };
      }
    }
    
    // Check for excessive caps (spam indicator)
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.5 && content.length > 20) {
      return { isValid: false, reason: 'Excessive use of capital letters' };
    }
    
    // Check for minimum length
    if (content.trim().length < 10) {
      return { isValid: false, reason: 'Post content is too short' };
    }
    
    return { isValid: true };
  };

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (postData: any) => {
      // Apply content moderation before sending
      const moderationCheck = checkContentModeration(postData.content);
      if (!moderationCheck.isValid) {
        throw new Error(moderationCheck.reason);
      }
      return apiRequest('/api/community/posts', 'POST', postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      setNewPost("");
      setPostTitle("");
      setSelectedPostType("discussion");
      setSelectedCategory("");
      setCreatePostOpen(false);
      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with the community.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating post",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Like post mutation with optimistic updates
  const likePostMutation = useMutation({
    mutationFn: (postId: number) => apiRequest(`/api/community/posts/${postId}/like`, 'POST'),
    onMutate: async (postId: number) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['/api/community/posts'] });
      
      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['/api/community/posts']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['/api/community/posts'], (old: any) => {
        if (!old) return old;
        return old.map((post: any) => 
          post.id === postId 
            ? { ...post, likesCount: post.likesCount + (post.isLiked ? -1 : 1), isLiked: !post.isLiked }
            : post
        );
      });
      
      return { previousPosts };
    },
    onError: (err, postId, context) => {
      // Revert optimistic update on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['/api/community/posts'], context.previousPosts);
      }
      toast({
        title: "Like failed",
        description: "Could not like this post. Please try again.",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (postId: number) => apiRequest(`/api/community/posts/${postId}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      toast({
        title: "🗑️ Post deleted",
        description: "Your post has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Could not delete this post. Please try again.",
      });
    }
  });

  // Save post mutation
  const savePostMutation = useMutation({
    mutationFn: (postId: number) => apiRequest(`/api/community/posts/${postId}/save`, 'POST'),
    onSuccess: () => {
      toast({
        title: "🔖 Post saved",
        description: "Post added to your saved collection",
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Could not save this post. Please try again.",
      });
    }
  });

  // Report post mutation
  const reportPostMutation = useMutation({
    mutationFn: (postId: number) => apiRequest(`/api/community/posts/${postId}/report`, 'POST', { reason: 'inappropriate_content' }),
    onSuccess: () => {
      toast({
        title: "🚩 Post reported",
        description: "Thank you for helping keep our community safe",
      });
    },
    onError: () => {
      toast({
        title: "Report failed",
        description: "Could not report this post. Please try again.",
      });
    }
  });

  // Handle create post
  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      title: postTitle.trim() || null,
      content: newPost.trim(),
      postType: selectedPostType,
      category: selectedCategory || null,
      tags: [],
    });
  };



  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Get post type styling
  const getPostTypeStyle = (type: string) => {
    const postType = postTypes.find(pt => pt.value === type);
    return postType?.color || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen luxury-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading community...</p>
        </div>
      </div>
    );
  }

  // Show authentication barrier if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen luxury-gradient-bg">
        <Header />
        
        {/* Authentication Required Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/20 via-transparent to-yellow-50/20 dark:from-yellow-900/10 dark:via-transparent dark:to-yellow-900/10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="luxury-glass rounded-3xl shadow-2xl p-16 luxury-border backdrop-blur-xl">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Lock className="w-12 h-12 text-white" />
              </div>
              
              <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700/50 mb-8 text-sm px-6 py-3 font-semibold tracking-wide">
                🌿 Exclusive Community Access
              </Badge>
              
              <h1 className="text-5xl md:text-6xl luxury-heading text-gray-900 dark:text-white mb-8 leading-tight">
                Join Our Premium
                <span className="luxury-text-gradient block">Health Community</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed luxury-body">
                Connect with certified experts, share your wellness journey, and discover personalized 
                natural health solutions in our exclusive member community.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold luxury-heading text-gray-900 dark:text-white mb-2">
                    Expert Network
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 luxury-body">
                    Connect directly with verified health professionals
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold luxury-heading text-gray-900 dark:text-white mb-2">
                    Supportive Community
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 luxury-body">
                    Share experiences with like-minded wellness enthusiasts
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold luxury-heading text-gray-900 dark:text-white mb-2">
                    Real Discussions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 luxury-body">
                    Authentic conversations about natural health journeys
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button className="luxury-button-primary px-12 py-4 text-lg">
                    Sign In to Continue
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="luxury-button-secondary px-12 py-4 text-lg">
                    Create Account
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 luxury-body">
                Join thousands of members already transforming their health naturally
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Main authenticated community view
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEOHead 
        title="PlantRx Community Lounge - Natural Health Support & Expert Network"
        description="Join PlantRx's exclusive health community lounge. Connect with verified experts, share wellness journeys, and discover natural remedies with like-minded health enthusiasts."
        keywords="PlantRx community, health support network, natural wellness community, expert health advice, wellness discussions, herbal medicine forum"
        canonical="https://plantrxapp.com/community"
        ogType="website"
      />
      <Header />
      
      {/* Top Section - Trending & Guidelines */}
      <ScrollReveal variant="fadeUp">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trending Topics */}
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                What's Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {[
                { tag: "natural-immunity", posts: 45, trending: true },
                { tag: "herbal-remedies", posts: 32, trending: true },
                { tag: "meditation", posts: 28, trending: false },
                { tag: "nutrition-tips", posts: 24, trending: true }
              ].map((topic, index) => (
                <div key={topic.tag} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        #{topic.tag.replace('-', ' ')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {topic.posts} posts
                      </p>
                    </div>
                  </div>
                  {topic.trending && (
                    <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs">
                      Hot
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Guidelines - Comprehensive */}
          <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
                Community Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">No Medical Advice</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Share experiences, not diagnoses. Always consult healthcare professionals.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Evidence-Based Sharing</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Support claims with credible sources when discussing health topics.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Respectful Discourse</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Be kind, supportive, and constructive in all interactions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">No Commercial Spam</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Focus on community value, not self-promotion or sales.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">5</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Safety First</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Report dangerous or misleading health information immediately.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    Support Others
                  </Badge>
                  <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Be Inclusive
                  </Badge>
                  <Badge className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Share Knowledge
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong>Remember:</strong> We're here to support each other's wellness journey. Share personal experiences, ask questions, and learn together while respecting diverse approaches to natural health.
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </ScrollReveal>

      {/* Modern Social Media Layout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        <div className="flex gap-6">
          
          {/* Main Feed Area */}
          <div className="flex-1 min-w-0">
            
            {/* Quick Create Post - At Top */}
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm mb-3 sm:mb-4">
              <CardContent className="p-3 sm:p-4">
                <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
                  <DialogTrigger asChild>
                    <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                      <ProfilePictureUpload 
                        user={currentUser} 
                        size="sm"
                        showUploadButton={false}
                      />
                      <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full px-3 sm:px-4 py-2 sm:py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base">
                        <span className="hidden sm:inline">Share your health journey, ask questions, or start a discussion...</span>
                        <span className="sm:hidden">Share your health journey...</span>
                      </div>
                    </div>
                  </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white dark:bg-slate-800" aria-describedby="create-post-description">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create Post
                  </DialogTitle>
                  <p id="create-post-description" className="text-sm text-gray-500 dark:text-gray-400">
                    Share your health insights with the community
                  </p>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-slate-700">
                    <ProfilePictureUpload 
                      user={currentUser} 
                      size="sm"
                      showUploadButton={false}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {(currentUser as any)?.username || (currentUser as any)?.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Public • Health Community
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {postTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedPostType(type.value)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedPostType === type.value
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-gray-200 dark:border-slate-600">
                      <SelectValue placeholder="Choose a category (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600">
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="text-gray-900 dark:text-white">
                          #{category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {(selectedPostType === "question" || selectedPostType === "discussion") && (
                    <Input
                      placeholder="Add a title for your post..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="text-lg font-medium bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-gray-200 dark:border-slate-600"
                    />
                  )}
                  
                  <Textarea
                    placeholder="Share your thoughts about natural health, wellness tips, ask questions, or discuss your journey with the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[120px] text-lg resize-none border-0 focus:ring-0 p-0 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                      <button 
                        onClick={() => {
                          toast({
                            title: "Photo upload",
                            description: "Photo upload feature coming soon!",
                          });
                        }}
                        className="hover:text-green-600 transition-colors"
                      >
                        <Image className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="ghost" onClick={() => setCreatePostOpen(false)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreatePost}
                        disabled={createPostMutation.isPending || !newPost.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white px-6"
                      >
                        {createPostMutation.isPending ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
                </Dialog>
                
                <div className="flex justify-between items-center mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex space-x-3 sm:space-x-4">
                    <button 
                      onClick={() => {
                        toast({
                          title: "Photo upload",
                          description: "Photo upload feature coming soon!",
                        });
                      }}
                      className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        <span className="hidden sm:inline">Photo</span>
                        <span className="sm:hidden">📷</span>
                      </span>
                    </button>
                  </div>
                  <Button 
                    onClick={() => setCreatePostOpen(true)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6"
                  >
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feed Header - Mobile-optimized */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-2 sm:p-4 mb-3 sm:mb-4 z-10">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 h-10 sm:h-auto">
                  <TabsTrigger 
                    value="world" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3"
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    For You
                  </TabsTrigger>
                  <TabsTrigger 
                    value="following"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-700 dark:text-gray-300 text-xs sm:text-sm py-2 sm:py-3"
                  >
                    <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Following
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Posts Feed */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="world" className="space-y-3 sm:space-y-4 mt-0">
                {postsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <Card key={post.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-colors">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex space-x-2 sm:space-x-3">
                          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                            <AvatarImage src={post.author.profilePictureUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold text-xs sm:text-sm">
                              {post.author.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1 sm:space-x-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                                {post.author.username}
                              </h3>
                              {post.author.isVerified && (
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                              {post.author.role === "expert" && (
                                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs">
                                  Expert
                                </Badge>
                              )}
                              <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">·</span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                {formatTimeAgo(post.createdAt)}
                              </span>
                            </div>
                            
                            {post.title && (
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                                {post.title}
                              </h4>
                            )}
                            
                            <p className="text-gray-900 dark:text-white text-sm sm:text-[15px] leading-relaxed mb-2 sm:mb-3">
                              {post.content}
                            </p>
                            
                            {post.category && (
                              <div className="mb-2 sm:mb-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-slate-700 text-green-600 dark:text-green-400">
                                  #{post.category}
                                </span>
                              </div>
                            )}
                            
                            {post.imageUrl && (
                              <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600">
                                <img 
                                  src={post.imageUrl} 
                                  alt="Post image" 
                                  className="w-full h-auto"
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-700">
                              <div className="flex items-center space-x-4 sm:space-x-6">
                                <button
                                  onClick={() => handleLikePost(post.id)}
                                  className="flex items-center space-x-1 sm:space-x-2 hover:text-red-500 transition-colors group cursor-pointer"
                                  disabled={likePostMutation.isPending}
                                >
                                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 group-hover:fill-red-500 group-hover:text-red-500" />
                                  <span className="text-xs sm:text-sm font-medium">{post.likesCount}</span>
                                </button>
                                <button 
                                  onClick={() => toggleComments(post.id)}
                                  className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-500 transition-colors cursor-pointer"
                                >
                                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="text-xs sm:text-sm font-medium">{post.commentsCount}</span>
                                </button>
                                <button 
                                  onClick={async () => {
                                    try {
                                      const postUrl = `${window.location.origin}/community#post-${post.id}`;
                                      const shareData = {
                                        title: post.title || 'PlantRx Community Lounge Post',
                                        text: post.content.slice(0, 100) + (post.content.length > 100 ? '...' : ''),
                                        url: postUrl
                                      };

                                      // Try native sharing first
                                      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                                        await navigator.share(shareData);
                                        toast({
                                          title: "✅ Shared successfully",
                                          description: "Post shared via native sharing",
                                        });
                                      } else {
                                        // Fallback to clipboard
                                        await navigator.clipboard.writeText(postUrl);
                                        toast({
                                          title: "🔗 Link copied!",
                                          description: "Post link copied to clipboard",
                                        });
                                      }
                                    } catch (error) {
                                      console.error('Share failed:', error);
                                      // Final fallback - just show the URL
                                      const postUrl = `${window.location.origin}/community#post-${post.id}`;
                                      toast({
                                        title: "📋 Share this post",
                                        description: postUrl,
                                      });
                                    }
                                  }}
                                  className="flex items-center space-x-1 sm:space-x-2 hover:text-green-500 transition-colors cursor-pointer"
                                >
                                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="text-xs sm:text-sm font-medium">{post.sharesCount || 0}</span>
                                </button>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1">
                                    <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                  <DropdownMenuItem 
                                    onClick={() => savePostMutation.mutate(post.id)}
                                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700"
                                  >
                                    <Bookmark className="w-4 h-4" />
                                    <span>Save Post</span>
                                  </DropdownMenuItem>
                                  
                                  {/* Only show delete button if the post belongs to the current user */}
                                  {currentUser && post.author.id === (currentUser as any)?.id ? (
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                                          deletePostMutation.mutate(post.id);
                                        }
                                      }}
                                      className="flex items-center space-x-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      <span>Delete My Post</span>
                                    </DropdownMenuItem>
                                  ) : null}
                                  
                                  {/* Show report button only for posts that don't belong to the current user */}
                                  {currentUser && post.author.id !== (currentUser as any)?.id ? (
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        if (confirm('Are you sure you want to report this post for inappropriate content?')) {
                                          reportPostMutation.mutate(post.id);
                                        }
                                      }}
                                      className="flex items-center space-x-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                                    >
                                      <Flag className="w-4 h-4" />
                                      <span>Report Post</span>
                                    </DropdownMenuItem>
                                  ) : null}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>


                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="space-y-6">
                    {/* Welcome Banner */}
                    <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white border-0 overflow-hidden">
                      <CardContent className="p-8 text-center relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                        <div className="relative z-10">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Leaf className="w-10 h-10 text-white" />
                          </div>
                          <h2 className="text-3xl font-bold mb-3">Welcome to PlantRx Community Lounge! 🌿</h2>
                          <p className="text-green-50 text-lg mb-6 max-w-2xl mx-auto">
                            Join thousands of natural health enthusiasts sharing remedies, asking questions, and supporting each other's wellness journey.
                          </p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            <Button 
                              onClick={() => {
                                setSelectedPostType("question");
                                setCreatePostOpen(true);
                              }}
                              data-testid="cta-ask-question"
                              className="bg-white text-green-700 hover:bg-green-50 font-semibold"
                            >
                              ❓ Ask a Question
                            </Button>
                            <Button 
                              onClick={() => {
                                setSelectedPostType("story");
                                setCreatePostOpen(true);
                              }}
                              data-testid="cta-share-story"
                              className="bg-white/90 text-green-700 hover:bg-white font-semibold"
                            >
                              🌟 Share Your Story
                            </Button>
                            <Button 
                              onClick={() => setCreatePostOpen(true)}
                              data-testid="cta-create-post"
                              className="bg-green-700 hover:bg-green-800 text-white font-semibold"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Post
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Example Posts / Community Guidelines */}
                    <div className="grid gap-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                        <ShieldCheck className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                        Sample Posts to Get You Started
                      </h3>
                      
                      {[
                        {
                          type: "question",
                          title: "What's the best natural remedy for insomnia?",
                          preview: "I've been struggling with sleep for weeks. Has anyone found natural remedies that actually work? I'd love to hear your experiences!",
                          category: "sleep",
                          reactions: 42,
                          replies: 18
                        },
                        {
                          type: "story",
                          title: "How turmeric changed my inflammation journey",
                          preview: "After 6 months of adding turmeric to my daily routine, I've noticed significant improvements in my joint pain. Here's my complete story...",
                          category: "remedies",
                          reactions: 127,
                          replies: 34
                        },
                        {
                          type: "tip",
                          title: "Morning ritual: Lemon water benefits",
                          preview: "Starting your day with warm lemon water can boost digestion, support immunity, and hydrate your body. Here's how to do it right...",
                          category: "nutrition",
                          reactions: 89,
                          replies: 22
                        }
                      ].map((example, idx) => (
                        <Card key={idx} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-800 transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold">
                                  {idx === 0 ? "S" : idx === 1 ? "M" : "J"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {idx === 0 ? "Sarah M." : idx === 1 ? "Mike Chen" : "Jessica R."}
                                  </span>
                                  <Badge className={postTypes.find(pt => pt.value === example.type)?.color}>
                                    {postTypes.find(pt => pt.value === example.type)?.label}
                                  </Badge>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">· 2d ago</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                  {example.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {example.preview}
                                </p>
                                <div className="flex items-center space-x-1 mb-2">
                                  <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                    #{example.category}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 text-sm">
                                  <span className="flex items-center space-x-1">
                                    <Heart className="w-4 h-4" />
                                    <span>{example.reactions}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{example.replies}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Final CTA */}
                    <Card className="bg-gray-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-300 dark:border-slate-600">
                      <CardContent className="p-8 text-center">
                        <Leaf className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Your Voice Matters!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          Share your experiences, ask questions, or offer advice. Our community thrives on authentic conversations about natural health.
                        </p>
                        <Button 
                          onClick={() => setCreatePostOpen(true)}
                          size="lg"
                          data-testid="final-cta-create-post"
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Start Your First Post
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="following" className="space-y-3 sm:space-y-4 mt-0">
                <div className="space-y-6">
                  {/* Following Empty State - More Engaging */}
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 overflow-hidden">
                    <CardContent className="p-8 sm:p-12 text-center relative">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200/30 dark:bg-blue-700/20 rounded-full -ml-16 -mt-16"></div>
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-200/30 dark:bg-purple-700/20 rounded-full -mr-20 -mb-20"></div>
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <UserCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          Build Your Following Feed
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-lg">
                          Follow experts, wellness enthusiasts, and like-minded individuals to create a personalized health feed just for you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button 
                            onClick={() => setActiveTab("world")}
                            size="lg"
                            data-testid="explore-community-btn"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                          >
                            <Users className="w-5 h-5 mr-2" />
                            Discover People
                          </Button>
                          <Button 
                            onClick={() => setCreatePostOpen(true)}
                            size="lg"
                            variant="outline"
                            data-testid="create-post-following"
                            className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-semibold"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Post
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Benefits of Following */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      {
                        icon: <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />,
                        title: "Expert Insights",
                        description: "Get verified advice from natural health professionals"
                      },
                      {
                        icon: <Heart className="w-8 h-8 text-red-500" />,
                        title: "Success Stories",
                        description: "Be inspired by real wellness transformation journeys"
                      },
                      {
                        icon: <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
                        title: "Stay Updated",
                        description: "Never miss posts from your favorite community members"
                      }
                    ].map((benefit, idx) => (
                      <Card key={idx} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                        <CardContent className="p-6 text-center">
                          <div className="flex justify-center mb-3">
                            {benefit.icon}
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            {benefit.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {benefit.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Community Engagement */}
          <div className="hidden lg:block w-80 space-y-4 flex-shrink-0">
            
            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { type: "question", label: "Ask a Question", icon: "❓", color: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50" },
                  { type: "story", label: "Share Success Story", icon: "🌟", color: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50" },
                  { type: "tip", label: "Share a Health Tip", icon: "💪", color: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/50" },
                ].map((action) => (
                  <button
                    key={action.type}
                    onClick={() => {
                      setSelectedPostType(action.type);
                      setCreatePostOpen(true);
                    }}
                    data-testid={`quick-action-${action.type}`}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${action.color}`}
                  >
                    <span className="mr-2">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Now</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">247</span>
                </div>
                <Separator className="bg-gray-200 dark:bg-slate-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posts Today</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Members</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">12.5K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">New This Week</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">156</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { tag: "sleep", posts: 128, trend: "up" },
                  { tag: "immunity", posts: 94, trend: "up" },
                  { tag: "stress", posts: 76, trend: "same" },
                  { tag: "nutrition", posts: 63, trend: "up" },
                  { tag: "digestive", posts: 51, trend: "down" },
                ].map((topic) => (
                  <button
                    key={topic.tag}
                    onClick={() => {
                      setSelectedCategory(topic.tag);
                      setCreatePostOpen(true);
                    }}
                    data-testid={`trending-topic-${topic.tag}`}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                        #{topic.tag}
                      </span>
                      {topic.trend === "up" && (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{topic.posts} posts</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Who to Follow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { username: "Dr. Herbwell", role: "expert", verified: true, bio: "Naturopathic physician", followers: 2847 },
                  { username: "wellness_guru", role: "customer", verified: false, bio: "Natural health enthusiast", followers: 1523 },
                  { username: "mindful_healer", role: "customer", verified: true, bio: "Holistic wellness coach", followers: 982 },
                ].map((suggestedUser, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-semibold">
                          {suggestedUser.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {suggestedUser.username}
                          </p>
                          {suggestedUser.verified && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          {suggestedUser.role === "expert" && (
                            <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-[10px] px-1 py-0">
                              Expert
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{suggestedUser.bio}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid={`follow-${suggestedUser.username}`}
                      className="ml-2 h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex-shrink-0"
                      onClick={() => {
                        toast({
                          title: "Coming Soon! 🎉",
                          description: `Follow feature will be available soon`,
                        });
                      }}
                    >
                      Follow
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  onClick={() => {
                    toast({
                      title: "Explore more users",
                      description: "User discovery feature coming soon!",
                    });
                  }}
                >
                  Show more
                </Button>
              </CardContent>
            </Card>

            {/* Conversation Starters */}
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Start a Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "What's your favorite morning wellness routine?",
                  "Best natural remedy for better sleep?",
                  "Share your latest health win! 🌟",
                  "Top 3 herbs everyone should know about?",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNewPost(prompt);
                      setSelectedPostType("discussion");
                      setCreatePostOpen(true);
                    }}
                    data-testid={`conversation-starter-${idx}`}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 transition-colors border border-transparent hover:border-green-200 dark:hover:border-green-800"
                  >
                    "{prompt}"
                  </button>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Right Sidebar Comments Panel */}
      {commentsSidebarOpen && selectedPostForComments && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setCommentsSidebarOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
            commentsSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedPostForComments.author?.profilePictureUrl} />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs">
                    {(selectedPostForComments.author?.fullName || selectedPostForComments.author?.username || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {selectedPostForComments.author?.fullName || selectedPostForComments.author?.username}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedPostForComments.commentsCount} comments
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCommentsSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Post Preview */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <div className="flex items-center space-x-2 mb-2">
                {selectedPostForComments.postType && (
                  <Badge className={`text-xs ${getPostTypeStyle(selectedPostForComments.postType)}`}>
                    {postTypes.find(pt => pt.value === selectedPostForComments.postType)?.label || selectedPostForComments.postType}
                  </Badge>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(selectedPostForComments.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3">
                {selectedPostForComments.content}
              </p>
            </div>

            {/* Comment Input - Moved to Top */}
            {(currentUser || user) && (
              <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={(currentUser as any)?.profilePictureUrl || (user as any)?.profilePictureUrl} />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs">
                      {((currentUser as any)?.fullName || (currentUser as any)?.username || (user as any)?.fullName || (user as any)?.username || 'You')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Write a comment..."
                        value={commentInputs[selectedPostForComments.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ 
                          ...prev, 
                          [selectedPostForComments.id]: e.target.value 
                        }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentSubmit(selectedPostForComments.id);
                          }
                        }}
                        className="flex-1 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                      <Button
                        onClick={() => handleCommentSubmit(selectedPostForComments.id)}
                        size="sm"
                        disabled={!commentInputs[selectedPostForComments.id]?.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {(commentsData[selectedPostForComments.id] || []).map((comment: any) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author?.profilePictureUrl} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                      {(comment.author?.fullName || comment.author?.username || 'U')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.author?.fullName || 'Unknown User'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {commentsData[selectedPostForComments.id]?.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}