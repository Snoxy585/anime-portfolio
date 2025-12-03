export interface Edit {
  id: number;
  title: string;
  anime: string;
  type: string;
  videoUrl: string;
  tags: string[];
}

export const editsData: Edit[] = [
  {
    id: 1,
    title: "Your Lie in April - Where have you been",
    anime: "Your Lie in April",
    type: "yla",
    videoUrl: "./EDIT DE FOU.mp4",
    tags: ["romance", "emotions"]
  },
  {
    id: 2,
    title: "Your Lie in April - I Wish I Knew",
    anime: "Your Lie in April",
    type: "yla",
    videoUrl: "./I WISH I KNEW EDIT.mp4",
    tags: ["romance", "emotions"]
  },
  {
    id: 3,
    title: "Demon Slayer - Burn",
    anime: "Demon Slayer",
    type: "demonslayer",
    videoUrl: "./burn edit.mp4",
    tags: ["action", "emotions"]
  },
  {
    id: 4,
    title: "Naruto - Diamond",
    anime: "Naruto",
    type: "naruto",
    videoUrl: "./Edit Diamant.mp4",
    tags: ["action"]
  },
  {
    id: 5,
    title: "Don Toliver - Tiramisu",
    anime: "Rap",
    type: "rappeur",
    videoUrl: "./edit don toliver.mp4",
    tags: ["rappeur"]
  },
  {
    id: 6,
    title: "A Silent Voice - Superpowers",
    anime: "A Silent Voice",
    type: "asv",
    videoUrl: "./edit fleur.mp4",
    tags: ["romance", "emotions"]
  },
  {
    id: 7,
    title: "Naruto - Nuts",
    anime: "Naruto",
    type: "naruto",
    videoUrl: "./edit itachi.mp4",
    tags: ["emotions"]
  },
  {
    id: 8,
    title: "Your Name - Feel it",
    anime: "Your Name",
    type: "yourname",
    videoUrl: "./edit your name.mp4",
    tags: ["romance", "emotions"]
  },
  {
    id: 9,
    title: "Hunter x Hunter - Kurapika",
    anime: "Hunter x Hunter",
    type: "hxh",
    videoUrl: "./hxh.mp4",
    tags: ["action"]
  },
  {
    id: 10,
    title: "Demon Slayer - Sabito",
    anime: "Demon Slayer",
    type: "demonslayer",
    videoUrl: "./Sabito Edit Prob4.mp4",
    tags: ["action", "emotions"]
  },
  {
    id: 11,
    title: "Bleach - Shunsui Manga Animation",
    anime: "Bleach",
    type: "bleach",
    videoUrl: "./Shunsui Manga Panel Prob4.mp4",
    tags: ["manga", "action"]
  },
  {
    id: 12,
    title: "Bleach - Cook Up",
    anime: "Bleach",
    type: "bleach",
    videoUrl: "./Stark Jugg Prob4.mp4",
    tags: ["action"]
  }
];
