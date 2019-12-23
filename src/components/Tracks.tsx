import React, { useContext, useEffect, useRef } from "react";
import { ITrack } from "../types";
import { Track } from "./Track";
import { TracksStateContext } from "../context/TracksContext";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  PlayerContextState,
  PlayerContextDispatcher
} from "../context/PlayerContext";
import { cx } from "emotion";
import { ShuffleIcon } from "./Icons";
import { sample } from "lodash-es";

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

  function onRandomClick() {
    let track = sample(tracks);
    if (track) {
      dispatch({
        type: "PLAYER_PLAY",
        payload: {
          trackId: track._id
        }
      });
    }
  }

  return (
    <React.Fragment>
      {tracksLoading ? (
        "loading from reducer"
      ) : (
        <Tracks
          tracks={tracks}
          currentTrackId={currentTrackId}
          onTrackClick={onTrackClick}
          onRandomClick={onRandomClick}
          focusTrackId={currentTrackId}
        />
      )}
    </React.Fragment>
  );
}

type TracksProps = {
  tracks: ITrack[];
  currentTrackId?: string;
  onTrackClick: (trackId: string) => void;
  onRandomClick: () => void;
  focusTrackId?: string;
};

export function Tracks({
  tracks,
  onTrackClick,
  currentTrackId,
  onRandomClick,
  focusTrackId
}: TracksProps) {
  const listRef = useRef<List>(null);

  useEffect(() => {
    if (listRef.current) {
      const trackIdx = tracks.findIndex(t => t._id === focusTrackId);
      if (trackIdx) {
        listRef.current.scrollToItem(trackIdx, "center");
      }
    }
  }, [focusTrackId, tracks]);

  return (
    <div className="flex h-full justify-center border-2 border-red-500 relative">
      <div className="absolute border-blue-500 right-0 bottom-0 mb-5 mr-5 z-10">
        <button
          onClick={() => onRandomClick()}
          className={cx(
            "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold",
            "py-3 px-12",
            "rounded-full",
            "shadow-md",
            "flex items-center"
          )}
        >
          <ShuffleIcon className="fill-current w-5 h-5" />
          <span className="ml-2">Play Random</span>
        </button>
      </div>
      {tracks.length > 0 && (
        <div className="flex-auto">
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
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
