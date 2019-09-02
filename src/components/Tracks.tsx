import React, { useContext } from "react";
import { ITrack } from "../types";
import { Track } from "./Track";
import { TracksStateContext } from "../context/TracksContext";
import { FixedSizeList as List } from "react-window";

export function Tracks() {
  const { tracks } = useContext(TracksStateContext);

  return (
    <div>
      <TracksView tracks={tracks} />
    </div>
  );
}

export type TracksProps = {
  tracks: ITrack[];
};

export function TracksView(props: TracksProps) {
  const playingTrack = props.tracks.length > 0 && props.tracks[4]._id;

  return (
    <div className="w-full flex justify-center">
      {props.tracks.length > 0 ? (
        <List
          className="px-4 md:px-4"
          height={window.innerHeight}
          itemCount={props.tracks.length}
          itemSize={90}
          width={"100%"}
        >
          {({ index, style }) => {
            const track = props.tracks[index];
            return (
              <div className="w-full" style={style}>
                <div className="max-w-4xl m-auto">
                  <Track track={track} playing={track._id === playingTrack} />
                </div>
              </div>
            );
          }}
        </List>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
