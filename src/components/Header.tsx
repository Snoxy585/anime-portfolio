import { UserMenu } from "./UserMenu";

interface HeaderProps {
  onOpenAuth: () => void;
}

export function Header({ onOpenAuth }: HeaderProps) {
  return (
    <header className="text-center mb-[60px] pt-[60px] pb-[40px] px-5">
      <div className="absolute top-5 right-5">
        <UserMenu onOpenAuth={onOpenAuth} />
      </div>
      
      <h1 
        className="mb-4 tracking-[-2px]"
        style={{
          fontSize: "3.5rem",
          fontWeight: 800,
          background: "linear-gradient(135deg, #fff 0%, #8ab4f8 50%, #ff4d4d 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}
      >
        Edits Portfolio
      </h1>
      <p 
        className="mb-6"
        style={{
          fontSize: "1.1rem",
          color: "rgba(255, 255, 255, 0.6)",
          fontWeight: 400,
          letterSpacing: "0.5px"
        }}
      >
        Mes créations et montages d'anime/rappeur
      </p>

      <div className="flex justify-center gap-4 mt-[25px]">
        <a
          href="https://www.tiktok.com/@tym.pcl"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            fontWeight: 500,
            fontSize: "0.95rem"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #ff0050 0%, #00f2ea 100%)";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(255, 0, 80, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span className="text-xl">🎵</span>
          Suivez-moi sur TikTok
        </a>
      </div>
    </header>
  );
}