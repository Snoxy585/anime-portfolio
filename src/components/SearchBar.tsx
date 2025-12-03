interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="max-w-[600px] mx-auto mb-10 px-5">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="🔍 Rechercher un edit, anime ou tag..."
        className="w-full px-5 py-4 rounded-xl border transition-all duration-300 focus:outline-none"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          fontSize: "1rem"
        }}
        onFocus={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "rgba(138, 180, 248, 0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(138, 180, 248, 0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
