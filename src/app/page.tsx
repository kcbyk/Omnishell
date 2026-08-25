'use client';

import React from 'react';
import { PlayerProvider, usePlayer } from '../context/PlayerContext';
import DesktopSidebar from '../components/layout/DesktopSidebar';
import TopNav from '../components/layout/TopNav';
import BottomPlayer from '../components/player/BottomPlayer';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import MobileMiniPlayer from '../components/player/MobileMiniPlayer';
import MobileFullScreenPlayer from '../components/player/MobileFullScreenPlayer';
import LyricsView from '../components/player/LyricsView';
import QueueModal from '../components/player/QueueModal';
import HomeView from '../components/views/HomeView';
import SearchView from '../components/views/SearchView';
import LibraryView from '../components/views/LibraryView';
import PlaylistView from '../components/views/PlaylistView';

function SpotifyApp() {
  const { activeView } = usePlayer();

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-black text-white font-sans overflow-hidden select-none">
      {/* Main App Workspace (Sidebar + Content View) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Desktop Sidebar */}
        <DesktopSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-[#121212] md:rounded-xl md:my-2 md:mr-2 overflow-hidden relative shadow-2xl">
          {/* Top Sticky Header */}
          <TopNav />

          {/* Dynamic Views */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {activeView === 'home' && <HomeView />}
            {activeView === 'search' && <SearchView />}
            {activeView === 'library' && <LibraryView />}
            {activeView === 'playlist' && <PlaylistView />}
            {activeView === 'liked' && <PlaylistView isLikedSongsView={true} />}
          </div>
        </main>
      </div>

      {/* Desktop Persistent Bottom Player */}
      <BottomPlayer />

      {/* Mobile Floating Mini Player */}
      <MobileMiniPlayer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Fullscreen Player Modal */}
      <MobileFullScreenPlayer />

      {/* Synchronized Karaoke Lyrics View */}
      <LyricsView />

      {/* Queue Modal */}
      <QueueModal />
    </div>
  );
}

export default function Home() {
  return (
    <PlayerProvider>
      <SpotifyApp />
    </PlayerProvider>
  );
}
