import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Edit } from "../data/edits";
import { useInteractions } from "../contexts/SupabaseInteractionsContext";

interface EditCardProps {
  edit: Edit;
  onPlayVideo: (edit: Edit) => void;
}

export function EditCard({ edit, onPlayVideo }: EditCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getLikesCount, getAverageRating } = useInteractions();

  const likesCount = getLikesCount(edit.id);
  const averageRating = getAverageRating(edit.id);

  return (
    <div
      className="rounded-2xl border overflow-hidden cursor-pointer transition-all duration-[400ms]"
      style={{
        background: "rgba(20, 25, 45, 0.6)",
        backdropFilter: "blur(20px)",
        borderColor: isHovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered ? "0 20px 40px rgba(0, 0, 0, 0.4)" : "none"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlayVideo(edit)}
    >
      {/* Thumbnail */}
      <div 
        className="w-full h-[250px] relative overflow-hidden flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a1f3a 0%, #2d3250 100%)"
        }}
      >
        <video
          src={`${edit.videoUrl}#t=0.1`}
          muted
          preload="metadata"
          playsInline
          className="w-full h-full object-cover"
        />
        <div
          className="absolute w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 transition-all duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            fontSize: "1.5rem",
            transform: isHovered ? "scale(1.15)" : "scale(1)"
          }}
        >
          ▶
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div 
          className="mb-2"
          style={{
            fontSize: "1.2rem",
            fontWeight: 600
          }}
        >
          {edit.title}
        </div>
        <div 
          className="mb-3.5"
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.9rem"
          }}
        >
          📺 {edit.anime}
        </div>
        <div className="flex gap-1.5 flex-wrap">
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

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
          <div className="flex items-center gap-1.5" style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.85rem" }}>
            <Heart className="w-4 h-4" />
            <span>{likesCount}</span>
          </div>
          {averageRating > 0 && (
            <div className="flex items-center gap-1.5" style={{ color: "#fbbf24", fontSize: "0.85rem" }}>
              <Star className="w-4 h-4 fill-current" />
              <span>{averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}