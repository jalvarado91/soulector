import React, { useContext } from "react";
import { ITrack } from "../types";
import { Track } from "./Track";
import { TracksStateContext } from "../context/TracksContext";

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
    <div className="w-full max-w-4xl mx-auto px-3 md:px-4 py-8">
      {props.tracks.map(track => (
        <div key={track._id} className="">
          <Track track={track} playing={track._id === playingTrack} />
        </div>
      ))}
    </div>
  );
}
