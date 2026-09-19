export type ImageProviderInput = {
  width: number;
  height: number;
  seed?: string;
};

export type ImageProvider = {
  id: string;
  resolve: (input: ImageProviderInput) => { redirectUrl: string };
};

/** Picsum — only MVP provider. Swap later without changing the public /image route. */
export const picsumProvider: ImageProvider = {
  id: "picsum",
  resolve({ width, height, seed }) {
    if (seed) {
      const safe = encodeURIComponent(seed);
      return {
        redirectUrl: `https://picsum.photos/seed/${safe}/${width}/${height}`,
      };
    }
    return {
      redirectUrl: `https://picsum.photos/${width}/${height}`,
    };
  },
};

export function getImageProvider(): ImageProvider {
  return picsumProvider;
}
