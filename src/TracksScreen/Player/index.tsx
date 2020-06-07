import React, { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet";
import { EmbedPlayer } from "../../components/EmbedPlayer";
import { SoundCloudPlayer } from "../../components/SoundCloudPlayer";
import { TrackModel, useTracksStore } from "../TracksStore";
import { formatDate, formatTime } from "../../helpers";
import {
  IconPause,
  IconPlay,
  IconBackThirty,
  IconSkipThirty,
  IconSoundcloud,
  IconSpeaker,
} from "../../components/Icons";
import {
  usePlayerStore,
  PlayerStore,
  playerStoreSelectors,
} from "../PlayerStore";
import { Slider } from "@reach/slider";
import { cx } from "emotion";
import shallow from "zustand/shallow";
import { useMedia } from "../../infra/useMedia";

function Player() {
  const playerSelectors = (state: PlayerStore) => ({
    currentTrackId: state.currentTrackId,
    playing: state.playing,
    play: state.play,
    resume: state.resume,
    pause: state.pause,
    volume: state.volume,
    setVolume: state.setVolume,
    muted: playerStoreSelectors.muted(state),
    mute: state.mute,
    unmute: state.unmute,
  });

  const {
    currentTrackId,
    playing,
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
            className="bg-white px-3 pt-3 pb-1"
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

  const isMed = useMedia("(min-width: 768px)");

  const lastSeekPos = useRef(0);
  const [playProgress, setPlayProgress] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [cuePosition, setCuePosition] = useState<number>(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  function onPlayerReady(trackDuration: number) {
    setPlayerReady(true);
    setTrackDuration(trackDuration);
    setPlayerProgress(0);
  }

  // TODO: Remove when mobile player done
  const useEmbed = useMemo(() => {
    return debug || !isMed;
  }, [isMed, debug]);

  function onAudioProgress(progress: number) {
    if (!seeking) {
      setPlayerProgress(progress);
      setPlayProgress(progress);
    }
  }

  useEffect(() => {
    setPlayerProgress(0);
    setCuePosition(0);
  }, [track]);

  return (
    <React.Fragment>
      {playerReady && (
        <div
          className={cx("gap-5 grid grid-cols-3 xl:grid-cols-10", {
            "hidden": useEmbed,
          })}
        >
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
          {/* Player */}
          <div className="flex flex-col items-center justify-center xl:col-span-6 space-y-1">
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
                <div className="flex justify-center items-center">
                  <div className="text-xs w-10 text-right">
                    {formatTime(Math.ceil(playerProgress))}
                  </div>
                  <div className="flex flex-1 flex-col justify-center max-w-xl mx-3 relative w-full">
                    <Slider
                      max={trackDuration}
                      value={playerProgress}
                      onMouseDown={() => setSeeking(true)}
                      onChange={(newVal) => {
                        setPlayerProgress(newVal);
                        lastSeekPos.current = newVal;
                      }}
                      onMouseUp={() => {
                        setSeeking(false);
                        setCuePosition(lastSeekPos.current);
                      }}
                    />
                  </div>
                  <div className="text-xs w-10">
                    {formatTime(Math.ceil(trackDuration))}
                  </div>
                </div>
              </>
            </div>
          </div>
          {/* Volume */}
          <div className="xl:col-span-2 flex items-center space-x-2 justify-end">
            <div className="flex space-x-1 items-center">
              <a
                className={cx(
                  "inline-block p-2 rounded-full",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-gray-200 "
                )}
                title="Open in SoundCloud"
                target="_blank"
                href={track.url}
              >
                <IconSoundcloud className="fill-current w-5 h-5" />
              </a>
              <div className="flex space-x-1 items-center">
                <button
                  className={cx(
                    "inline-block p-1 rounded-full",
                    "transition-all duration-200 ease-in-out",
                    "hover:bg-gray-200",
                    "focus:outline-none"
                  )}
                  title={muted ? "Unmute" : "Mute"}
                  onClick={() => {
                    muted ? onUnmute() : onMute();
                  }}
                >
                  <IconSpeaker className="fill-current w-5 h-5" />
                </button>
                <div className="w-40 pr-4">
                  <Slider
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(val) => onVolumeChange(val)}
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
        showNative={useEmbed}
        track={track}
        position={cuePosition}
        playing={playing}
        volume={volume}
        onPlayProgressChange={onAudioProgress}
      />
    </React.Fragment>
  );
}

export default Player;
