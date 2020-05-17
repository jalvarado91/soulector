import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { EmbedPlayer } from "../../components/EmbedPlayer";
import { SoundCloudPlayer } from "../../components/SoundCloudPlayer";
import { TrackModel, useTracksStore } from "../TracksStore";
import { formatDate, formatTime } from "../../helpers";
import {
  IconFastBackward,
  IconPause,
  IconPlay,
  IconFastForward,
} from "../../components/Icons";
import { usePlayerStore, PlayerStore } from "../PlayerStore";
import { sample } from "lodash-es";
import { cx } from "emotion";
import shallow from "zustand/shallow";

function Player() {
  const playerSelectors = (state: PlayerStore) => ({
    currentTrackId: state.currentTrackId,
    playing: state.playing,
    play: state.play,
    resume: state.resume,
    pause: state.pause,
  });

  const { currentTrackId, playing, play, resume, pause } = usePlayerStore(
    playerSelectors,
    shallow
  );

  const tracks = useTracksStore((state) => state.tracks);
  const fetchTracksState = useTracksStore((state) => state.fetchTracksState);
  const findTrackById = useTracksStore((state) => state.findById);

  const currentTrack = currentTrackId ? findTrackById(currentTrackId) : null;
  const showPlayer =
    fetchTracksState !== "pending" && tracks.length > 0 && currentTrack;

  useEffect(() => {
    if (fetchTracksState === "resolved") {
      const track = sample(tracks);
      track && play(track.id);
    }
  }, [fetchTracksState]);

  return (
    <React.Fragment>
      {showPlayer && currentTrack && (
        <React.Fragment>
          <Helmet>
            <title>{currentTrack.name}</title>
          </Helmet>
          <div
            className="bg-white p-3"
            style={{
              boxShadow:
                "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {currentTrack.source === "mixcloud" && (
              <div className="max-w-4xl m-auto">
                <EmbedPlayer track={currentTrack} />
              </div>
            )}
            {currentTrack.source === "soundcloud" && (
              <PlayerControls
                onPause={pause}
                onResume={resume}
                track={currentTrack}
                playing={playing}
              />
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

type PlayerControlsProps = {
  track: TrackModel;
  playing: boolean;
  onResume: () => void;
  onPause: () => void;
};

function PlayerControls({
  track,
  playing,
  onPause,
  onResume,
}: PlayerControlsProps) {
  const [debug, setDebug] = useState(false);

  const [playProgress, setPlayProgress] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [cuePosition, setCuePosition] = useState<number>(0);
  const [trackDuration, setTrackDuration] = useState(0);

  function onPlayerReady(trackDuration: number) {
    setPlayerReady(true);
    setTrackDuration(trackDuration);
  }

  useEffect(() => {
    setCuePosition(0);
  }, [track]);

  return (
    <React.Fragment>
      {playerReady && (
        <div className="gap-5 grid grid-cols-3 xl:grid-cols-10">
          <div className="xl:col-span-2 flex items-center space-x-3 ">
            <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden relative">
              <img
                className="w-full h-full bg-gray-200"
                src={track.picture_large}
                alt={track.name}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-bold leading-tight">{track.name}</div>
              <div className="text-xs md:text-sm text-gray-700">
                {formatDate(track.created_time)}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="flex flex-col items-center justify-center xl:col-span-6 space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setCuePosition(playProgress - 30 * 1000)}
                className={cx(
                  "bg-transparent rounded-full text-gray-700 p-2",
                  "transition-all duration-200 ease-in-out",
                  "hover:text-gray-900",
                  "focus:outline-none focus:shadow-outline"
                )}
              >
                <IconFastBackward className="fill-current h-6 w-6" />
              </button>
              <button
                onClick={() => (playing ? onPause() : onResume())}
                className={cx(
                  "p-2 rounded-full bg-indigo-600 border shadow-md text-white",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-indigo-700 hover:shadow-lg",
                  "focus:outline-none focus:bg-indigo-700"
                )}
              >
                {playing ? (
                  <IconPause className="fill-current w-6 h-6 inline-block" />
                ) : (
                  <IconPlay className="fill-current w-6 h-6 inline-block" />
                )}
              </button>
              <button
                onClick={() => setCuePosition(playProgress + 30 * 1000)}
                className={cx(
                  "bg-transparent rounded-full text-gray-700 p-2",
                  "transition-all duration-200 ease-in-out",
                  "hover:text-gray-900",
                  "focus:outline-none focus:shadow-outline"
                )}
              >
                <IconFastForward className="fill-current h-6 w-6" />
              </button>
            </div>
            <div className="max-w-3xl w-full">
              <>
                <div className="flex justify-center items-center space-x-2">
                  <div className="text-xs">
                    {formatTime(Math.ceil(playProgress))}
                  </div>
                  <ProgressBar
                    progress={Math.floor(playProgress)}
                    total={trackDuration}
                  />
                  <div className="text-xs">
                    {formatTime(Math.ceil(trackDuration))}
                  </div>
                </div>
              </>
            </div>
          </div>
          {/*  */}
          <div className="xl:col-span-2 flex items-center space-x-2 justify-end">
            <span>Volume</span>
            <button
              className="text-xs py-1 px-2 text-bold bg-gray-500 rounded-lg text-white"
              onClick={() => {
                setDebug((d) => !d);
              }}
            >
              Toggle Debug
            </button>
          </div>
        </div>
      )}
      <SoundCloudPlayer
        key={track.id}
        onReady={onPlayerReady}
        showNative={debug}
        track={track}
        position={cuePosition}
        playing={playing}
        onPlayProgressChange={setPlayProgress}
      />
    </React.Fragment>
  );
}

export default Player;

export interface ProgressBarProps {
  progress: number;
  total: number;
}
function ProgressBar(props: ProgressBarProps) {
  const { progress = 0, total = 0 } = props;

  const percent = Math.ceil((progress / total) * 100);
  const progressW = `${percent}%`;

  return (
    <div className="w-full relative flex flex-col justify-center">
      <div className="absolute left-0 block w-full h-2 rounded-full bg-gray-300" />
      <div
        style={{ width: progressW }}
        className="absolute left-0 block h-2 rounded-full bg-indigo-600"
      />
      {/* <div
        style={{ left: progressW }}
        className="absolute block w-4 h-4 bg-indigo-600 rounded-full right-0"
      /> */}
    </div>
  );
}
