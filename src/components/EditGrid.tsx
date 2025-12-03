import { EditCard } from "./EditCard";
import { Edit } from "../data/edits";

interface EditGridProps {
  edits: Edit[];
  onPlayVideo: (edit: Edit) => void;
}

export function EditGrid({ edits, onPlayVideo }: EditGridProps) {
  if (edits.length === 0) {
    return (
      <div 
        className="text-center py-[60px] px-5"
        style={{ color: "rgba(255, 255, 255, 0.5)" }}
      >
        Aucun edit trouvé
      </div>
    );
  }

  return (
    <div 
      className="grid gap-6 mb-10"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))"
      }}
    >
      {edits.map((edit) => (
        <EditCard key={edit.id} edit={edit} onPlayVideo={onPlayVideo} />
      ))}
    </div>
  );
}