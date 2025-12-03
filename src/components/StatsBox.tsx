interface StatsBoxProps {
  totalEdits: number;
}

export function StatsBox({ totalEdits }: StatsBoxProps) {
  return (
    <div 
      className="rounded-xl p-5 mb-10 max-w-[800px] mx-auto"
      style={{
        background: "rgba(138, 180, 248, 0.1)",
        border: "1px solid rgba(138, 180, 248, 0.3)"
      }}
    >
      <h3 
        className="mb-2.5"
        style={{
          color: "#8ab4f8",
          fontSize: "1.1rem"
        }}
      >
        📊 Statistiques
      </h3>
      <p 
        className="mb-2"
        style={{
          color: "rgba(255, 255, 255, 0.8)",
          lineHeight: 1.6
        }}
      >
        <strong><span>{totalEdits}</span> edits</strong> au total dans ma collection
      </p>
      <p 
        style={{
          color: "rgba(255, 255, 255, 0.8)",
          lineHeight: 1.6
        }}
      >
        Utilisez les filtres ou la recherche ci-dessous pour trouver vos edits préférés !
      </p>
    </div>
  );
}
