/** Seed albums use stable integer ids (photos.albumId references these). */
export type SeedAlbum = {
  id: number;
  authorUsername: string;
  title: string;
};

export const seedAlbums: SeedAlbum[] = [
  { id: 1, authorUsername: "avachen", title: "Desk & tools" },
  { id: 2, authorUsername: "mreid", title: "City walks" },
  { id: 3, authorUsername: "sofia.a", title: "Nature escapes" },
  { id: 4, authorUsername: "noahk", title: "Night scenes" },
  { id: 5, authorUsername: "epetrova", title: "Travel drafts" },
  { id: 6, authorUsername: "jwright", title: "Studio shots" },
  { id: 7, authorUsername: "priyan", title: "Product close-ups" },
  { id: 8, authorUsername: "lmoreau", title: "Food notes" },
];
