import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect
} from "react";
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
import { ShuffleIcon, Soulector } from "./Icons";
import { sample } from "lodash-es";
import { min } from "date-fns/esm";

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
        <TracksLoading />
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

function TracksLoading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-loop">
      <Soulector className="w-10 h-10" />
      <div className="font-semibold">Loading Tracks</div>
    </div>
  );
}

type BeforeListProps = {
  numTracks: number;
};
function BeforeList({ numTracks }: BeforeListProps) {
  return (
    <div className="px-4 flex item-center mt-4 mb-2">
      <div className="font-semibold mr-auto text-indigo-900">All Episodes</div>
      <div className="font-semibold text-gray-600">{numTracks} Total</div>
    </div>
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

  const beforeListRef = useRef<HTMLDivElement | null>(null);
  const [beforeListHight, setBeforeListHeight] = useState(-1);
  useLayoutEffect(() => {
    if (beforeListRef.current) {
      const domHeight = beforeListRef.current.getBoundingClientRect().height;
      setBeforeListHeight(domHeight);
    }
  }, [beforeListHight]);

  useEffect(() => {
    if (listRef.current) {
      const trackIdx = tracks.findIndex(t => t._id === focusTrackId);
      if (trackIdx) {
        listRef.current.scrollToItem(trackIdx, "center");
      }
    }
  }, [focusTrackId, tracks]);

  // Render an invisible version of the content before element
  // in order to measure it's height and render the right virtualized list
  return beforeListHight < 0 ? (
    <div className="opacity-0 border" ref={beforeListRef}>
      <BeforeList numTracks={tracks.length} />
    </div>
  ) : (
    <div className="flex h-full justify-center border-2 relative">
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
                key={beforeListHight}
              >
                {({ index, style }) => {
                  const track = tracks[index];
                  const top = style.top as string;
                  const fHeight =
                    parseFloat(style.height as string) + beforeListHight;
                  return (
                    <div
                      className="w-full"
                      style={{
                        ...style,
                        ...(index !== 0 && {
                          top: `${parseFloat(top) + beforeListHight}px`
                        }),
                        ...(index === 0 && { height: fHeight })
                      }}
                    >
                      <div className="max-w-4xl m-auto">
                        {index === 0 && (
                          <div>
                            <BeforeList numTracks={tracks.length} />
                          </div>
                        )}
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
