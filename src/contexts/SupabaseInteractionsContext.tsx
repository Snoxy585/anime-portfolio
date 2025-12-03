import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./SupabaseAuthContext";
import { projectId, publicAnonKey } from "../utils/supabase/info.tsx";
import { showToast } from "../utils/toast";

interface Comment {
  id: string;
  editId: number;
  userId: string;
  username: string;
  avatar?: string;
  text: string;
  createdAt: string;
}

interface InteractionsContextType {
  getLikesCount: (editId: number) => number;
  isLiked: (editId: number) => boolean;
  toggleLike: (editId: number) => Promise<void>;
  getComments: (editId: number) => Comment[];
  addComment: (editId: number, text: string) => Promise<void>;
  deleteComment: (editId: string, commentId: string) => Promise<void>;
  getRating: (editId: number) => number | null;
  getAverageRating: (editId: number) => number;
  getRatingsCount: (editId: number) => number;
  setRating: (editId: string, rating: number) => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const InteractionsContext = createContext<InteractionsContextType | undefined>(undefined);

export function InteractionsProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [likes, setLikes] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [ratings, setRatings] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-181e480f`;

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${publicAnonKey}`,
    };
  };

  // Fetch initial data
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch likes
        const likesResponse = await fetch(`${API_BASE}/likes/${user.id}`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` },
        });
        
        if (likesResponse.ok) {
          const data = await likesResponse.json();
          setLikes(new Set(data.likes || []));
        }

        // Fetch comments for all edits
        const commentsData: Record<string, Comment[]> = {};
        for (const edit of editsData) {
          const commentsResponse = await fetch(`${API_BASE}/comments/${edit.id}`, {
            headers: { 'Authorization': `Bearer ${publicAnonKey}` },
          });
          
          if (commentsResponse.ok) {
            const data = await commentsResponse.json();
            commentsData[edit.id] = data.comments || [];
          }
        }
        setComments(commentsData);

        // Fetch ratings
        const ratingsResponse = await fetch(`${API_BASE}/ratings/${user.id}`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` },
        });
        
        if (ratingsResponse.ok) {
          const data = await ratingsResponse.json();
          setRatings(data.ratings || {});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Silently fail - Supabase might be temporarily down
      }
    };

    fetchData();
  }, [user, session]);

  const refreshData = async () => {
    setLoading(true);
    await fetchAllData();
  };

  const toggleLike = async (editId: number) => {
    if (!user) {
      showToast("Connectez-vous pour liker", "error");
      return;
    }

    const isCurrentlyLiked = likes.has(editId);
    
    // Optimistic update
    setLikes(prev => {
      const newLikes = new Set(prev);
      if (isCurrentlyLiked) {
        newLikes.delete(editId);
      } else {
        newLikes.add(editId);
      }
      return newLikes;
    });

    try {
      const response = await fetch(`${API_BASE}/likes`, {
        method: isCurrentlyLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ editId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setLikes(prev => {
        const newLikes = new Set(prev);
        if (isCurrentlyLiked) {
          newLikes.add(editId);
        } else {
          newLikes.delete(editId);
        }
        return newLikes;
      });
      // Don't show error toast to avoid spam
    }
  };

  const addComment = async (editId: number, text: string) => {
    if (!user) {
      showToast("Connectez-vous pour commenter", "error");
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.user_metadata?.username || 'Anonyme',
      text,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setComments(prev => ({
      ...prev,
      [editId]: [...(prev[editId] || []), newComment]
    }));

    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ editId, text }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      
      // Update with server response
      setComments(prev => ({
        ...prev,
        [editId]: prev[editId].map(c => 
          c.id === newComment.id ? { ...c, id: data.commentId } : c
        )
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      // Revert optimistic update
      setComments(prev => ({
        ...prev,
        [editId]: (prev[editId] || []).filter(c => c.id !== newComment.id)
      }));
      // Don't show error toast to avoid spam
    }
  };

  const deleteComment = async (editId: string, commentId: string) => {
    if (!user) return;

    const previousComments = comments[editId] || [];
    
    // Optimistic update
    setComments(prev => ({
      ...prev,
      [editId]: (prev[editId] || []).filter(c => c.id !== commentId)
    }));

    try {
      const response = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ editId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Revert optimistic update
      setComments(prev => ({
        ...prev,
        [editId]: previousComments
      }));
      // Don't show error toast to avoid spam
    }
  };

  const setRating = async (editId: string, rating: number) => {
    if (!user) {
      showToast("Connectez-vous pour noter", "error");
      return;
    }

    const previousRating = ratings[editId];
    
    // Optimistic update
    setRatings(prev => ({
      ...prev,
      [editId]: rating
    }));

    try {
      const response = await fetch(`${API_BASE}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ editId, rating }),
      });

      if (!response.ok) {
        throw new Error('Failed to set rating');
      }
    } catch (error) {
      console.error('Error setting rating:', error);
      // Revert optimistic update
      if (previousRating !== undefined) {
        setRatings(prev => ({
          ...prev,
          [editId]: previousRating
        }));
      } else {
        setRatings(prev => {
          const newRatings = { ...prev };
          delete newRatings[editId];
          return newRatings;
        });
      }
      // Don't show error toast to avoid spam
    }
  };

  const getLikesCount = (editId: number) => {
    return (likes[editId] || []).length;
  };

  const isLiked = (editId: number) => {
    if (!user) return false;
    return (likes[editId] || []).some((like: any) => like.userId === user.id);
  };

  const getComments = (editId: number) => {
    return (comments[editId] || []).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getRating = (editId: number) => {
    if (!user) return null;
    const rating = (ratings[editId] || []).find((r: any) => r.userId === user.id);
    return rating ? rating.rating : null;
  };

  const getAverageRating = (editId: number) => {
    const editRatings = ratings[editId] || [];
    if (editRatings.length === 0) return 0;
    const sum = editRatings.reduce((acc: number, r: any) => acc + r.rating, 0);
    return sum / editRatings.length;
  };

  const getRatingsCount = (editId: number) => {
    return (ratings[editId] || []).length;
  };

  return (
    <InteractionsContext.Provider value={{
      getLikesCount,
      isLiked,
      toggleLike,
      getComments,
      addComment,
      deleteComment,
      getRating,
      getAverageRating,
      getRatingsCount,
      setRating,
      loading,
      refreshData,
    }}>
      {children}
    </InteractionsContext.Provider>
  );
}

export function useInteractions() {
  const context = useContext(InteractionsContext);
  if (!context) {
    throw new Error("useInteractions must be used within InteractionsProvider");
  }
  return context;
}