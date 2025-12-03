interface FilterButtonsProps {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
}

const filters = [
  { id: "all", label: "Tous" },
  { id: "yla", label: "YOUR LIE IN APRIL" },
  { id: "yourname", label: "YOUR NAME" },
  { id: "naruto", label: "NARUTO" },
  { id: "demonslayer", label: "DEMON SLAYER" },
  { id: "hxh", label: "HUNTER X HUNTER" },
  { id: "bleach", label: "BLEACH" },
  { id: "asv", label: "A SILENT VOICE" },
  { id: "rappeur", label: "RAPPEUR" }
];

export function FilterButtons({ currentFilter, setCurrentFilter }: FilterButtonsProps) {
  return (
    <div className="flex justify-center gap-3 mb-[50px] flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setCurrentFilter(filter.id)}
          className={`px-6 py-2.5 rounded-lg border cursor-pointer transition-all duration-300 ${
            currentFilter === filter.id ? "active-filter" : ""
          }`}
          style={{
            background: currentFilter === filter.id 
              ? "linear-gradient(135deg, #8ab4f8 0%, #7877c6 100%)"
              : "rgba(255, 255, 255, 0.05)",
            borderColor: currentFilter === filter.id 
              ? "transparent"
              : "rgba(255, 255, 255, 0.1)",
            color: currentFilter === filter.id 
              ? "#fff"
              : "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            fontSize: "0.95rem",
            fontWeight: 500,
            boxShadow: currentFilter === filter.id 
              ? "0 4px 12px rgba(138, 180, 248, 0.3)"
              : "none"
          }}
          onMouseEnter={(e) => {
            if (currentFilter !== filter.id) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentFilter !== filter.id) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
