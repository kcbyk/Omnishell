'use client';

import React from 'react';
import {
  Play,
  Pause,
  Heart,
  Clock,
  MoreHorizontal,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TRACKS } from '../../data/musicData';
import { Track, Playlist } from '../../types/spotify';
import confetti from 'canvas-confetti';

interface PlaylistViewProps {
  isLikedSongsView?: boolean;
}

export default function PlaylistView({ isLikedSongsView = false }: PlaylistViewProps) {
  const {
    activePlaylist,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedTrackIds,
    toggleLike,
    isLiked,
  } = usePlayer();

  // If this is Liked Songs view, filter tracks that are in likedTrackIds
  const tracksToDisplay: Track[] = isLikedSongsView
    ? TRACKS.filter((t) => likedTrackIds.includes(t.id))
    : activePlaylist?.tracks || [];

  const playlistTitle = isLikedSongsView ? 'Liked Songs' : activePlaylist?.title || 'Playlist';
  const playlistAuthor = isLikedSongsView ? 'You' : activePlaylist?.author || 'Spotify';
  const playlistCover = isLikedSongsView
    ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
    : activePlaylist?.coverArt || '';
  const playlistColor = isLikedSongsView ? '#450af5' : activePlaylist?.color || '#1DB954';

  const isCurrentPlaylistPlaying =
    currentTrack &&
    tracksToDisplay.some((t) => t.id === currentTrack.id) &&
    isPlaying;

  const totalSeconds = tracksToDisplay.reduce((sum, t) => sum + t.duration, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const handlePlayAll = () => {
    if (tracksToDisplay.length === 0) return;
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(tracksToDisplay[0], activePlaylist || undefined);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
      {/* 1. Hero Header with Dynamic Vibrant Gradient */}
      <div
        style={{
          background: `linear-gradient(to bottom, ${playlistColor} 0%, ${playlistColor}88 60%, #121212 100%)`,
        }}
        className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 select-none shadow-2xl relative"
      >
        {/* Cover Art */}
        <div className="w-44 sm:w-52 md:w-60 aspect-square rounded-xl shadow-2xl overflow-hidden flex-shrink-0 border border-white/10">
          {isLikedSongsView ? (
            <div className="w-full h-full bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shadow-2xl">
              <Heart className="w-24 h-24 fill-white text-white" />
            </div>
          ) : (
            <img
              src={playlistCover}
              alt={playlistTitle}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Info text */}
        <div className="flex flex-col gap-2 overflow-hidden text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-white/90">
            Public Playlist
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {playlistTitle}
          </h1>
          <p className="text-xs md:text-sm text-white/80 line-clamp-2 max-w-2xl font-medium mt-1">
            {isLikedSongsView
              ? 'All your favorite songs saved in one place.'
              : activePlaylist?.description}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-white/90 mt-1">
            <span className="text-white font-bold">{playlistAuthor}</span>
            <span>•</span>
            <span>{tracksToDisplay.length} songs</span>
            <span>•</span>
            <span className="text-white/70">about {totalMinutes} min</span>
          </div>
        </div>
      </div>

      {/* 2. Action Bar (Big Green Play Button, Heart, Download) */}
      <div className="px-6 md:px-8 py-5 flex items-center gap-6 bg-[#121212] select-none">
        {/* Big Green Play Button */}
        <button
          onClick={handlePlayAll}
          disabled={tracksToDisplay.length === 0}
          className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-2xl shadow-[#1DB954]/30 transition-all disabled:opacity-40"
          title="Play"
        >
          {isCurrentPlaylistPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black ml-1" />
          )}
        </button>

        <button
          onClick={() => {
            confetti({ particleCount: 30, spread: 60 });
            alert('Playlist added to your library!');
          }}
          className="p-2 text-[#b3b3b3] hover:text-white transition"
          title="Save Playlist"
        >
          <Heart className="w-8 h-8" />
        </button>

        <button
          onClick={() => alert('Download complete! Available for offline playback.')}
          className="p-2 text-[#b3b3b3] hover:text-white transition"
          title="Download"
        >
          <Download className="w-6 h-6" />
        </button>

        <button className="p-2 text-[#b3b3b3] hover:text-white transition">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* 3. Tracklist Table Header (Desktop) */}
      <div className="px-6 md:px-8 py-2">
        <div className="grid grid-cols-12 text-xs font-bold text-[#b3b3b3] uppercase tracking-wider pb-2 border-b border-white/10 px-3 select-none">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 md:col-span-5">Title</div>
          <div className="hidden md:block col-span-4 truncate">Album</div>
          <div className="col-span-5 md:col-span-2 text-right pr-4 flex items-center justify-end">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Tracklist Rows */}
        <div className="space-y-1 mt-2">
          {tracksToDisplay.length === 0 ? (
            <div className="text-center py-16 text-[#b3b3b3] text-sm">
              No tracks in this playlist yet. Browse songs and add them!
            </div>
          ) : (
            tracksToDisplay.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const liked = isLiked(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, activePlaylist || undefined)}
                  className={`group grid grid-cols-12 items-center px-3 py-2.5 rounded-lg cursor-pointer transition select-none ${
                    isCurrent ? 'bg-[#282828]' : 'hover:bg-[#1f1f1f]'
                  }`}
                >
                  {/* # or Play button */}
                  <div className="col-span-1 text-center text-xs font-mono text-[#b3b3b3] flex items-center justify-center">
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end space-x-0.5 h-3">
                        <span className="w-0.5 h-3 bg-[#1DB954] rounded-full animate-bounce"></span>
                        <span className="w-0.5 h-2 bg-[#1DB954] rounded-full animate-pulse"></span>
                        <span className="w-0.5 h-3.5 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                      </div>
                    ) : (
                      <>
                        <span className="group-hover:hidden">{idx + 1}</span>
                        <Play className="w-3.5 h-3.5 fill-white text-white hidden group-hover:block" />
                      </>
                    )}
                  </div>

                  {/* Title & Artist & Album Thumbnail */}
                  <div className="col-span-6 md:col-span-5 flex items-center gap-3 overflow-hidden pr-2">
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0 shadow"
                    />
                    <div className="overflow-hidden">
                      <div
                        className={`text-sm font-bold truncate ${
                          isCurrent ? 'text-[#1DB954]' : 'text-white'
                        }`}
                      >
                        {track.title}
                      </div>
                      <div className="text-xs text-[#b3b3b3] truncate">{track.artist}</div>
                    </div>
                  </div>

                  {/* Album Name */}
                  <div className="hidden md:block col-span-4 text-xs text-[#b3b3b3] truncate hover:text-white">
                    {track.album}
                  </div>

                  {/* Duration & Heart */}
                  <div className="col-span-5 md:col-span-2 flex items-center justify-end gap-3 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      className={`p-1 transition ${
                        liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-[#1DB954]' : ''}`} />
                    </button>

                    <span className="text-xs font-mono text-[#b3b3b3]">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
