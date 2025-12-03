import { useState } from "react";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { LogOut, User } from "lucide-react";

interface UserMenuProps {
  onOpenAuth: () => void;
}

export function UserMenu({ onOpenAuth }: UserMenuProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!isAuthenticated) {
    return (
      <button
        onClick={onOpenAuth}
        className="px-6 py-2.5 rounded-xl border transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }}
      >
        Connexion
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)"
        }}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span>{user?.username}</span>
      </button>

      {showMenu && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden"
          style={{
            background: "rgba(20, 25, 45, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <button
            onClick={() => {
              logout();
              setShowMenu(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 transition-colors"
            style={{ color: "rgba(255, 255, 255, 0.8)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}