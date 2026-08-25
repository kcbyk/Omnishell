'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, Search as SearchIcon, Youtube, Sparkles, Loader2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { CATEGORIES } from '../../data/musicData';
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

  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Live YouTube search debounce
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.tracks && Array.isArray(data.tracks)) {
          setSearchResults(data.tracks);
        }
      } catch (e) {
        console.warn('YouTube search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const topResult = searchResults.length > 0 ? searchResults[0] : null;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-6 no-scrollbar pb-32">
      {/* If User Is Searching */}
      {searchQuery.trim() ? (
        <div className="space-y-6">
          {isSearching && searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-[#1DB954] animate-spin" />
              <p className="text-xs font-mono text-[#b3b3b3]">Searching YouTube Global Catalog...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <h3 className="text-lg font-bold text-white">No results found for "{searchQuery}"</h3>
              <p className="text-xs text-[#b3b3b3]">Try searching by song title, artist name, or genre.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Result Card */}
              {topResult && (
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Top Result</h2>
                    <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">
                      <Youtube className="w-3 h-3" /> Live YouTube Stream
                    </span>
                  </div>

                  <div
                    onClick={() => playTrack(topResult)}
                    className="group bg-[#181818] hover:bg-[#282828] p-5 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 relative shadow-xl h-60"
                  >
                    <img
                      src={topResult.albumArt}
                      alt={topResult.title}
                      className="w-28 h-28 rounded-xl object-cover shadow-lg"
                    />

                    <div>
                      <h3 className="text-2xl font-black text-white truncate group-hover:underline">
                        {topResult.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#b3b3b3]">
                        <span className="font-semibold text-white">{topResult.artist}</span>
                        <span>•</span>
                        <span className="text-[#1DB954] font-bold font-mono text-[10px]">
                          {topResult.plays}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTrack?.id === topResult.id) togglePlay();
                        else playTrack(topResult);
                      }}
                      className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 shadow-2xl flex items-center justify-center text-black transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    >
                      {currentTrack?.id === topResult.id && isPlaying ? (
                        <Pause className="w-6 h-6 fill-black" />
                      ) : (
                        <Play className="w-6 h-6 fill-black ml-1" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Songs List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Songs ({searchResults.length})</h2>
                  {isSearching && <Loader2 className="w-4 h-4 text-[#1DB954] animate-spin" />}
                </div>

                <div className="space-y-1">
                  {searchResults.slice(0, 8).map((track) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const liked = isLiked(track.id);

                    return (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
                          isCurrent ? 'bg-[#282828]' : 'hover:bg-[#181818]'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 shadow">
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
                            <div className="text-xs text-[#b3b3b3] truncate flex items-center gap-1.5">
                              <span>{track.artist}</span>
                              <span>•</span>
                              <span className="text-[10px] text-slate-400 font-mono">{track.plays}</span>
                            </div>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-black text-white">Browse all Genres</h2>
            <span className="text-xs font-bold text-[#b3b3b3]">Live YouTube Streaming</span>
          </div>

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
