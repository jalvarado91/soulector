import React, { useState, useRef, useEffect } from "react";
import { TrackModel } from "../TracksScreen/TracksStore";

type WidgetApiLoadingState = "loading" | "loaded";

export function useSoundCloudWidgetApi() {
  const [loadingState, setLoadingState] = useState<WidgetApiLoadingState>(
    !window.SC ? "loading" : "loaded"
  );

  useEffect(() => {
    if (window.SC) {
      setLoadingState("loaded");
      return;
    }
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.onload = () => setLoadingState("loaded");
    script.onerror = () => console.error("error loading soundcloud widget API");
    // @todo decide if this is sensible.
    // script.async = true
    document.body.appendChild(script);
  }, [loadingState]);

  return loadingState === "loaded";
}

export function SoundCloudPlayer(props: SoundCloudPlayerWidgetProps) {
  const isSCReady = useSoundCloudWidgetApi();
  return isSCReady ? <SoundCloudPlayerWidget {...props} /> : null;
}

export interface SoundCloudPlayerWidgetProps {
  playing?: boolean;
  position?: number;
  volume?: number;
  onReady?: (trackDuration: number) => void;
  onPlayProgressChange?: (position: number) => void;
  onPause?: () => void;
  onPlay?: () => void;
  showNative?: boolean;
  track: TrackModel;
}

export function SoundCloudPlayerWidget(props: SoundCloudPlayerWidgetProps) {
  const widgetIframeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const widgetRef = useRef<any>(null);

  const {
    onPlayProgressChange,
    onReady,
    track,
    volume = 80,
    showNative,
  } = props;

  useEffect(() => {
    widgetRef.current = window.SC.Widget(widgetIframeRef.current);

    return () => {
      widgetRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (widgetRef.current && !ready) {
      widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
        // return track duration when ready
        widgetRef.current.getCurrentSound((currentSound: any) => {
          onReady && onReady(currentSound.full_duration);
          setReady(true);
        });
      });
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.unbind(window.SC.Widget.Events.READY);
        widgetRef.current.unbind(window.SC.Widget.Events.FINISH);
        widgetRef.current.unbind(window.SC.Widget.Events.SEEK);
      }
    };
  }, [ready, onReady, track]);

  // bind PlayProgress callback
  useEffect(() => {
    if (widgetRef.current && ready) {
      widgetRef.current.bind(
        window.SC.Widget.Events.PLAY_PROGRESS,
        (ev: any) => {
          onPlayProgressChange && onPlayProgressChange(ev.currentPosition);
        }
      );
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
      }
    };
  }, [ready, onPlayProgressChange, track]);

  useEffect(() => {
    if (widgetRef.current && ready) {
      widgetRef.current.seekTo(props.position || 0);
    }
  }, [props.position, track, ready]);

  useEffect(() => {
    if (widgetRef.current && ready) {
      widgetRef.current.setVolume(volume);
    }
  }, [volume, track, ready]);

  useEffect(() => {
    if (widgetRef.current && ready) {
      if (props.playing) {
        widgetRef.current.play();
      } else {
        widgetRef.current.pause();
      }
    }
  }, [props.playing, track, ready]);

  return (
    <div style={{ transform: showNative ? "scale(1)" : "scale(0)" }}>
      <iframe
        ref={widgetIframeRef}
        title={track.name}
        width={showNative ? "100%" : 2}
        height={showNative ? "100" : 2}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.key}&color=6065E1&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&show_artwork=false&download=false`}
      />
    </div>
  );
}
