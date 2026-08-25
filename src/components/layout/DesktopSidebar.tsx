'use client';

import React, { useState } from 'react';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Music2,
  Sparkles,
  Compass,
  ListMusic,
  FolderPlus,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function DesktopSidebar() {
  const {
    activeView,
    navigateTo,
    playlists,
    activePlaylist,
    createCustomPlaylist,
    likedTrackIds,
  } = usePlayer();

  const [filter, setFilter] = useState<'all' | 'playlists' | 'artists'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      createCustomPlaylist(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-full gap-2 p-2 select-none flex-shrink-0 text-[#b3b3b3]">
      {/* Top Box: Navigation */}
      <div className="bg-[#121212] rounded-xl p-4 flex flex-col gap-4 font-semibold text-sm">
        <button
          onClick={() => navigateTo('home')}
          className={`flex items-center gap-4 transition-colors hover:text-white ${
            activeView === 'home' ? 'text-white' : ''
          }`}
        >
          <Home className="w-6 h-6" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigateTo('search')}
          className={`flex items-center gap-4 transition-colors hover:text-white ${
            activeView === 'search' ? 'text-white' : ''
          }`}
        >
          <Search className="w-6 h-6" />
          <span>Search</span>
        </button>
      </div>

      {/* Bottom Box: Your Library */}
      <div className="bg-[#121212] rounded-xl flex-1 flex flex-col overflow-hidden p-2">
        {/* Library Header */}
        <div className="flex items-center justify-between px-3 py-2 text-[#b3b3b3]">
          <button
            onClick={() => navigateTo('library')}
            className={`flex items-center gap-2.5 font-bold text-sm hover:text-white transition-colors ${
              activeView === 'library' ? 'text-white' : ''
            }`}
          >
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </button>

          <button
            onClick={() => setIsCreating(true)}
            className="p-1.5 rounded-full hover:bg-[#242424] hover:text-white transition-colors"
            title="Create Playlist"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
          {(['all', 'playlists', 'artists'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                filter === cat
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Create playlist input */}
        {isCreating && (
          <form onSubmit={handleCreate} className="mx-2 my-1 p-2 bg-[#242424] rounded-lg">
            <input
              type="text"
              autoFocus
              placeholder="Playlist name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#181818] border border-white/10 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
            />
            <div className="flex justify-end gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-2 py-0.5 text-xs text-[#b3b3b3] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-0.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* Playlist & Liked Songs Scroll Area */}
        <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5 no-scrollbar">
          {/* Liked Songs Item */}
          <div
            onClick={() => navigateTo('liked')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${
              activeView === 'liked' ? 'bg-[#242424]' : 'hover:bg-[#181818]'
            }`}
          >
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center flex-shrink-0 shadow-md">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">Liked Songs</div>
              <div className="text-xs text-[#b3b3b3] flex items-center gap-1.5">
                <span className="text-[#1DB954]">📌 Playlist</span>
                <span>• {likedTrackIds.length} songs</span>
              </div>
            </div>
          </div>

          {/* Curated & Custom Playlists */}
          {playlists.map((playlist) => {
            const isActive = activeView === 'playlist' && activePlaylist?.id === playlist.id;

            return (
              <div
                key={playlist.id}
                onClick={() => navigateTo('playlist', playlist)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${
                  isActive ? 'bg-[#242424]' : 'hover:bg-[#181818]'
                }`}
              >
                <img
                  src={playlist.coverArt}
                  alt={playlist.title}
                  className="w-12 h-12 rounded-md object-cover flex-shrink-0 shadow-sm"
                />
                <div className="overflow-hidden">
                  <div className={`text-sm font-semibold truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>
                    {playlist.title}
                  </div>
                  <div className="text-xs text-[#b3b3b3] truncate">
                    Playlist • {playlist.author}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
