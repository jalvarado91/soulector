import React from "react";
import { cx } from "emotion";
import { formatDate, formatTimeSecs } from "../helpers";
import { IconSpeaker } from "./Icons";
import { TrackModel } from "../TracksScreen/TracksStore";

export type TrackProps = {
  track: TrackModel;
  playing?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export function Track(props: TrackProps) {
  const { track, playing = false, onClick } = props;

  return (
    <button
      onClick={onClick}
      className={cx(
        "flex flex-column items-center justify-between text-left cursor-pointer w-full p-3 rounded-lg border border-transparent",
        "hover:shadow-lg hover:border hover:border-gray-200",
        "focus:outline-none focus:bg-gray-100 focus:border focus:border-gray-200"
      )}
    >
      <div className="flex items-center justify-start text-left">
        <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden relative">
          <img
            className="w-full h-full bg-gray-200"
            src={track.picture_large}
            alt={track.name}
          />
          {playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-600 opacity-75" />
              <div className="relative leading-none p-1 bg-white group-hover:bg-white rounded-full text-indigo-600 hover:bg-gray-200 hover:shadow-sm">
                <IconSpeaker className="relative block group-hover:hidden fill-current w-6 h-6" />
                {/* <PauseIcon className="fill-current w-6 h-6" /> */}
              </div>
            </div>
          )}
        </div>
        <div className="ml-2 md:flex md:flex-col md:flex-col-reverse">
          <div className="text-sm md:text-base text-gray-700">
            <span>{formatDate(track.created_time)}</span>
            <span className="mx-1 inline-block md:hidden">&bull;</span>
            <span className="inline-block md:hidden">
              {formatTimeSecs(track.duration)}
            </span>
          </div>
          <div
            className={cx("font-bold leading-tight", "md:text-lg", {
              "text-indigo-600": playing,
            })}
          >
            {track.name}
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <span>{formatTimeSecs(track.duration)}</span>
      </div>
    </button>
  );
}
