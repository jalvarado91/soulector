import React, { useContext } from "react";
import { PlayerContextState } from "../PlayerContextController";
import { TracksStateContext } from "../TracksContextController";

export type PlayerContainerProps = {
  children?: React.ReactNode;
};
export function PlayerContainer({ children }: PlayerContainerProps) {
  return <>{children}</>;
}

export function usePlayerContainer() {
  const { currentTrackId, playing } = useContext(PlayerContextState);
  const { tracks, tracksById, loading } = useContext(TracksStateContext);

  const currentTrack = currentTrackId ? tracksById[currentTrackId] : null;
  const showPlayer = !loading && tracks.length > 0 && currentTrack && playing;

  return {
    currentTrack,
    showPlayer
  };
}
