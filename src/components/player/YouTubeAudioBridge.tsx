'use client';

import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubeAudioBridge() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    seekTo,
    nextTrack,
    repeatMode,
    isVideoMode,
  } = usePlayer();

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isApiLoadedRef = useRef(false);

  // Load YouTube Iframe API Script once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        isApiLoadedRef.current = true;
        initPlayer();
      };
    } else if (window.YT && window.YT.Player) {
      isApiLoadedRef.current = true;
      initPlayer();
    }
  }, []);

  const initPlayer = () => {
    if (!window.YT || !window.YT.Player || playerRef.current) return;

    try {
      playerRef.current = new window.YT.Player('youtube-audio-frame', {
        height: '100%',
        width: '100%',
        videoId: currentTrack?.youtubeId || '4NRXx6U8ABQ',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            const vol = isMuted ? 0 : Math.round(volume * 100);
            event.target.setVolume(vol);
            if (isPlaying) event.target.playVideo();
          },
          onStateChange: (event: any) => {
            // 0 = ENDED
            if (event.data === 0) {
              if (repeatMode === 'one') {
                event.target.seekTo(0);
                event.target.playVideo();
              } else {
                nextTrack();
              }
            }
          },
        },
      });
    } catch (e) {
      console.warn('YouTube Player init error:', e);
    }
  };

  // Switch Video / Track
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById && currentTrack?.youtubeId) {
      playerRef.current.loadVideoById({
        videoId: currentTrack.youtubeId,
        startSeconds: 0,
      });
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [currentTrack?.youtubeId]);

  // Handle Play / Pause
  useEffect(() => {
    if (playerRef.current) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (_) {}
    }
  }, [isPlaying]);

  // Handle Volume & Mute
  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      try {
        const vol = isMuted ? 0 : Math.round(volume * 100);
        playerRef.current.setVolume(vol);
      } catch (_) {}
    }
  }, [volume, isMuted]);

  return (
    <div
      ref={containerRef}
      className={
        isVideoMode
          ? 'w-full h-full rounded-2xl overflow-hidden bg-black'
          : 'fixed -bottom-96 -right-96 w-10 h-10 pointer-events-none opacity-0 z-[-10]'
      }
    >
      <div id="youtube-audio-frame" className="w-full h-full pointer-events-none" />
    </div>
  );
}
