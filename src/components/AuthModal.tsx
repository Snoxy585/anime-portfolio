import { useState } from "react";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { useToast } from "../contexts/ToastContext";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup" | "reset";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup, resetPassword } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        showToast("Connexion réussie !", "success");
        onClose();
      } else if (mode === "signup") {
        await signup(username, email, password);
        showToast("Compte créé avec succès ! Vous êtes maintenant connecté.", "success");
        onClose();
      } else if (mode === "reset") {
        await resetPassword(email);
        showToast("Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.", "email");
        setMode("login");
      }
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-5 z-[3000]"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 relative"
        style={{
          background: "rgba(20, 25, 45, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: "rgba(255, 255, 255, 0.1)" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-6 text-center" style={{ fontSize: "1.8rem", fontWeight: 700 }}>
          {mode === "login" && "Connexion"}
          {mode === "signup" && "Inscription"}
          {mode === "reset" && "Réinitialiser le mot de passe"}
        </h2>

        {mode === "reset" && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: "rgba(138, 180, 248, 0.1)", border: "1px solid rgba(138, 180, 248, 0.3)" }}>
            <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.8)" }}>
              Un code de réinitialisation sera affiché (simulation d'email)
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block mb-2" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border transition-colors"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.1)"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(138, 180, 248, 0.5)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
              />
            </div>
          )}

          <div>
            <label className="block mb-2" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border transition-colors"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.1)"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "rgba(138, 180, 248, 0.5)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          {mode !== "reset" && (
            <div>
              <label className="block mb-2" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border transition-colors"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: "rgba(255, 255, 255, 0.1)"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(138, 180, 248, 0.5)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"}
              />
            </div>
          )}

          {error && (
            <div
              className="px-4 py-3 rounded-lg"
              style={{
                background: "rgba(255, 77, 77, 0.2)",
                border: "1px solid rgba(255, 77, 77, 0.4)",
                color: "#ff4d4d"
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg transition-all"
            style={{
              background: "linear-gradient(135deg, #8ab4f8 0%, #7877c6 100%)",
              fontWeight: 600,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Chargement..." : mode === "login" ? "Se connecter" : mode === "signup" ? "S'inscrire" : "Envoyer"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === "login" && (
            <>
              <button
                onClick={() => {
                  setMode("reset");
                  setError("");
                }}
                style={{ color: "#8ab4f8", fontSize: "0.9rem" }}
              >
                Mot de passe oublié ?
              </button>
              <div>
                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  style={{ color: "#8ab4f8" }}
                >
                  Pas encore de compte ? S'inscrire
                </button>
              </div>
            </>
          )}
          {(mode === "signup" || mode === "reset") && (
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              style={{ color: "#8ab4f8" }}
            >
              Déjà un compte ? Se connecter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}