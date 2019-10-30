import React, { useContext } from "react";
import { ITrack } from "../types";
import { Track } from "./Track";
import { TracksStateContext } from "../context/TracksContext";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export function Tracks() {
  const { tracks, loading } = useContext(TracksStateContext);

  return (
    <React.Fragment>
      {loading ? "loading from reducer" : <TracksView tracks={tracks} />}
    </React.Fragment>
  );
}

export type TracksProps = {
  tracks: ITrack[];
};

export function TracksView(props: TracksProps) {
  const playingTrack = props.tracks.length > 0 && props.tracks[4]._id;

  return (
    <div className="flex h-full justify-center">
      {props.tracks.length > 0 && (
        <div className="flex-auto">
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="px-4 md:px-4"
                itemCount={props.tracks.length}
                itemSize={90}
                width={width}
                height={height}
              >
                {({ index, style }) => {
                  const track = props.tracks[index];
                  return (
                    <div className="w-full" style={style}>
                      <div className="max-w-4xl m-auto">
                        <Track
                          track={track}
                          playing={track._id === playingTrack}
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
