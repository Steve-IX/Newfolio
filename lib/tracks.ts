export interface Track {
  title: string;
  artist: string;
  file: string;
  cover: string;
}

export const playlist: Track[] = [
  {
    title: "Last Goodbye",
    artist: "Undertale OST",
    file: "/music/Undertale-Last-Goodbye.mp3",
    cover: "/music/covers/undertale-last-goodbye.jpg",
  },
  {
    title: "Field of Hopes and Dreams",
    artist: "Deltarune OST",
    file: "/music/Deltarune-Field-of-Hopes-and-Dreams.mp3",
    cover: "/music/covers/deltarune-field-of-hopes.jpg",
  },
  {
    title: "A Cruel Angel's Thesis",
    artist: "Evangelion OST",
    file: "/music/A-Cruel-Angels-Thesis.mp3",
    cover: "/music/covers/cruel-angels-thesis.jpg",
  },
  {
    title: "Silhouette",
    artist: "KANA-BOON",
    file: "/music/KANA-BOON-Silhouette.mp3",
    cover: "/music/covers/kana-boon-silhouette.jpg",
  },
  {
    title: "Amore Mio Aiutami",
    artist: "Piero Piccioni",
    file: "/music/Amore-Mio-Aiutami-Piero-Piccioni.mp3",
    cover: "/music/covers/piero-piccioni-greatest-hits.jpg",
  },
  {
    title: "Battle",
    artist: "Game OST",
    file: "/music/Battle.mp3",
    cover: "/music/covers/its-going-down-now.jpg",
  },
];
