import { useEffect, useState } from "react";
import { SiNeteasecloudmusic } from "react-icons/si";
import { PiWaveformBold } from "react-icons/pi";
import { Skeleton } from "@/components/ui/skeleton";
import { MoveUpRight, Play, Pause, ChevronUp, ChevronDown } from "lucide-react";
import { songs, type Song } from "@/content/music/songs";

const MusicPlayer = () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

    // 在客户端初始化 Audio
    useEffect(() => {
        setAudio(new Audio());
    }, []);

    // get current songs & song
    const currentSongs = songs[theme];
    const currentSong = currentSongs[currentSongIndex];
    
    // 首次自动播放
    useEffect(() => {
        if (audio && !hasAutoPlayed && currentSong) {
            // 设置音频源
            audio.src = currentSong.url;
            audio.volume = volume;
            
            // 尝试自动播放
            const attemptAutoPlay = async () => {
                try {
                    await audio.play();
                    setIsPlaying(true);
                    setHasAutoPlayed(true);
                    console.log('自动播放成功');
                } catch (error) {
                    console.log('自动播放被阻止，需要用户交互:', error);
                    setIsPlaying(false);
                    
                    // 添加用户交互监听器，一旦用户点击页面就开始播放
                    const handleUserInteraction = async () => {
                        try {
                            await audio.play();
                            setIsPlaying(true);
                            setHasAutoPlayed(true);
                            console.log('用户交互后播放成功');
                            // 移除监听器
                            document.removeEventListener('click', handleUserInteraction);
                            document.removeEventListener('keydown', handleUserInteraction);
                        } catch (playError) {
                            console.error('播放失败:', playError);
                        }
                    };
                    
                    // 监听用户的第一次交互
                    document.addEventListener('click', handleUserInteraction, { once: true });
                    document.addEventListener('keydown', handleUserInteraction, { once: true });
                }
            };
            
            attemptAutoPlay();
        }
    }, [audio, currentSong, hasAutoPlayed, volume]);

    // observe theme change
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDark = document.documentElement.classList.contains('dark');
                    const newTheme = isDark ? 'dark' : 'light';
                    setTheme(newTheme);
                    
                    setCurrentSongIndex(0);
                    
                    if (audio) {
                        // stop current playing
                        audio.pause();
                        // set new song
                        audio.src = songs[newTheme][0].url;
                        // play new song
                        audio.play().then(() => {
                            setIsPlaying(true);
                        }).catch((error) => {
                            console.error('Play song failed:', error);
                            setIsPlaying(false);
                        });
                    }
                }
            });
        });
    
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    
        return () => observer.disconnect();
    }, [audio]);

    // icon color
    const iconColor = {
        light: '#00a6fb',
        dark: '#f44336',
    }

    // player color
    const playerColor = {
        light: '#00a6fb',
        dark: '#ff4040',
    }
    
    // music control
    const togglePlay = () => {
        if (!audio) return;
        
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.src = currentSong.url;
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                console.error('Play song failed:', error);
                setIsPlaying(false);
            });
        }
    };
    
    const playNext = () => {
        if (!audio) return;
        
        const nextIndex = (currentSongIndex + 1) % currentSongs.length;
        setCurrentSongIndex(nextIndex);
        audio.src = currentSongs[nextIndex].url;
        audio.play().then(() => {
            setIsPlaying(true);
        }).catch((error) => {
            console.error('Play song failed:', error);
            setIsPlaying(false);
        });
    };
    
    const playPrevious = () => {
        if (!audio) return;
        
        const prevIndex = (currentSongIndex - 1 + currentSongs.length) % currentSongs.length;
        setCurrentSongIndex(prevIndex);
        audio.src = currentSongs[prevIndex].url;
        audio.play().then(() => {
            setIsPlaying(true);
        }).catch((error) => {
            console.error('播放失败:', error);
            setIsPlaying(false);
        });
    };

    // clean up
    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, [audio]);
    return (
        <>
          <div className="relative flex h-full w-full flex-col justify-between p-6">
            {/* 顶部区域：图片和控制按钮 */}
            <div className="flex gap-3 mb-4">
              <img
                src={currentSong.image}
                alt="Album art"
                width={128}
                height={128}
                className="w-[100px] h-[100px] md:w-[128px] md:h-[128px] rounded-xl border border-border flex-shrink-0"
              />
              
              {/* 竖直排列的控制按钮 */}
              <div className="flex flex-col justify-center gap-1">
                <button 
                    onClick={playPrevious} 
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <ChevronUp className="w-4 h-4" />
                </button>
                <button 
                    onClick={togglePlay} 
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    {isPlaying ? (
                        <Pause className="w-4 h-4" />
                    ) : (
                        <Play className="w-4 h-4" />
                    )}
                </button>
                <button 
                    onClick={playNext} 
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex min-w-0 flex-1 flex-col justify-end overflow-hidden">
              <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex gap-2">
                    <PiWaveformBold size={16} color={playerColor[theme]} />
                    <span className="text-sm" style={{ color: playerColor[theme] }}>
                        Now playing...
                    </span>
                </span>
                </div>
                <span className="text-md mb-2 truncate font-bold leading-none">
                  {currentSong.name}
                </span>
                <span className="w-[85%] truncate text-xs text-muted-foreground">
                  <span className="font-semibold text-secondary-foreground">
                    by
                  </span>{' '}
                  {currentSong.artist}
                </span>
                <span className="w-[85%] truncate text-xs text-muted-foreground">
                  <span className="font-semibold text-secondary-foreground">
                    on
                  </span>{' '}
                  {currentSong.album}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 m-3 text-primary">
            <SiNeteasecloudmusic size={50} color={iconColor[theme]} fill={iconColor[theme]}/>
          </div>
          {/* <a
            href={currentSong.url}
            aria-label="View on last.fm"
            title="View on last.fm"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border bg-secondary/50 p-3 text-primary transition-all duration-300 hover:rotate-12 hover:ring-1 hover:ring-primary"
          >
            <MoveUpRight size={16} />
          </a> */}
        </>
      )
}

export default MusicPlayer;
