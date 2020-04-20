import React from "react";
import { TrackModel } from "../TracksScreen/TracksStore";
// import { ITrack } from "../types";

type Props = {
  track: TrackModel;
};

export function EmbedPlayer(props: Props) {
  const { track } = props;

  return track.source === "soundcloud" ? (
    <SoundCloudWidgetPlayer track={track} />
  ) : (
    <MixCloudWidgetPlayer track={track} />
  );
}

export function SoundCloudWidgetPlayer(props: Props) {
  const { track } = props;
  const trackKey = track.key;

  return (
    <iframe
      title={track.name}
      width="100%"
      height="100"
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackKey}&color=6065E1&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&show_artwork=false&download=false`}
    />
  );
}

export function MixCloudWidgetPlayer(props: Props) {
  const { track } = props;
  const trackKey = track.key || "";

  const encodedTrackKey = encodeURIComponent(trackKey);

  return (
    <iframe
      key={track.key}
      title={track.name}
      width="100%"
      height="120"
      allow="autoplay"
      src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&disableUnloadWarning=true&disablePushstate=true&autoplay=true&feed=${encodedTrackKey}`}
      frameBorder="0"
    />
  );
}
