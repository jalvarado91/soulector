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
  IconBackThirty,
  IconSkipThirty,
  IconSoundcloud,
  IconSpeaker,
} from "../../components/Icons";
import { usePlayerStore, PlayerStore } from "../PlayerStore";
import { sample } from "lodash-es";
import { cx } from "emotion";
import shallow from "zustand/shallow";
import { ProgressBar } from "../../components/ProgressBar";

function Player() {
  const playerSelectors = (state: PlayerStore) => ({
    currentTrackId: state.currentTrackId,
    playing: state.playing,
    play: state.play,
    resume: state.resume,
    pause: state.pause,
    volume: state.volume,
    setVolume: state.setVolume,
    muted: state.muted,
    mute: state.mute,
    unmute: state.unmute,
  });

  const {
    currentTrackId,
    playing,
    play,
    resume,
    pause,
    volume,
    setVolume,
    mute,
    muted,
    unmute,
  } = usePlayerStore(playerSelectors, shallow);

  const tracks = useTracksStore((state) => state.tracks);
  const fetchTracksState = useTracksStore((state) => state.fetchTracksState);
  const findTrackById = useTracksStore((state) => state.findById);

  const currentTrack = currentTrackId ? findTrackById(currentTrackId) : null;
  const showPlayer =
    fetchTracksState !== "pending" && tracks.length > 0 && currentTrack;

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
                volume={volume}
                onVolumeChange={setVolume}
                onPause={pause}
                onResume={resume}
                track={currentTrack}
                playing={playing}
                muted={muted}
                onMute={mute}
                onUnmute={unmute}
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
  volume: number;
  onVolumeChange: (vol: number) => void;
  onResume: () => void;
  onPause: () => void;
  muted: boolean;
  onMute: () => void;
  onUnmute: () => void;
};

function PlayerControls({
  track,
  playing,
  onPause,
  onResume,
  volume,
  onVolumeChange,
  muted,
  onMute,
  onUnmute,
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
            <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden relative">
              <img
                className="w-full h-full bg-gray-200"
                src={track.picture_large}
                alt={track.name}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-md font-bold leading-tight">
                {track.name}
              </div>
              <div className="text-gray-700 text-md">
                {formatDate(track.created_time)}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="flex flex-col items-center justify-center xl:col-span-6 space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <button
                title="Rewind 30 seconds"
                onClick={() => setCuePosition(playProgress - 30 * 1000)}
                className={cx(
                  "bg-transparent rounded-full text-gray-700 p-2",
                  "transition-all duration-200 ease-in-out",
                  "hover:text-gray-900",
                  "focus:outline-none focus:bg-gray-200"
                )}
              >
                <IconBackThirty className="fill-current h-8 w-8" />
              </button>
              <button
                onClick={() => (playing ? onPause() : onResume())}
                className={cx(
                  "p-2 rounded-full bg-indigo-600 border shadow-md text-white leading-none",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-indigo-700 hover:shadow-lg",
                  "focus:outline-none focus:bg-indigo-700"
                )}
              >
                {playing ? (
                  <IconPause className="fill-current w-8 h-8 inline-block" />
                ) : (
                  <IconPlay className="fill-current w-8 h-8 inline-block" />
                )}
              </button>
              <button
                title="Forward 30 seconds"
                onClick={() => setCuePosition(playProgress + 30 * 1000)}
                className={cx(
                  "bg-transparent rounded-full text-gray-700 p-2",
                  "transition-all duration-200 ease-in-out",
                  "hover:text-gray-900",
                  "focus:outline-none focus:bg-gray-200"
                )}
              >
                <IconSkipThirty className="fill-current h-8 w-8" />
              </button>
            </div>
            <div className="max-w-3xl w-full">
              <>
                <div className="flex justify-center items-center space-x-2">
                  <div className="text-xs">
                    {formatTime(Math.ceil(playProgress))}
                  </div>
                  <div className="w-full px-2 relative flex flex-col justify-center">
                    <ProgressBar
                      onChange={(progressTarget) =>
                        setCuePosition(progressTarget)
                      }
                      onSeek={(progressTarget) =>
                        setCuePosition(progressTarget)
                      }
                      progress={Math.floor(playProgress)}
                      duration={trackDuration}
                    />
                  </div>
                  <div className="text-xs">
                    {formatTime(Math.ceil(trackDuration))}
                  </div>
                </div>
              </>
            </div>
          </div>
          {/*  */}
          <div className="xl:col-span-2 flex items-center space-x-2 justify-end">
            <div className="flex space-x-2 items-center">
              <a
                className={cx(
                  "inline-block p-1",
                  "transition-all duration-200 ease-in-out",
                  "hover:text-orange-600"
                )}
                target="_blank"
                href={track.url}
              >
                <IconSoundcloud className="fill-current w-6 h-6" />
              </a>
              <div className="flex space-x-1 items-center">
                <button
                  onClick={() => {
                    muted ? onUnmute() : onMute();
                  }}
                >
                  <IconSpeaker className="fill-current w-6 h-6" />
                </button>
                <div className="w-40 pr-4">
                  <ProgressBar
                    duration={100}
                    progress={volume}
                    onChange={(vol) => onVolumeChange(Math.floor(vol))}
                    onSeek={(vol) => onVolumeChange(Math.floor(vol))}
                  />
                </div>
              </div>
            </div>
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
        volume={volume}
        onPlayProgressChange={setPlayProgress}
      />
    </React.Fragment>
  );
}

export default Player;
