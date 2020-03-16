import React, { useContext } from "react";
import {
  PlayerContextState,
  PlayerContextDispatcher
} from "../PlayerContextController";
import {
  TracksStateContext,
  TracksContextController
} from "../TracksContextController";
import { sample } from "lodash-es";

export type TrackListContainerProps = {
  children: React.ReactNode;
};
export function TrackListContainer({ children }: TrackListContainerProps) {
  return <>{children}</>;
}

export function useTrackListContainer(filterText: string) {
  const { currentTrackId } = useContext(PlayerContextState);
  const dispatch = useContext(PlayerContextDispatcher);
  const { tracks, loading: tracksLoading } = useContext(TracksStateContext);

  const onTrackClick = React.useCallback(
    (trackId: string) => {
      dispatch({
        type: "PLAYER_PLAY",
        payload: {
          trackId
        }
      });
    },
    [dispatch]
  );

  function onRandomClick() {
    let track = sample(tracks);
    if (track) {
      dispatch({
        type: "PLAYER_PLAY",
        payload: {
          trackId: track.id
        }
      });
    }
  }

  const filteredTracks = React.useMemo(() => {
    if (!filterText) {
      return tracks;
    }

    return tracks.filter(track =>
      track.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
    );
  }, [filterText, tracks]);

  return {
    currentTrackId,
    onTrackClick,
    onRandomClick,
    filteredTracks,
    tracksLoading
  };
}
