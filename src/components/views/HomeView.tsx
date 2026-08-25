'use client';

import React from 'react';
import { Play, Pause, Heart, Youtube, Flame, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TRACKS, PLAYLISTS } from '../../data/musicData';
import { Playlist, Track } from '../../types/spotify';

interface QuickTile {
  id: string;
  title: string;
  cover: string;
  isLikedCard?: boolean;
  playlist?: Playlist;
}

export default function HomeView() {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    navigateTo,
    headerColor,
    youtubeTrendingTracks,
    isLoadingTrending,
  } = usePlayer();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickTiles: QuickTile[] = [
    {
      id: 'liked',
      title: 'Liked Songs',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      isLikedCard: true,
    },
    ...PLAYLISTS.slice(0, 5).map((p) => ({
      id: p.id,
      title: p.title,
      cover: p.coverArt,
      playlist: p,
      isLikedCard: false,
    })),
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-8 no-scrollbar pb-32">
      {/* Dynamic Ambient Header Glow */}
      <div
        style={{
          background: `linear-gradient(to bottom, ${headerColor}33 0%, transparent 100%)`,
        }}
        className="absolute top-0 left-0 right-0 h-80 pointer-events-none -z-10 transition-colors duration-700"
      />

      {/* Greeting Title */}
      <div className="pt-2 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          {getGreeting()}
        </h1>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
          <Youtube className="w-4 h-4 text-rose-500" />
          <span>YouTube Audio Live</span>
        </div>
      </div>

      {/* 6 Quick Grid Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {quickTiles.map((tile) => {
          const isCurrentPlaylist =
            tile.playlist &&
            currentTrack &&
            tile.playlist.tracks.some((t) => t.id === currentTrack.id);

          return (
            <div
              key={tile.id}
              onClick={() => {
                if (tile.isLikedCard) navigateTo('liked');
                else if (tile.playlist) navigateTo('playlist', tile.playlist);
              }}
              className="group bg-[#242424]/70 hover:bg-[#282828] rounded-md flex items-center overflow-hidden cursor-pointer transition-all shadow-md relative pr-3"
            >
              {tile.isLikedCard ? (
                <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Heart className="w-7 h-7 fill-white text-white" />
                </div>
              ) : (
                <img
                  src={tile.cover}
                  alt={tile.title}
                  className="w-16 md:w-20 h-16 md:h-20 object-cover flex-shrink-0 shadow-lg"
                />
              )}

              <span className="font-bold text-xs md:text-sm text-white px-3 truncate flex-1">
                {tile.title}
              </span>

              {/* Play Button that slides in on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (tile.playlist && tile.playlist.tracks.length > 0) {
                    if (isCurrentPlaylist && isPlaying) togglePlay();
                    else playTrack(tile.playlist.tracks[0], tile.playlist);
                  } else if (tile.isLikedCard && TRACKS.length > 0) {
                    playTrack(TRACKS[0]);
                  }
                }}
                className={`w-10 h-10 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 flex items-center justify-center text-black shadow-xl transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 ${
                  isCurrentPlaylist && isPlaying ? 'opacity-100 translate-y-0' : ''
                }`}
              >
                {isCurrentPlaylist && isPlaying ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Real YouTube Trending Hits Shelf */}
      {youtubeTrendingTracks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
              <h2 className="text-xl md:text-2xl font-black text-white hover:underline cursor-pointer">
                Live YouTube Top 50 Hits
              </h2>
            </div>
            <span
              onClick={() => navigateTo('search')}
              className="text-xs font-bold text-[#1DB954] hover:underline cursor-pointer"
            >
              Search Any Song &gt;
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {youtubeTrendingTracks.slice(0, 12).map((track) => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className="group bg-[#181818] hover:bg-[#282828] p-3.5 rounded-xl flex flex-col cursor-pointer transition-all duration-300 relative"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 shadow-lg">
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) togglePlay();
                        else playTrack(track);
                      }}
                      className={`absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 shadow-2xl flex items-center justify-center text-black transition-all duration-200 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 ${
                        isCurrent && isPlaying ? 'opacity-100 translate-y-0' : ''
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>

                  <h3 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                    {track.title}
                  </h3>
                  <p className="text-xs text-[#b3b3b3] truncate mt-0.5">
                    {track.artist}
                  </p>
                  <span className="text-[10px] text-rose-400/80 font-mono mt-1">
                    {track.plays}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Made For You Shelf */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white hover:underline cursor-pointer">
            Spotify Editorial Playlists
          </h2>
          <span className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer">
            Show all
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {PLAYLISTS.map((playlist) => {
            const isCurrent =
              currentTrack && playlist.tracks.some((t) => t.id === currentTrack.id);

            return (
              <div
                key={playlist.id}
                onClick={() => navigateTo('playlist', playlist)}
                className="group bg-[#181818] hover:bg-[#282828] p-3.5 rounded-xl flex flex-col cursor-pointer transition-all duration-300 relative"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 shadow-lg">
                  <img
                    src={playlist.coverArt}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Floating Green Play Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playlist.tracks.length > 0) {
                        if (isCurrent && isPlaying) togglePlay();
                        else playTrack(playlist.tracks[0], playlist);
                      }
                    }}
                    className={`absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 shadow-2xl flex items-center justify-center text-black transition-all duration-200 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 ${
                      isCurrent && isPlaying ? 'opacity-100 translate-y-0' : ''
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-5 h-5 fill-black" />
                    ) : (
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white truncate">{playlist.title}</h3>
                <p className="text-xs text-[#b3b3b3] line-clamp-2 mt-1 leading-relaxed">
                  {playlist.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
