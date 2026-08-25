'use client';

import React, { useState } from 'react';
import { Plus, Heart, Music, Sparkles, FolderPlus } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TRACKS } from '../../data/musicData';

export default function LibraryView() {
  const {
    playlists,
    likedTrackIds,
    navigateTo,
    createCustomPlaylist,
  } = usePlayer();

  const [filter, setFilter] = useState<'all' | 'playlists' | 'liked'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistTitle.trim()) {
      createCustomPlaylist(playlistTitle.trim());
      setPlaylistTitle('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-6 no-scrollbar pb-32">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Your Library
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-full bg-[#242424] hover:bg-[#282828] text-white flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-md"
          title="Create New Playlist"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        {(['all', 'playlists', 'liked'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === cat
                ? 'bg-white text-black'
                : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {/* Liked Songs Special Card */}
        {(filter === 'all' || filter === 'liked') && (
          <div
            onClick={() => navigateTo('liked')}
            className="group col-span-2 sm:col-span-2 aspect-[2/1] rounded-2xl bg-gradient-to-br from-[#450af5] via-[#8e8ee5] to-[#c4b5fd] p-5 flex flex-col justify-end cursor-pointer shadow-xl hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-white/30 font-black text-6xl select-none">
              ♥
            </div>
            <div className="space-y-1 relative z-10">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                Auto Playlist
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">Liked Songs</h2>
              <p className="text-xs font-semibold text-white/90">
                {likedTrackIds.length} favorite songs
              </p>
            </div>
          </div>
        )}

        {/* Regular Playlists */}
        {playlists.map((playlist) => (
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
            </div>

            <h3 className="text-sm font-bold text-white truncate">{playlist.title}</h3>
            <p className="text-xs text-[#b3b3b3] truncate mt-1">
              Playlist • {playlist.author}
            </p>
          </div>
        ))}
      </div>

      {/* Create Playlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-sm bg-[#181818] border border-white/10 p-5 rounded-3xl space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">Create New Playlist</h3>
            <input
              type="text"
              autoFocus
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
              placeholder="My awesome playlist..."
              className="w-full bg-[#242424] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#1DB954]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#b3b3b3] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs shadow-lg"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
