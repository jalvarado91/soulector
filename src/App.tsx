import React, { useState, useCallback } from "react";
import "./index.css";
import TracksScreen from "./TracksScreen";
import { HotKeys, KeyMap } from "react-hotkeys";
import {
  PlayerStore,
  playerStoreSelectors,
  usePlayerStore,
} from "./TracksScreen/PlayerStore";
import shallow from "zustand/shallow";

const keyMap: KeyMap = {
  VOLUME_UP: "shift+up",
  VOLUME_DOWN: "shift+down",
  TOGGLE_MUTE: "m",
  // TOGGLE_PLAY: "space",
};

function useShortcutHandlers() {
  const playerSelectors = (state: PlayerStore) => ({
    currentTrackId: state.currentTrackId,
    playing: state.playing,
    play: state.play,
    resume: state.resume,
    pause: state.pause,
    volume: state.volume,
    setVolume: state.setVolume,
    volumeUp: state.volumeUp,
    volumeDown: state.volumeDown,
    toggleMute: state.toggleMute,
    muted: playerStoreSelectors.muted(state),
    mute: state.mute,
    unmute: state.unmute,
  });

  const {
    currentTrackId,
    playing,
    resume,
    pause,
    volume,
    setVolume,
    volumeUp,
    volumeDown,
    mute,
    muted,
    unmute,
    toggleMute,
  } = usePlayerStore(playerSelectors, shallow);

  const togglePlay = useCallback(() => {
    if (playing) {
      pause();
    } else {
      resume();
    }
  }, [playing, pause, resume]);

  const handlers = {
    VOLUME_UP: volumeUp,
    VOLUME_DOWN: volumeDown,
    TOGGLE_MUTE: toggleMute,
    TOGGLE_PLAY: togglePlay,
  };

  return handlers;
}

export default function App() {
  const [searchText, setSearchText] = useState("");

  const handlers = useShortcutHandlers();

  return (
    <HotKeys
      className="h-full focus:outline-none"
      keyMap={keyMap}
      handlers={handlers}
    >
      <TracksScreen
        onSearchChange={setSearchText}
        onSearchClose={() => setSearchText("")}
        searchText={searchText}
      />
    </HotKeys>
  );
}
