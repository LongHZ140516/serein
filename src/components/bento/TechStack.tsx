'use client'

import {
  SiCloudflare,
  SiCss3,
  SiFigma,
  SiFirebase,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiMarkdown,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiUnrealengine,
  SiBlender,
  SiLatex,
  SiPytorch,
  SiTensorflow,
  SiCplusplus,
  SiC,
  SiDocker,
  SiTypst
} from 'react-icons/si'
// import Marquee from 'react-fast-marquee'
import { ZapIcon } from 'lucide-react'
import '@/styles/marquee.css'
import { useEffect } from 'react'

interface TechStackProps {
  iconSize?: number;
  gapSize?: number;
  speed?: number;
}

export const TechStack = ({ iconSize = 24, gapSize = 12, speed = 15 }: TechStackProps) => {
  useEffect(() => {
    const marqueeLeft = document.getElementById('marquee-left') as HTMLElement;
    const marqueeRight = document.getElementById('marquee-right') as HTMLElement;
  
    const setMarqueeSpeed = () => {
      const width = window.innerWidth;
      // Convert speed parameter to animation duration in seconds
      const duration = `${width < 600 ? speed * 2 : speed}s`;
      if (marqueeLeft) marqueeLeft.style.animationDuration = duration;
      if (marqueeRight) marqueeRight.style.animationDuration = duration;
    };
  
    setMarqueeSpeed();
    window.addEventListener('resize', setMarqueeSpeed);

    return () => {
      window.removeEventListener('resize', setMarqueeSpeed);
    };
  }, [speed]);

  // Use the iconSize parameter to set the size of each icon
  const iconClass = `size-[${iconSize}px]`;
  
  // Create icon components with the specified size
  const topIcons = [
    <SiHtml5 key="html5" className={iconClass} />,
    <SiCss3 key="css3" className={iconClass} />,
    <SiJavascript key="js" className={iconClass} />,
    <SiTypescript key="ts" className={iconClass} />,
    <SiTailwindcss key="tailwind" className={iconClass} />,
    <SiNextdotjs key="next" className={iconClass} />,
    <SiReact key="react" className={iconClass} />,
    <SiLatex key="latex" className={iconClass} />,
    <SiTypst key="typst" className={iconClass} />,
    <SiMarkdown key="markdown" className={iconClass} />,
  ];

  const bottomIcons = [
    <SiC key="c" className={iconClass} />,
    <SiCplusplus key="cpp" className={iconClass} />,
    <SiPython key="python" className={iconClass} />,
    <SiPytorch key="pytorch" className={iconClass} />,
    <SiGit key="git" className={iconClass} />,
    <SiDocker key="docker" className={iconClass} />,
    <SiBlender key="blender" className={iconClass} />,
    <SiUnrealengine key="unreal" className={iconClass} />,
    <SiAdobephotoshop key="photoshop" className={iconClass} />,
    <SiAdobepremierepro key="premiere" className={iconClass} />,
  ];

  return (
    <div className='relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-xl p-4 lg:p-6'>
      <div className='flex items-center gap-2'>
        <ZapIcon className='size-[15px]' />
        <h2 className='text-sm font-light'>Stacks</h2>
      </div>
      
      <div className="flex flex-1 flex-col justify-center gap-6">
        <div className="relative flex overflow-hidden">
          <div 
            id="marquee-left" 
            className="marquee-left flex whitespace-nowrap"
            style={{ gap: `${gapSize}rem` }}
          >
            {topIcons}
            {topIcons}
          </div>
        </div>
        
        <div className="relative flex overflow-hidden">
          <div 
            id="marquee-right" 
            className="marquee-right flex whitespace-nowrap"
            style={{ gap: `${gapSize}rem` }}
          >
            {bottomIcons}
            {bottomIcons}
          </div>
        </div>
      </div>
    </div>
  )
}