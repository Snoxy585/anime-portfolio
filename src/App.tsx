import { useState } from "react";
import { Header } from "./components/Header";
import { StatsBox } from "./components/StatsBox";
import { SearchBar } from "./components/SearchBar";
import { FilterButtons } from "./components/FilterButtons";
import { EditGrid } from "./components/EditGrid";
import { EditDetailModal } from "./components/EditDetailModal";
import { AuthModal } from "./components/AuthModal";
import { AdminPanel } from "./components/AdminPanel";
import { AuthProvider, useAuth } from "./contexts/SupabaseAuthContext";
import { InteractionsProvider } from "./contexts/SupabaseInteractionsContext";
import { ToastProvider } from "./contexts/ToastContext";
import { editsData, Edit } from "./data/edits";
import { Database } from "lucide-react";
import { useAdminCheck } from "./hooks/useAdminCheck";

function AppContent() {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEdit, setSelectedEdit] = useState<Edit | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();

  const filteredEdits = editsData.filter((edit) => {
    const matchesFilter = currentFilter === "all" || edit.type === currentFilter;
    const matchesSearch = searchQuery.trim() === "" || 
      edit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      edit.anime.toLowerCase().includes(searchQuery.toLowerCase()) ||
      edit.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-x-hidden">
      {/* Floating Admin Button - Only visible for admins */}
      {isAuthenticated && isAdmin && !adminLoading && (
        <button
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-[100] transition-all shadow-lg"
          style={{
            background: "linear-gradient(135deg, #8ab4f8 0%, #7877c6 100%)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          title="Panneau Admin"
        >
          <Database className="w-6 h-6" />
        </button>
      )}

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 77, 77, 0.3), transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(138, 180, 248, 0.2), transparent 50%)
          `
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 py-5">
        <Header onOpenAuth={() => setShowAuthModal(true)} />
        <StatsBox totalEdits={editsData.length} />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterButtons currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
        <EditGrid edits={filteredEdits} onPlayVideo={setSelectedEdit} />
      </div>

      <EditDetailModal 
        edit={selectedEdit} 
        onClose={() => setSelectedEdit(null)} 
        onOpenAuth={() => setShowAuthModal(true)}
      />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <InteractionsProvider>
          <AppContent />
        </InteractionsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}