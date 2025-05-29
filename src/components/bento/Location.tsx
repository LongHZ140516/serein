'use client'

import createGlobe from 'cobe'
import { MapPinIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSpring } from '@react-spring/web'

const Location = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const fadeMask = 'radial-gradient(circle at 50% 50%, rgb(0, 0, 0) 60%, rgb(0, 0, 0, 0) 70%)'
  const [isDark, setIsDark] = useState(true)

  // Hex颜色转RGB数组的函数
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) {
      throw new Error(`Invalid hex color: ${hex}`)
    }
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ]
  }

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001
    }
  }))

  // 颜色配置对象，方便自定义
  const colorConfig = {
    dark: {
      continentDots: '#CCCCCC',    // 大陆散布点颜色
      locationMarker: '#FFFFFF',   // 位置标记颜色  
      glow: '#808080',            // 光晕颜色
    },
    light: {
      continentDots: '#CCCCCC',   // 大陆散布点颜色
      locationMarker: '#FFFFFF',  // 位置标记颜色
      glow: '#174d84',           // 光晕颜色
    }
  }

  // 监听主题变化
  useEffect(() => {
    // 初始化主题状态
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }

    // 初始检查
    checkTheme()

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    let width = 0

    const onResize = () => {
      if (canvasRef.current && (width = canvasRef.current.offsetWidth)) {
        window.addEventListener('resize', onResize)
      }
    }
    onResize()

    if (!canvasRef.current) return

    // 根据主题获取颜色配置
    const currentColors = isDark ? colorConfig.dark : colorConfig.light

    // 根据主题设置不同的颜色配置
    const globeConfig = isDark ? {
      // Dark 模式配置
      dark: 1,
      diffuse: 2,
      mapSamples: 12_000,
      mapBrightness: 2,
      baseColor: hexToRgb(currentColors.continentDots),      // 大陆散布点颜色
      markerColor: hexToRgb(currentColors.locationMarker),   // 位置标记颜色
      glowColor: hexToRgb(currentColors.glow),              // 光晕颜色
    } : {
      // Light 模式配置
      dark: 1,
      diffuse: 3,
      mapSamples: 12_000,
      mapBrightness: 3,
      baseColor: hexToRgb(currentColors.continentDots),      // 大陆散布点颜色
      markerColor: hexToRgb(currentColors.locationMarker),   // 位置标记颜色
      glowColor: hexToRgb(currentColors.glow),              // 光晕颜色
    }

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      ...globeConfig,
      markers: [{ location: [22.255899, 113.552724], size: 0.1 }],
      scale: 1.05,
      onRender: (state) => {
        state.phi = 2.75 + r.get()
        state.width = width * 2
        state.height = width * 2
      }
    })

    return () => {
      globe.destroy()
      window.removeEventListener('resize', onResize)
    }
  }, [r, isDark]) // 添加 isDark 依赖

  return (
    <div className='relative flex h-full w-full flex-col justify-between gap-6 overflow-hidden rounded-3xl p-4 lg:p-6'>
      <div className='flex items-center gap-2'>
        <MapPinIcon className='size-[18px]' />
        <h2 className='text-sm font-light'>China, Zhuhai</h2>
      </div>
      <div className='absolute inset-x-0 bottom-[-15%] mx-auto aspect-square h-[50%] w-[80%]'>
      {/* <div className='absolute inset-x-0 bottom-[-190px] mx-auto aspect-square h-[388px] [@media(max-width:420px)]:bottom-[-140px] [@media(max-width:420px)]:h-[320px] [@media(min-width:768px)_and_(max-width:858px)]:h-[350px]'> */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            placeItems: 'center',
            placeContent: 'center',
            overflow: 'visible'
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '1/1',
              maxWidth: 800,
              WebkitMaskImage: fadeMask,
              maskImage: fadeMask
            }}
          >
            <canvas
              ref={canvasRef}
              onPointerDown={(e) => {
                pointerInteracting.current = e.clientX - pointerInteractionMovement.current
                canvasRef.current && (canvasRef.current.style.cursor = 'grabbing')
              }}
              onPointerUp={() => {
                pointerInteracting.current = null
                canvasRef.current && (canvasRef.current.style.cursor = 'grab')
              }}
              onPointerOut={() => {
                pointerInteracting.current = null
                canvasRef.current && (canvasRef.current.style.cursor = 'grab')
              }}
              onMouseMove={(e) => {
                if (pointerInteracting.current !== null) {
                  const delta = e.clientX - pointerInteracting.current
                  pointerInteractionMovement.current = delta
                  void api.start({
                    r: delta / 200
                  })
                }
              }}
              onTouchMove={(e) => {
                if (pointerInteracting.current !== null && e.touches[0]) {
                  const delta = e.touches[0].clientX - pointerInteracting.current
                  pointerInteractionMovement.current = delta
                  void api.start({
                    r: delta / 100
                  })
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                contain: 'layout paint size',
                cursor: 'auto',
                userSelect: 'none'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Location
