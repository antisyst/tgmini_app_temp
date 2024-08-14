import { useState, useEffect } from 'react';

export const usePreloadImages = (imageUrls: string[]) => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const totalImages = imageUrls.length;

    const loadImage = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          if (isMounted) {
            setProgress((prevProgress) => prevProgress + (100 / totalImages));
          }
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      });
    };

    Promise.all(imageUrls.map(loadImage))
      .then(() => {
        if (isMounted) setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) setLoaded(true); 
      });

    return () => {
      isMounted = false;
    };
  }, [imageUrls]);

  return { progress, loaded };
};
