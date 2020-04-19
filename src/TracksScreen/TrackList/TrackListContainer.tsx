import React, { useContext, useEffect, useMemo } from "react";
import {
  PlayerContextState,
  PlayerContextDispatcher
} from "../PlayerContextController";
import {
  TracksStateContext,
  TracksContextController
} from "../TracksContextController";
import { sample } from "lodash-es";
import { useTracksStore } from "../TracksStore";
import shallow from "zustand/shallow";
import { flatten } from "../../infra/collection-utils";
import { match } from "../../helpers";

export type TrackListContainerProps = {
  children: React.ReactNode;
};
export function TrackListContainer({ children }: TrackListContainerProps) {
  return <>{children}</>;
}

export function useTrackListContainer(filterText: string) {
  const { currentTrackId } = useContext(PlayerContextState);
  const dispatch = useContext(PlayerContextDispatcher);

  const tracks = useTracksStore(state => state.tracks);
  const fetchTracks = useTracksStore(state => state.fetchTracks);
  const [fetchTracksState, fetchTracksErr] = useTracksStore(
    state => [state.fetchTracksState, state.rejectionReason],
    shallow
  );

  const activate = useMemo(() => fetchTracksState, [fetchTracksState]);

  useEffect(() => {
    fetchTracks();
  }, []);

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
      return flatten(tracks);
    }

    // return tracks.filter(track =>
    //   track.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
    // );
    return flatten(tracks);
  }, [filterText, tracks]);

  return {
    currentTrackId,
    onTrackClick,
    onRandomClick,
    filteredTracks,
    activate
  };
}
