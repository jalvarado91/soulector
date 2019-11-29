import React, { useContext } from "react";
import { PlayerContextState } from "../context/PlayerContext";
import { TracksStateContext } from "../context/TracksContext";
import { Player } from "./Player";

export function PlayerContainer() {
  const { currentTrackId, playing } = useContext(PlayerContextState);
  const { tracks, loading } = useContext(TracksStateContext);

  const currentTrack = tracks.find(tr => tr._id === currentTrackId);

  return (
    <React.Fragment>
      {!loading && tracks.length > 0 && currentTrack && playing && (
        <div
          className="bg-white p-3"
          style={{
            boxShadow:
              "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}
        >
          <div className="max-w-4xl m-auto">
            <Player track={currentTrack} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
