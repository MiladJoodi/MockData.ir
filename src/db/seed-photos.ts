import type { NewPhoto } from "./schema/photos";

type SeedPhoto = Omit<NewPhoto, "id" | "createdAt" | "updatedAt">;

const titles = [
  "Morning desk setup",
  "City lights at dusk",
  "Coastline trail",
  "Studio whiteboard",
  "Coffee and laptop",
  "Library aisle",
  "Mountain ridge",
  "Neon alley",
  "Quiet harbor",
  "Rooftop plants",
  "Keyboard close-up",
  "Rain on glass",
  "Sunset plaza",
  "Forest path",
  "Bridge cables",
  "Market stall",
  "Desert road",
  "Snowy street",
  "Airport window",
  "Garden bench",
  "Train platform",
  "Museum hall",
  "Park fountain",
  "Skyline fog",
];

export const seedPhotos: SeedPhoto[] = titles.map((title, index) => {
  const albumId = (index % 8) + 1;
  const n = index + 1;
  return {
    albumId,
    title,
    url: `https://picsum.photos/id/${n + 20}/600/400`,
    thumbnailUrl: `https://picsum.photos/id/${n + 20}/150/150`,
  };
});
