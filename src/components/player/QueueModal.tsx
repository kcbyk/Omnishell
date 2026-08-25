'use client';

import React from 'react';
import { X, ListMusic, Play, Trash2, Music2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function QueueModal() {
  const {
    queue,
    queueIndex,
    currentTrack,
    playTrack,
    isQueueModalOpen,
    setIsQueueModalOpen,
  } = usePlayer();

  if (!isQueueModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-[#181818] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-base font-bold text-white">Play Queue</h3>
          </div>
          <button
            onClick={() => setIsQueueModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
          {/* Now Playing section */}
          {currentTrack && (
            <div>
              <div className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
                Now Playing
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#242424] border border-[#1DB954]/40">
                <img
                  src={currentTrack.albumArt}
                  alt={currentTrack.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="overflow-hidden flex-1">
                  <div className="text-sm font-bold text-[#1DB954] truncate">{currentTrack.title}</div>
                  <div className="text-xs text-[#b3b3b3] truncate">{currentTrack.artist}</div>
                </div>
                <div className="flex items-end space-x-0.5 h-3">
                  <span className="w-0.5 h-3 bg-[#1DB954] rounded-full animate-bounce"></span>
                  <span className="w-0.5 h-2 bg-[#1DB954] rounded-full animate-pulse"></span>
                  <span className="w-0.5 h-3.5 bg-[#1DB954] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                </div>
              </div>
            </div>
          )}

          {/* Next from Queue */}
          <div>
            <div className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
              Next Up
            </div>
            <div className="space-y-1">
              {queue.map((track, idx) => {
                if (track.id === currentTrack?.id) return null;

                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#242424] cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={track.albumArt}
                        alt={track.title}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-white group-hover:text-[#1DB954] transition truncate">
                          {track.title}
                        </div>
                        <div className="text-[11px] text-[#b3b3b3] truncate">{track.artist}</div>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-[#b3b3b3] pr-2">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
