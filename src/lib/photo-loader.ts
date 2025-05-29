export interface PhotoConfig {
  id: number;
  imagePath: string;
  alt: string;
  fileName: string;
}

export type Theme = 'light' | 'dark';

// 使用 Vite 的 import.meta.glob 来动态导入图片
function getImageModules() {
  // 获取所有图片文件 - 正确的路径应该是相对于项目根目录
  const lightImages = import.meta.glob('/public/images/light/*.{jpg,jpeg,png,webp,gif}', { 
    eager: true,
    as: 'url' 
  });
  
  const darkImages = import.meta.glob('/public/images/dark/*.{jpg,jpeg,png,webp,gif}', { 
    eager: true,
    as: 'url' 
  });

  return { lightImages, darkImages };
}

// 将文件路径转换为照片配置
function processImages(imageModules: Record<string, string>, theme: Theme): PhotoConfig[] {
  const photos: PhotoConfig[] = [];
  
  Object.entries(imageModules).forEach(([path, url], index) => {
    // 从路径中提取文件名
    const fileName = path.split('/').pop() || `image-${index + 1}`;
    // 转换为正确的 public 路径 - 移除 /public 前缀
    const imagePath = path.replace('/public', '');
    
    photos.push({
      id: index + 1,
      imagePath: imagePath,
      alt: `${theme} theme ${fileName}`,
      fileName: fileName
    });
  });

  // 按文件名排序
  photos.sort((a, b) => a.fileName.localeCompare(b.fileName));

  return photos;
}

// 获取所有照片
export function getAllPhotos() {
  try {
    const { lightImages, darkImages } = getImageModules();
    
    return {
      light: processImages(lightImages, 'light'),
      dark: processImages(darkImages, 'dark')
    };
  } catch (error) {
    console.warn('Could not load images dynamically, falling back to manual list:', error);
    
    // 如果动态加载失败，回退到手动列表
    return getFallbackPhotos();
  }
}

// 回退方案：手动定义的图片列表
function getFallbackPhotos() {
  const createPhotos = (theme: Theme, fileNames: string[]) => {
    return fileNames.map((fileName, index) => ({
      id: index + 1,
      imagePath: `/images/${theme}/${fileName}`,
      alt: `${theme} theme ${fileName}`,
      fileName: fileName
    }));
  };

  // 您可以根据实际文件名修改这些列表
  const lightFiles = [
    'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg'
  ];
  
  const darkFiles = [
    'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg'
  ];

  return {
    light: createPhotos('light', lightFiles),
    dark: createPhotos('dark', darkFiles)
  };
} 