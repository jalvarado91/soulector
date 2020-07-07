import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
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
import Marquee from "react-double-marquee";

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
    progress: state.progress,
    setProgress: state.setProgress,
    cuePosition: state.cuePosition,
    setCuePosition: state.setCuePosition,
    forward: state.forward,
    rewind: state.rewind,
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
    progress,
    setProgress,
    cuePosition,
    setCuePosition,
    forward,
    rewind,
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
            className="bg-white"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.09) 0px -4px 11px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
            }}
          >
            {currentTrack.source === "mixcloud" && (
              <div className="max-w-4xl m-auto px-3 pt-3 pb-3">
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
                progress={progress}
                onProgressChange={setProgress}
                cuePosition={cuePosition}
                onCuePositionChange={setCuePosition}
                onForward={forward}
                onRewind={rewind}
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
  progress: number;
  onProgressChange: (progress: number) => void;
  cuePosition: number;
  onCuePositionChange: (cuePos: number) => void;
  onForward: (secs: number) => void;
  onRewind: (secs: number) => void;
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
  progress,
  onProgressChange,
  cuePosition,
  onCuePositionChange,
  onForward,
  onRewind,
}: PlayerControlsProps) {
  const [debug] = useState(false);

  const isAtLeastMidScreenSize = useMedia("(min-width: 768px)");
  const isMoreThanMidScreenSize = !isAtLeastMidScreenSize;

  const lastSeekPos = useRef(0);

  // TODO: Set back to false
  const [playerReady, setPlayerReady] = useState(true);

  const [trackDuration, setTrackDuration] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [seeking, setSeeking] = useState(false);

  function onPlayerReady(trackDuration: number) {
    setPlayerReady(true);
    setTrackDuration(trackDuration);
    setPlayerProgress(0);
  }

  // TODO: Remove when mobile player done
  const useEmbed = useMemo(() => {
    return debug;
  }, [debug]);

  function onAudioProgress(progress: number) {
    if (!seeking) {
      setPlayerProgress(progress);
      onProgressChange(progress);
    }
  }

  useEffect(() => {
    setPlayerProgress(0);
    onCuePositionChange(0);
  }, [track]);

  return (
    <React.Fragment>
      {playerReady && (
        <>
          <div
            className={cx(
              "gap-5 grid grid-cols-3 xl:grid-cols-10 px-3 pt-3 pb-3",
              {
                hidden: isMoreThanMidScreenSize,
              }
            )}
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
                <div className="font-semibold leading-tight">{track.name}</div>
                <div className="text-gray-700">
                  {formatDate(track.created_time)}
                </div>
              </div>
            </div>
            {/* Player */}
            <div className="flex flex-col items-center justify-center xl:col-span-6 space-y-1">
              <div className="flex items-center justify-center space-x-4">
                <button
                  title="Rewind 30 seconds"
                  onClick={() => onRewind(30)}
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
                  onClick={() => onForward(30)}
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
                          onCuePositionChange(lastSeekPos.current);
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
          <div className={cx(isAtLeastMidScreenSize && "hidden")}>
            <MobilePlayer
              playing={playing}
              track={track}
              onForward={onForward}
              onPause={onPause}
              onResume={onResume}
              trackDuration={trackDuration}
              playerProgress={playerProgress}
            />
          </div>
        </>
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

type MarqeeContainerProps = {
  children: string;
};
function MarqeeContainer({ children }: MarqeeContainerProps) {
  const debug = false;
  const [speed, setSpeed] = useState(0.03);
  const mRef = useRef<HTMLDivElement | null>(null);

  const textLen = children.length;
  const approxTextSize = useMemo(() => textLen * 10, [textLen]); // Chars * em

  const w = useMemo(() => {
    if (mRef.current && !isMeasured) {
      return mRef.current.getBoundingClientRect().width;
    }
    return -1;
  }, [mRef.current && mRef.current.getBoundingClientRect().width]);

  const isMeasured = w > 0;
  const shouldShowMarquee = approxTextSize > w;

  return (
    <div ref={mRef} className={cx([debug && "bg-blue-300"])}>
      {!isMeasured ? (
        <span className="text-white">.</span>
      ) : (
        <div
          className={`relative whitespace-no-wrap ${
            !debug && "overflow-hidden"
          }`}
          style={{
            width: w,
          }}
          onMouseEnter={() => setSpeed(0)}
          onMouseLeave={() => setSpeed(0.03)}
        >
          {shouldShowMarquee ? (
            <>
              <Marquee speed={speed} childMargin={24} direction="left">
                {children}
              </Marquee>
              <div
                className="absolute block h-full right-0 top-0 w-full z-10"
                style={{
                  boxShadow: "-24px 0px 15px -15px white inset",
                }}
              ></div>
            </>
          ) : (
            <span>{children}</span>
          )}
        </div>
      )}
    </div>
  );
}

type MobilePlayerProps = {
  track: TrackModel;
  playing: boolean;
  playerProgress: number;
  trackDuration: number;
  onPause: () => void;
  onResume: () => void;
  onForward: (secs: number) => void;
};

function MobilePlayer({
  track,
  playing,
  onForward,
  playerProgress,
  trackDuration,
  onPause,
  onResume,
}: MobilePlayerProps) {
  const progressPercent =
    trackDuration > 0 ? (playerProgress / trackDuration) * 100 : 0;

  return (
    <div className="relative">
      <div className="absolute w-full">
        <div
          className="absolute h-1 w-1/2 bg-indigo-600 top-0 rounded-r"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <div className="px-3 py-2 flex space-x-2 justify-between">
        <div className="flex space-x-2 items-center w-full">
          <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden relative">
            <img
              className="w-full h-full bg-gray-200"
              src={track.picture_large}
              alt={track.name}
            />
          </div>
          <div className="flex flex-col justify-center w-full">
            <div className="font-semibold leading-tight">
              <MarqeeContainer>{track.name}</MarqeeContainer>
            </div>
            <div className="text-gray-700 text-sm">
              {formatDate(track.created_time)}
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 space-x-2 items-center">
          <button
            title="Forward 30 seconds"
            onClick={() => onForward(30)}
            className={cx(
              "flex-shrink-0 inline-block bg-transparent rounded-full text-gray-900 p-1",
              "transition-all duration-200 ease-in-out",
              "hover:text-gray-900",
              "focus:outline-none focus:shadow-outline"
            )}
          >
            <IconSkipThirty className="fill-current h-8 w-8" />
          </button>
          <button
            onClick={() => (playing ? onPause() : onResume())}
            className={cx(
              "flex-shrink-0 inline-block bg-transparent rounded-full text-gray-900 p-1",
              "transition-all duration-200 ease-in-out",
              "hover:text-gray-900",
              "focus:outline-none focus:shadow-outline"
            )}
          >
            {playing ? (
              <IconPause className="fill-current w-8 h-8 inline-block" />
            ) : (
              <IconPlay className="fill-current w-8 h-8 inline-block" />
            )}
          </button>
        </div>
      </div>
      {/* <div className="hidden">Big Player</div> */}
    </div>
  );
}
