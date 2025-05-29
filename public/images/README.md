# Images Folder Structure for CardStack Component

CardStack 组件现在支持自动加载文件夹中的所有图片！

## 文件夹结构

请创建以下文件夹结构并添加您的图片：

```
public/images/
├── light/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   ├── photo3.jpg
│   ├── image1.png
│   ├── pic1.webp
│   └── ... (更多图片)
└── dark/
    ├── photo1.jpg
    ├── photo2.jpg 
    ├── photo3.jpg
    ├── image1.png
    ├── pic1.webp
    └── ... (更多图片)
```

**重要说明**: `public` 文件夹中的内容在 Astro 编译时会直接映射到网站根路径。所以 `public/images/light/photo1.jpg` 在网站中的访问路径是 `/images/light/photo1.jpg`。

## 图片要求

1. **正方形比例**: 图片将显示为正方形 (160x160px 或 180x180px)
2. **支持格式**: JPG, JPEG, PNG, WebP, GIF
3. **推荐尺寸**: 至少 200x200px，最好是正方形
4. **文件命名**: 支持以下命名模式：
   - `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, ...
   - `image1.png`, `image2.png`, `image3.png`, ...
   - `pic1.webp`, `pic2.webp`, `pic3.webp`, ...
   - `1.jpg`, `2.jpg`, `3.jpg`, ...

## 自动加载功能

组件会自动尝试加载文件夹中的图片，无需手动配置每张图片！

### 特性：
- ✅ **自动发现**: 自动查找支持的图片格式
- ✅ **主题切换**: 根据 light/dark 主题自动切换图片
- ✅ **错误处理**: 自动过滤无法加载的图片
- ✅ **加载状态**: 显示加载动画和状态
- ✅ **正方形显示**: 所有图片以正方形显示
- ✅ **智能排序**: 按文件名自动排序

## 组件配置

在使用 CardStack 组件时，您可以配置以下参数：

```tsx
<CardStack 
  client:load 
  maxPhotos={10}              // 最大显示图片数量
  useAutoGeneration={true}    // 启用自动加载
  cardOffset={6}              // 卡片偏移量
  rotationFactor={8}          // 旋转角度因子
/>
```

## 路径说明

- **物理路径**: `public/images/light/photo1.jpg`
- **网站访问路径**: `/images/light/photo1.jpg`
- **组件中配置的路径**: `/images/light/photo1.jpg`

## 手动配置 (可选)

如果您不想使用自动加载，可以在 `src/content/photos/auto-photos.ts` 中手动配置图片列表。

## 注意事项

1. 将 `useAutoGeneration` 设为 `false` 可以使用手动配置
2. 确保图片文件存在于正确的 `public/images/{theme}/` 路径下
3. 建议使用压缩过的图片以提高加载速度
4. 支持的最大图片数量可以通过 `maxPhotos` 参数调整 