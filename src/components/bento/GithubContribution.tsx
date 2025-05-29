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

// Github Contribution data
interface GithubResponse {
  total: number
  contributions: Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }>
}

// Github Contribution API function
async function fetchGithubContributionData(username: string): Promise<GithubResponse> {
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)

  if (!response.ok) {
    throw new Error('Failed to fetch Github contribution data.')
  }

  const data = await response.json()

  return data as GithubResponse
}

// Github Contribution component
const GithubContribution: FunctionComponent<Props> = ({ username, ...props }) => {
    const [data, setData] = useState<GithubResponse | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(true)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const fetchData = useCallback(() => {
        if (!username) {
            setError(new Error('Username is required.'))
            return
        }

        setLoading(true)
        setError(null)
        // Fetch Github contribution data
        fetchGithubContributionData(username)
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false))

    }, [username])

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
                Error loading Github contribution data.
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
    
    const selectLastNDays = (contributions: GithubResponse['contributions'], days: number) => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(today.getDate() - days)
      
        return contributions.filter((activity) => {
          const activityDate = new Date(activity.date)
          return activityDate >= startDate && activityDate <= today
        })
    }

    const colorTheme = {
        lightColorTheme: ['#ebedf0', '#c6e3ff', '#7cc4fa', '#2196f3', '#1976d2'],  // blue color
        darkColorTheme: ['#161b22', '#ffcdd2', '#ef9a9a', '#e57373', '#f44336'],   // red color
    }

    return (
        <>
            <div className="m-4 hidden sm:block">
                <Calendar
                data={selectLastNDays(data!.contributions, 133)}
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
                data={selectLastNDays(data!.contributions, 60)}
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

export default GithubContribution
