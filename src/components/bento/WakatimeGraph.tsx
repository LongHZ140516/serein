'use client'

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { IconType } from 'react-icons'

// Language Icons
import {
  SiPython,
  SiTypescript,
  SiAstro,
  SiMarkdown,
  SiMdx,
  SiCss3,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiNextdotjs,
  SiCplusplus,
  SiC,
  SiJson
} from 'react-icons/si'

const languageIcons: { [key: string]: IconType } = {
  python: SiPython,
  typescript: SiTypescript,
  astro: SiAstro,
  markdown: SiMarkdown,
  mdx: SiMdx,
  css: SiCss3,
  react: SiReact,
  javascript: SiJavascript,
  html: SiHtml5,
  'next.js': SiNextdotjs,
  json: SiJson,
  'c++': SiCplusplus,
  c: SiC,
}

// Language interface
interface Language {
  name: string
  percent: number
  hours: number
  minutes: number
  text: string
}

// chart colors
const themeColors = {
  light: [
    '#bbdefb',
    '#78bdf6',
    '#59a0e5',
    '#206cb1',
    '#20568c',
    '#204166',
    '#012a4a',
  ],
  dark: [
    '#ffcdd2',
    '#fc9ca2',
    '#fb747d',
    '#f92432',
    '#e30613',
    '#c70512  ',
    '#500207',
  ]
}

// icon color
const iconBG = {
  light: '#ebedf0',
  dark: '#1A1A1A',
}
const iconFill = {
  light: '#0353a4',
  dark: '#ffe6e8',
}

const getLanguageIcon = (name: string) => {
  const Icon = languageIcons[name.toLowerCase()]
  return Icon ? <Icon /> : null
}

const WakatimeGraph = () => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // get theme from system
  useEffect(() => {
    // init theme setting
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')

    // listen theme change
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isDark = document.documentElement.classList.contains('dark')
                setTheme(isDark ? 'dark' : 'light')
            }
        })
    })

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    })

    // clean up listeners
    return () => {
        observer.disconnect()
    }
  }, [])

  // chart config
  const chartConfig: ChartConfig = {
    hours: {
      label: 'Hours',
      color: 'hsl(var(--primary))',
    },
    label: {
      color: 'hsl(var(--muted-foreground))',
    },
    ...themeColors[theme].reduce(
      (acc, color, index) => ({
        ...acc,
        [`language${index}`]: { label: `Language ${index + 1}`, color },
      }),
      {},
    ),
  }


  useEffect(() => {
    const url = 'https://wakatime.com/share/@serein/5d980445-e28f-480b-90ad-8ad15c50dd58.json'
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch Languages data')
        return response.json()
      })
      .then(data => {
        const processLanguages = data.data
          .slice(0, 7)
          .map( (lang: { name: string, hours: number }, index: number) => ({
            name: lang.name,
            hours: Number(lang.hours.toFixed(2)),
            fill: themeColors[theme][index % themeColors[theme].length]
          }))
        setLanguages(processLanguages)
        setLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setLoading(false)
      })
  }, [theme])
  
  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const icon = getLanguageIcon(payload.value.toLowerCase())
    return (
      <g transform={`translate(${x},${y})`}>
        <title>{payload.value}</title>
        <circle cx="-18" cy="0" r="14" fill={iconBG[theme]} />
        <foreignObject width={16} height={16} x={-26} y={-8}>
          {icon ? (
            React.cloneElement(icon, { size: 16, color: iconFill[theme] })
          ) : (
            <text
              x={8}
              y={12}
              fill="#E9D3B6"
              fontSize="12"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {payload.value.charAt(0).toUpperCase()}
            </text>
          )}
        </foreignObject>
      </g>
    )
  }

  if (loading)
    return (
      <div className="size-full rounded-3xl p-4">
        <div className="space-y-1.5">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="flex items-center gap-x-4">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex-1">
                <Skeleton
                  className="h-8 w-full rounded-lg"
                  style={{ width: `${100 * Math.pow(0.6, index)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  if (error) return <div>Error: {error}</div>

  return (
    <ChartContainer config={chartConfig} className="h-full w-full p-4">
      <BarChart
        accessibilityLayer
        data={languages}
        layout="vertical"
        margin={{ left: -10, right: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={50}
          tick={<CustomYAxisTick />}
        />
        <XAxis type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar
          dataKey="hours"
          fill="#E9D3B6"
          radius={[8, 8, 8, 8]}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="hours"
            position="right"
            formatter={(value: number) => `${Math.round(value)}h`}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export default WakatimeGraph