import React, { useRef, useState, useLayoutEffect } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Track } from "../../components/Track";
import { ShuffleButton } from "../../components/ShuffleButton";
import useFocusReactWindowItem from "./useFocusReactWindowItem";
import { TrackModel } from "../TracksStore";

type BeforeListProps = {
  numTracks: number;
  filterText?: string;
};
function BeforeList({ numTracks, filterText }: BeforeListProps) {
  return (
    <div className="px-4 flex item-center mt-4 mb-2">
      <div className="font-semibold mr-auto text-indigo-900">
        {filterText ? `Episodes matching "${filterText}"` : "All Episodes"}
      </div>
      <div className="font-semibold text-gray-600">{numTracks} Total</div>
    </div>
  );
}

type TracksProps = {
  tracks: TrackModel[];
  currentTrackId?: string;
  onTrackClick: (trackId: string) => void;
  onRandomClick: () => void;
  focusTrackId?: string;
  filterText?: string;
};

export function Tracks({
  tracks,
  onTrackClick,
  currentTrackId,
  onRandomClick,
  focusTrackId,
  filterText,
}: TracksProps) {
  const listRef = useRef<List>(null);

  const beforeListRef = useRef<HTMLDivElement | null>(null);
  const [beforeListHight, setBeforeListHeight] = useState(-1);
  const isPreContentMeasured = beforeListHight > 0;
  const currentTrackIndex = tracks.findIndex((t) => t.id === focusTrackId);

  useLayoutEffect(() => {
    if (beforeListRef.current) {
      const domHeight = beforeListRef.current.getBoundingClientRect().height;
      setBeforeListHeight(domHeight);
    }
  }, [beforeListHight]);

  useFocusReactWindowItem(listRef, currentTrackIndex);

  // Render an invisible version of the BeforeList element
  // in order to measure its height and render the right virtualized list
  return !isPreContentMeasured ? (
    <div className="opacity-0 border" ref={beforeListRef}>
      <BeforeList numTracks={tracks.length} />
    </div>
  ) : (
    <div className="flex h-full justify-center relative">
      {!filterText && (
        <div className="absolute border-blue-500 right-0 bottom-0 mb-5 mr-5 z-10">
          <ShuffleButton onClick={onRandomClick} />
        </div>
      )}
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
                          top: `${parseFloat(top) + beforeListHight}px`,
                        }),
                        ...(index === 0 && { height: fHeight }),
                      }}
                    >
                      <div className="max-w-4xl m-auto">
                        {index === 0 && (
                          <div>
                            <BeforeList
                              filterText={filterText}
                              numTracks={tracks.length}
                            />
                          </div>
                        )}
                        <Track
                          onClick={() => onTrackClick(track.id)}
                          track={track}
                          playing={track.id === currentTrackId}
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
