# Content Templates

This document provides templates and explanations for adding content to your website.

---

## Media (书影音)

Create files in `src/content/media/{type}/` subfolders (anime/, book/, game/, movie/, music/, tv/).

### Template

```yaml
---
title: "Title Name"          # Required: Name of the book/movie/game etc.
type: anime                  # Required: book | movie | tv | anime | music | game
cover: "https://..."         # Required: URL to cover image (vertical poster works best)
url: "https://..."           # Optional: Link to more info (IMDB, Steam, etc.)
---
```

### Folder Structure

```
src/content/media/
├── anime/
│   ├── JOJO.md
│   └── 我推的孩子.md
├── game/
│   ├── elden-ring.md
│   └── genshin.md
├── movie/
│   └── interstellar.md
├── music/
├── book/
└── tv/
```

---

## Publications

Create files in `src/content/publications/` with images in `src/content/publications/images/`.

### Template

```yaml
---
title: "Paper Title"                    # Required: Full paper title
venue: "CVPR 2024"                      # Required: Conference/journal name and year
venueColor: "#4285f4"                   # Optional: Custom badge color (hex)
authors:                                # Required: List of author names
  - "First Author"
  - "Second Author"
  - "Your Name"
image: "./images/paper-teaser.jpg"      # Optional: Relative path to image in images/ folder
paperUrl: "https://arxiv.org/..."       # Optional: Link to paper PDF
githubUrl: "https://github.com/..."     # Optional: Link to code repository
projectUrl: "https://..."               # Optional: Link to project page
date: 2024-06-01                        # Required: Publication date (YYYY-MM-DD)
highlight: true                         # Optional: Feature this paper prominently
---
```

### Folder Structure

```
src/content/publications/
├── images/
│   ├── realgen.jpg
│   └── loki.jpg
├── RealGen.md
└── LOKI.md
```

### Common Venue Colors

| Venue | Color |
|-------|-------|
| CVPR | `#4285f4` |
| NeurIPS | `#7c3aed` |
| ICCV | `#059669` |
| ECCV | `#dc2626` |
| ICLR | `#5bd436ff` |
| arXiv | `#ff422dff` |

---

## Profile (About Page)

Edit `src/content/profile/about.md` to customize your About page.
Project images should be placed in `src/content/profile/project_images/`.

### Template

```yaml
---
name: "Your Name"
avatar: "/path/to/avatar.jpg"           # Local path or URL
bio: "Your short bio description."
tags:
  - "Tag1"
  - "Tag2"
socials:
  - href: "https://github.com/username"
    label: "GitHub"
    icon: "lucide:github"
timeline:
  - title: "University Name"
    subtitle: "Degree"
    dateRange: "2020 - 2024"
    logo: "https://..."
    description: "Brief description"
news:
  - date: "2024.06"
    content: "News item text"
projects:
  - name: "Project Name"
    description: "Brief description"
    image: "./project_images/project.jpg"  # Relative path with ./
    url: "https://..."
---
```

### Folder Structure

```
src/content/profile/
├── project_images/
│   ├── nanobanana.jpg
│   └── papergallery.jpg
└── about.md
```

### Available Social Icons

| Icon | Name |
|------|------|
| GitHub | `lucide:github` |
| Twitter/X | `lucide:twitter` |
| LinkedIn | `lucide:linkedin` |
| Email | `lucide:mail` |
| Website | `lucide:globe` |
| Bilibili | `lucide:tv-2` |
| YouTube | `lucide:youtube` |
| NetEase Music | `simple-icons:neteasecloudmusic` |
| Google Scholar | `simple-icons:googlescholar` |
