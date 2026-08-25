'use client';

import React from 'react';
import { Play, Pause, Heart, Search as SearchIcon, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TRACKS, CATEGORIES } from '../../data/musicData';
import { Track } from '../../types/spotify';

export default function SearchView() {
  const {
    searchQuery,
    setSearchQuery,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleLike,
    isLiked,
  } = usePlayer();

  const filteredTracks = searchQuery.trim()
    ? TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.genre && t.genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const topResult = filteredTracks.length > 0 ? filteredTracks[0] : null;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-6 no-scrollbar pb-32">
      {/* If User Is Searching */}
      {searchQuery.trim() ? (
        <div className="space-y-6">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <h3 className="text-lg font-bold text-white">No results found for "{searchQuery}"</h3>
              <p className="text-xs text-[#b3b3b3]">Please make sure your words are spelled correctly or use fewer keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Result Card */}
              {topResult && (
                <div className="lg:col-span-5 space-y-3">
                  <h2 className="text-xl font-bold text-white">Top result</h2>
                  <div
                    onClick={() => playTrack(topResult)}
                    className="group bg-[#181818] hover:bg-[#282828] p-5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 relative shadow-xl h-56"
                  >
                    <img
                      src={topResult.albumArt}
                      alt={topResult.title}
                      className="w-24 h-24 rounded-lg object-cover shadow-lg"
                    />

                    <div>
                      <h3 className="text-2xl font-black text-white truncate group-hover:underline">
                        {topResult.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#b3b3b3]">
                        <span className="font-semibold text-white">{topResult.artist}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-[10px] uppercase font-bold">
                          Song
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTrack?.id === topResult.id) togglePlay();
                        else playTrack(topResult);
                      }}
                      className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 shadow-2xl flex items-center justify-center text-black transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    >
                      {currentTrack?.id === topResult.id && isPlaying ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Songs List */}
              <div className="lg:col-span-7 space-y-3">
                <h2 className="text-xl font-bold text-white">Songs</h2>
                <div className="space-y-1">
                  {filteredTracks.slice(0, 5).map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const liked = isLiked(track.id);

                    return (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                          isCurrent ? 'bg-[#282828]' : 'hover:bg-[#181818]'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={track.albumArt}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 bg-black/50 items-center justify-center ${isCurrent ? 'flex' : 'hidden group-hover:flex'}`}>
                              {isCurrent && isPlaying ? (
                                <Pause className="w-4 h-4 fill-white text-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                              )}
                            </div>
                          </div>

                          <div className="overflow-hidden">
                            <div className={`text-sm font-bold truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>
                              {track.title}
                            </div>
                            <div className="text-xs text-[#b3b3b3] truncate">{track.artist}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(track.id);
                            }}
                            className={`p-1 transition ${liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white opacity-0 group-hover:opacity-100'}`}
                          >
                            <Heart className={`w-4 h-4 ${liked ? 'fill-[#1DB954]' : ''}`} />
                          </button>

                          <span className="text-xs font-mono text-[#b3b3b3]">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Browse All Categories Grid */
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-white">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSearchQuery(cat.title)}
                className={`group h-36 md:h-44 rounded-2xl p-4 flex flex-col justify-between overflow-hidden cursor-pointer bg-gradient-to-br ${cat.color} relative shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}
              >
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                  {cat.title}
                </h3>
                <img
                  src={cat.coverArt}
                  alt={cat.title}
                  className="absolute -bottom-2 -right-4 w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg shadow-2xl rotate-[25deg] group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
