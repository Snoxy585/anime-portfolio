import { useState, useRef, useEffect } from "react";
import { X, Heart, Star, MessageCircle, Send, Trash2 } from "lucide-react";
import { Edit } from "../data/edits";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { useInteractions } from "../contexts/SupabaseInteractionsContext";
import { useToast } from "../contexts/ToastContext";

interface EditDetailModalProps {
  edit: Edit | null;
  onClose: () => void;
  onOpenAuth: () => void;
}

export function EditDetailModal({ edit, onClose, onOpenAuth }: EditDetailModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user, isAuthenticated } = useAuth();
  const {
    toggleLike,
    isLiked,
    getLikesCount,
    addComment,
    getComments,
    deleteComment,
    setRating,
    getRating,
    getAverageRating,
    getRatingsCount
  } = useInteractions();

  const [commentText, setCommentText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (edit && videoRef.current) {
      videoRef.current.play();
    }
  }, [edit]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && edit) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [edit, onClose]);

  if (!edit) return null;

  const liked = isLiked(edit.id);
  const likesCount = getLikesCount(edit.id);
  const comments = getComments(edit.id);
  const userRating = getRating(edit.id);
  const averageRating = getAverageRating(edit.id);
  const ratingsCount = getRatingsCount(edit.id);

  const handleLike = async () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    try {
      await toggleLike(edit.id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (commentText.trim()) {
      try {
        await addComment(edit.id, commentText);
        setCommentText("");
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const handleRating = async (rating: number) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    try {
      await setRating(edit.id, rating);
    } catch (error) {
      console.error('Failed to set rating:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(edit.id, commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2500] overflow-y-auto"
      style={{ background: "rgba(0, 0, 0, 0.95)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="min-h-screen p-5 flex items-start justify-center">
        <div className="w-full max-w-5xl my-8">
          <button
            onClick={onClose}
            className="ml-auto mb-4 w-10 h-10 rounded-lg border-none flex items-center justify-center cursor-pointer transition-colors"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid lg:grid-cols-[1.5fr,1fr] gap-6">
            {/* Video section */}
            <div>
              <video
                ref={videoRef}
                src={edit.videoUrl}
                controls
                className="w-full rounded-xl mb-4"
                style={{ maxHeight: "70vh" }}
              />

              {/* Info and interactions */}
              <div
                className="p-6 rounded-xl"
                style={{
                  background: "rgba(20, 25, 45, 0.6)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                <h2 className="mb-2" style={{ fontSize: "1.5rem" }}>{edit.title}</h2>
                <p className="mb-4" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  📺 {edit.anime}
                </p>

                <div className="flex gap-1.5 mb-6">
                  {edit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md border"
                      style={{
                        background: "rgba(138, 180, 248, 0.15)",
                        borderColor: "rgba(138, 180, 248, 0.2)",
                        fontSize: "0.8rem",
                        color: "#8ab4f8"
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 transition-colors"
                    style={{ color: liked ? "#ff4d4d" : "rgba(255, 255, 255, 0.7)" }}
                  >
                    <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
                    <span>{likesCount}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{comments.length}</span>
                  </div>

                  {/* Rating stars */}
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className="w-5 h-5"
                            style={{
                              color: "#fbbf24",
                              fill: (hoveredStar || userRating || 0) >= star ? "#fbbf24" : "transparent"
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    <span style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem" }}>
                      {averageRating > 0 ? `${averageRating.toFixed(1)} (${ratingsCount})` : "Pas de notes"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments section */}
            <div
              className="p-6 rounded-xl h-fit lg:max-h-[70vh] overflow-y-auto"
              style={{
                background: "rgba(20, 25, 45, 0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)"
              }}
            >
              <h3 className="mb-4" style={{ fontSize: "1.2rem" }}>
                Commentaires ({comments.length})
              </h3>

              {/* Comment form */}
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={isAuthenticated ? "Ajouter un commentaire..." : "Connectez-vous pour commenter"}
                    disabled={!isAuthenticated}
                    className="flex-1 px-4 py-2 rounded-lg border transition-colors"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderColor: "rgba(255, 255, 255, 0.1)"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!isAuthenticated || !commentText.trim()}
                    className="px-4 py-2 rounded-lg transition-all"
                    style={{
                      background: "linear-gradient(135deg, #8ab4f8 0%, #7877c6 100%)",
                      opacity: !isAuthenticated || !commentText.trim() ? 0.5 : 1
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Comments list */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p style={{ color: "rgba(255, 255, 255, 0.5)", textAlign: "center", padding: "20px" }}>
                    Aucun commentaire pour le moment
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-lg"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.05)"
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {comment.avatar && (
                          <img
                            src={comment.avatar}
                            alt={comment.username}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span style={{ fontWeight: 600 }}>{comment.username}</span>
                            {user?.id === comment.userId && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="transition-colors"
                                style={{ color: "rgba(255, 255, 255, 0.4)" }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#ff4d4d"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                            {comment.text}
                          </p>
                          <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.75rem" }}>
                            {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}