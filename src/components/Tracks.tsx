import React, { useContext } from "react";
import { ITrack } from "../types";
import { Track } from "./Track";
import { TracksStateContext } from "../context/TracksContext";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  PlayerContextState,
  PlayerContextDispatcher
} from "../context/PlayerContext";

export function TracksContainer() {
  const { currentTrackId } = useContext(PlayerContextState);
  const dispatch = useContext(PlayerContextDispatcher);
  const { tracks, loading: tracksLoading } = useContext(TracksStateContext);

  const onTrackClick = React.useCallback(
    (trackId: string) => {
      dispatch({
        type: "PLAYER_PLAY",
        payload: {
          trackId
        }
      });
    },
    [dispatch]
  );

  return (
    <React.Fragment>
      {tracksLoading ? (
        "loading from reducer"
      ) : (
        <Tracks
          tracks={tracks}
          currentTrackId={currentTrackId}
          onTrackClick={onTrackClick}
        />
      )}
    </React.Fragment>
  );
}

type TracksProps = {
  tracks: ITrack[];
  currentTrackId?: string;
  onTrackClick: (trackId: string) => void;
};

export function Tracks({ tracks, onTrackClick, currentTrackId }: TracksProps) {
  return (
    <div className="flex h-full justify-center">
      {tracks.length > 0 && (
        <div className="flex-auto">
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="px-4 md:px-4"
                itemCount={tracks.length}
                itemSize={90}
                width={width}
                height={height}
              >
                {({ index, style }) => {
                  const track = tracks[index];
                  return (
                    <div className="w-full" style={style}>
                      <div className="max-w-4xl m-auto">
                        <Track
                          onClick={() => onTrackClick(track._id)}
                          track={track}
                          playing={track._id === currentTrackId}
                        />
                      </div>
                    </div>
                  );
                }}
              </List>
            )}
          </AutoSizer>
        </div>
      )}
    </div>
  );
}
