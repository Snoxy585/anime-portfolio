import { useState, useEffect } from "react";
import { Database, X, Trash2, RefreshCw, User, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info.tsx";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { useToast } from "../contexts/ToastContext";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [data, setData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "likes" | "comments" | "ratings">("users");
  const { session } = useAuth();
  const { showToast } = useToast();

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-181e480f`;

  const fetchData = async () => {
    if (!session) {
      showToast("Vous devez être connecté", "error");
      return;
    }

    setLoading(true);
    try {
      // Fetch interactions data
      const response = await fetch(`${API_BASE}/admin/data`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      if (response.status === 403) {
        showToast("Accès refusé - Réservé aux administrateurs", "error");
        onClose();
        return;
      }
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }

      // Fetch users data
      const usersResponse = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      if (usersResponse.status === 403) {
        showToast("Accès refusé - Réservé aux administrateurs", "error");
        onClose();
        return;
      }
      
      if (usersResponse.ok) {
        const usersResult = await usersResponse.json();
        setUsers(usersResult.users || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Erreur lors du chargement des données", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderUsers = () => {
    if (!users?.length) return <p className="text-center py-8 opacity-60">Aucun utilisateur enregistré</p>;
    
    return (
      <div className="space-y-3">
        {users.map((user: any) => (
          <div 
            key={user.id}
            className="p-4 rounded-lg"
            style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#8ab4f8]" />
                  <p className="font-semibold">{user.username}</p>
                  {user.emailConfirmed ? (
                    <CheckCircle className="w-4 h-4 text-green-400" title="Email confirmé" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" title="Email non confirmé" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-1 opacity-70">
                  <Mail className="w-3 h-3" />
                  <p className="text-sm">{user.email}</p>
                </div>
                
                <div className="flex items-center gap-2 opacity-60">
                  <Calendar className="w-3 h-3" />
                  <p className="text-xs">
                    Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                {user.lastSignIn && (
                  <p className="text-xs opacity-50 mt-1">
                    Dernière connexion: {new Date(user.lastSignIn).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
              
              <div className="text-xs opacity-40 font-mono">
                ID: {user.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLikes = () => {
    if (!data?.likes?.length) return <p className="text-center py-8 opacity-60">Aucun like</p>;
    
    return (
      <div className="space-y-2">
        {data.likes.map((like: any, idx: number) => (
          <div 
            key={idx}
            className="p-4 rounded-lg flex justify-between items-center"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <div>
              <p><strong>Edit ID:</strong> {like.editId}</p>
              <p className="opacity-70 text-sm">User: {like.userId}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderComments = () => {
    if (!data?.comments?.length) return <p className="text-center py-8 opacity-60">Aucun commentaire</p>;
    
    return (
      <div className="space-y-2">
        {data.comments.map((comment: any, idx: number) => (
          <div 
            key={idx}
            className="p-4 rounded-lg"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="opacity-70 text-sm">Edit: {comment.editId}</p>
                <p className="opacity-70 text-sm">User: {comment.userId}</p>
              </div>
              <p className="text-xs opacity-50">{new Date(comment.createdAt).toLocaleString('fr-FR')}</p>
            </div>
            <p className="mt-2">{comment.text}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderRatings = () => {
    if (!data?.ratings?.length) return <p className="text-center py-8 opacity-60">Aucune note</p>;
    
    return (
      <div className="space-y-2">
        {data.ratings.map((rating: any, idx: number) => (
          <div 
            key={idx}
            className="p-4 rounded-lg flex justify-between items-center"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <div>
              <p><strong>Edit ID:</strong> {rating.editId}</p>
              <p className="opacity-70 text-sm">User: {rating.userId}</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(rating.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
              <span className="ml-2">{rating.rating}/5</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-5 z-[3000]"
      style={{ background: "rgba(0, 0, 0, 0.9)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-4xl h-[80vh] rounded-2xl p-6 relative flex flex-col"
        style={{
          background: "rgba(20, 25, 45, 0.98)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-[#8ab4f8]" />
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
              Base de données
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-lg transition-colors"
              style={{ background: "rgba(138, 180, 248, 0.2)" }}
              title="Rafraîchir"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ background: "rgba(255, 255, 255, 0.1)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {data && (
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg text-center" style={{ background: "rgba(138, 180, 248, 0.1)", border: "1px solid rgba(138, 180, 248, 0.3)" }}>
              <p className="text-2xl font-bold">{users?.length || 0}</p>
              <p className="opacity-70 text-sm">Utilisateurs</p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: "rgba(255, 77, 77, 0.1)", border: "1px solid rgba(255, 77, 77, 0.3)" }}>
              <p className="text-2xl font-bold">{data.comments?.length || 0}</p>
              <p className="opacity-70 text-sm">Commentaires</p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: "rgba(255, 215, 0, 0.1)", border: "1px solid rgba(255, 215, 0, 0.3)" }}>
              <p className="text-2xl font-bold">{data.likes?.length || 0}</p>
              <p className="opacity-70 text-sm">Likes</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("users")}
            className="px-4 py-2 rounded-lg transition-all whitespace-nowrap"
            style={{
              background: activeTab === "users" ? "rgba(138, 180, 248, 0.3)" : "rgba(255, 255, 255, 0.05)",
              border: activeTab === "users" ? "1px solid rgba(138, 180, 248, 0.5)" : "1px solid transparent"
            }}
          >
            👥 Utilisateurs ({users?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className="px-4 py-2 rounded-lg transition-all whitespace-nowrap"
            style={{
              background: activeTab === "likes" ? "rgba(138, 180, 248, 0.3)" : "rgba(255, 255, 255, 0.05)",
              border: activeTab === "likes" ? "1px solid rgba(138, 180, 248, 0.5)" : "1px solid transparent"
            }}
          >
            Likes ({data?.likes?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className="px-4 py-2 rounded-lg transition-all whitespace-nowrap"
            style={{
              background: activeTab === "comments" ? "rgba(255, 77, 77, 0.3)" : "rgba(255, 255, 255, 0.05)",
              border: activeTab === "comments" ? "1px solid rgba(255, 77, 77, 0.5)" : "1px solid transparent"
            }}
          >
            Commentaires ({data?.comments?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("ratings")}
            className="px-4 py-2 rounded-lg transition-all whitespace-nowrap"
            style={{
              background: activeTab === "ratings" ? "rgba(255, 215, 0, 0.3)" : "rgba(255, 255, 255, 0.05)",
              border: activeTab === "ratings" ? "1px solid rgba(255, 215, 0, 0.5)" : "1px solid transparent"
            }}
          >
            Notes ({data?.ratings?.length || 0})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="w-8 h-8 animate-spin opacity-50" />
            </div>
          ) : (
            <>
              {activeTab === "users" && renderUsers()}
              {activeTab === "likes" && renderLikes()}
              {activeTab === "comments" && renderComments()}
              {activeTab === "ratings" && renderRatings()}
            </>
          )}
        </div>

        <div className="mt-4 p-4 rounded-lg" style={{ background: "rgba(138, 180, 248, 0.1)", border: "1px solid rgba(138, 180, 248, 0.3)" }}>
          <p className="text-sm opacity-80 mb-2">
            🔒 <strong>Sécurité:</strong> Les mots de passe sont cryptés par Supabase et ne peuvent pas être affichés (c'est normal et sécurisé).
          </p>
          <p className="text-sm opacity-80">
            💡 <strong>Astuce:</strong> Accédez à Supabase Auth sur{" "}
            <a 
              href={`https://supabase.com/dashboard/project/${projectId}/auth/users`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "#8ab4f8" }}
            >
              le dashboard Supabase
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}