export interface PhotoConfig {
  id: number;
  imagePath: string;
  alt: string;
  fileName: string;
}

export type Theme = 'light' | 'dark';

export function generatePhotoConfigs(theme: Theme, maxPhotos: number = 20): PhotoConfig[] {
  const photos: PhotoConfig[] = [];
  
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  
  const patterns = [
    'photo{n}',
    'image{n}',
    'pic{n}',
    '{n}'
  ];
  
  let photoCount = 0;
  
  // try different naming patterns and extensions
  for (let i = 1; i <= maxPhotos && photoCount < maxPhotos; i++) {
    for (const pattern of patterns) {
      for (const ext of extensions) {
        const fileName = pattern.replace('{n}', i.toString()) + '.' + ext;
        const imagePath = `/images/${theme}/${fileName}`;
        
        photos.push({
          id: photoCount + 1,
          imagePath: imagePath,
          alt: `${theme} theme ${fileName}`,
          fileName: fileName
        });
        
        photoCount++;
        if (photoCount >= maxPhotos) break;
      }
      if (photoCount >= maxPhotos) break;
    }
  }
  
  return photos;
}

// predefined photo configurations - use actual files
export const manualPhotos = {
  light: [
    {
      id: 1,
      imagePath: "/images/light/kana.jpeg",
      alt: "Light theme kana",
      fileName: "kana.jpeg"
    },
    {
      id: 2,
      imagePath: "/images/light/kana.jpeg",
      alt: "Light theme kana copy",
      fileName: "kana.jpeg"
    },
    {
      id: 3,
      imagePath: "/images/light/kana.jpeg",
      alt: "Light theme kana copy 2",
      fileName: "kana.jpeg"
    }
  ],
  dark: [
    {
      id: 1,
      imagePath: "/images/dark/cover.jpeg",
      alt: "Dark theme cover",
      fileName: "cover.jpeg"
    },
    {
      id: 2,
      imagePath: "/images/dark/cover.jpeg",
      alt: "Dark theme cover copy",
      fileName: "cover.jpeg"
    },
    {
      id: 3,
      imagePath: "/images/dark/cover.jpeg",
      alt: "Dark theme cover copy 2",
      fileName: "cover.jpeg"
    }
  ]
} as const;

// get actual file names
function getActualFileNames(theme: Theme): string[] {
  // check the actual file names
  if (theme === 'light') {
    return ['makoto.jpg', 'anna.jpg', 'ayaka.png', 'akane.jpg', 'yoshino.jpg', 'chino.jpg'];
  } else {
    return ['kana.jpg', 'topaz.jpg', 'chisato.jpg', 'yoshizawa.jpg', 'kotori.jpg', '02.jpg', 'asuka.jpg'];
  }
}

// more intelligent photo configuration generation function
export function generateSmartPhotoConfigs(theme: Theme, maxPhotos: number = 6): PhotoConfig[] {
  const actualFiles = getActualFileNames(theme);
  const photos: PhotoConfig[] = [];
  
  // if there are actual files, use them to fill the cards
  if (actualFiles.length > 0) {
    for (let i = 0; i < maxPhotos; i++) {
      const file = actualFiles[i % actualFiles.length];
      photos.push({
        id: i + 1,
        imagePath: `/images/${theme}/${file}`,
        alt: `${theme} theme ${file} (${i + 1})`,
        fileName: file
      });
    }
  }
  
  return photos;
}

// get all photos main function - update to use smart configuration
export function getAllPhotos(useAutoGeneration: boolean = false, maxPhotos: number = 6) {
  if (useAutoGeneration) {
    return {
      light: generateSmartPhotoConfigs('light', maxPhotos),
      dark: generateSmartPhotoConfigs('dark', maxPhotos)
    };
  } else {
    return manualPhotos;
  }
} 