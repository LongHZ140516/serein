'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { type FunctionComponent, useCallback, useEffect, useState } from 'react'
import Calendar, {
  type Props as ActivityCalendarProps,
} from 'react-activity-calendar'

// Adopted from https://github.com/grubersjoe/react-github-calendar
// Copyright (c) 2019 Jonathan Gruber, MIT License

interface Props extends Omit<ActivityCalendarProps, 'data' | 'theme'> {
    username?: string
}

interface Day{
    date: string
    total: number
    categories: Array<{
        name: string
        total: number
    }>
}

interface ApiResponse {
    days: Array<Day>
    status: string
    is_up_to_date: boolean
    is_up_to_date_pending_future: boolean
    is_stuck: boolean
    is_already_updating: boolean
    range: string
    percent_calculated: number
    writes_only: boolean
    user_id: string
    is_including_today: boolean
    human_readable_range: string
  }

interface Activity {
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
}

// Github Contribution API function
async function fetchWakatimeCalendarData(): Promise<ApiResponse> {
  const response = await fetch(`https://wakatime.com/share/@serein/22dba51c-5dbc-4365-942f-b0cbc7faf20f.json`)

  if (!response.ok) {
    throw new Error('Failed to fetch Wakatime calendar data.')
  }

  const data = await response.json()
  return data as ApiResponse
}

// Wakatime Calendar component
const WakatimeCalendar: FunctionComponent<Props> = ({ ...props }) => {
    const [data, setData] = useState<Activity[]>([])
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(true)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const fetchData = useCallback(() => {
        setLoading(true)
        setError(null)
        // Fetch Wakatime calendar data
        fetchWakatimeCalendarData()
            .then((calendarData) => {
                if (!calendarData.days || !Array.isArray(calendarData.days)){
                    setLoading(false)
                    setError(new Error('Error fetching wakatime calendar data.'))
                    return
                }

                const transformedData = calendarData.days.map((day) => {

                    const totalSeconds = day.total
          
                    let level: 0 | 1 | 2 | 3 | 4 = 0
                    if (totalSeconds > 0) {
                      if (totalSeconds < 1800)
                        level = 1
                      else if (totalSeconds < 7200)
                        level = 2
                      else if (totalSeconds < 14400)
                        level = 3
                      else level = 4
                    }
          
                    return {
                      date: day.date,
                      count: Math.round(totalSeconds / 60),
                      level: level,
                    }
                  })
                setData(transformedData)
                setLoading(false)
            })
            .catch(setError)
            .finally(() => setLoading(false))

    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

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

    // Error state
    if (error) {
        <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
                Error loading Wakatime calendar data.
            </p>
        </div>
    }

    // Loading state
    if (loading) {
        return <Skeleton className="h-[70%] w-[85%] rounded-3xl" />
    }

    // No data state
    if (!data) {
        <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
                No data found.
            </p>
        </div>
    }
    
    const selectLastNDays = (activities: Activity[], days: number) => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - days)
      
        return activities.filter((activity) => {
          const activityDate = new Date(activity.date)
          return activityDate >= startDate && activityDate <= today
        })
    }

    const colorTheme = {
        lightColorTheme: ['#ebedf0', '#c6e3ff', '#7cc4fa', '#2196f3', '#1976d2'],  // 蓝色系
        darkColorTheme: ['#161b22', '#ffcdd2', '#ef9a9a', '#e57373', '#f44336'],   // 红色系
    }

    return (
        <>
            <div className="m-4 hidden sm:block">
                <Calendar
                data={selectLastNDays(data, 133)}
                theme={{
                    light: colorTheme.lightColorTheme,
                    dark: colorTheme.darkColorTheme
                }}
                colorScheme={theme}
                blockSize={20}
                blockMargin={6}
                blockRadius={7}
                {...props}
                maxLevel={4}
                hideTotalCount
                hideColorLegend
                />
            </div>
            <div className="m-4 scale-110 sm:hidden">
                <Calendar
                data={selectLastNDays(data, 60)}
                theme={{
                    light: colorTheme.lightColorTheme,
                    dark: colorTheme.darkColorTheme
                }}
                colorScheme={theme}
                blockSize={20}
                blockMargin={6}
                blockRadius={7}
                {...props}
                maxLevel={4}
                hideTotalCount
                hideColorLegend
                />
            </div>
        </>
    )
}

export default WakatimeCalendar
