import React, { useEffect, useReducer } from "react";
import { ITrack } from "../types";

export type TracksContextControllerProps = {
  children: React.ReactNode;
};

type ACTION_TRACKS_LOAD = {
  type: "TRACKS_LOAD";
};

type ACTION_TRACKS_LOAD_SUCCESS = {
  type: "TRACKS_LOAD_SUCCESS";
  payload: {
    tracks: ITrack[];
  };
};

type ACTION_TRACKS_LOAD_FAILURE = {
  type: "TRACKS_LOAD_FAILURE";
  payload: {
    error: string;
  };
};

type TracksContextAction =
  | ACTION_TRACKS_LOAD
  | ACTION_TRACKS_LOAD_SUCCESS
  | ACTION_TRACKS_LOAD_FAILURE;

type TracksContextState = {
  tracks: ITrack[];
  loading: boolean;
  tracksFetchKey: number;
};

const TracksStateContext = React.createContext<TracksContextState>(
  (null as unknown) as TracksContextState
);
TracksStateContext.displayName = "TracksStateContext";

type TracksContextDispatcher = (action: TracksContextAction) => void;
const TracksDispatcherContext = React.createContext<TracksContextDispatcher>(
  (null as unknown) as TracksContextDispatcher
);

function reduceTrackState(
  state: TracksContextState,
  action: TracksContextAction
) {
  let { tracks, loading, tracksFetchKey } = state;

  switch (action.type) {
    case "TRACKS_LOAD":
      loading = true;
      tracksFetchKey = tracksFetchKey + 1;
      break;
    case "TRACKS_LOAD_SUCCESS":
      loading = false;
      tracks = action.payload.tracks;
      break;
    case "TRACKS_LOAD_FAILURE":
      loading = false;
      console.log((action as ACTION_TRACKS_LOAD_FAILURE).payload.error);
      break;

    default:
      return state;
  }

  return {
    ...state,
    tracks,
    loading,
    tracksFetchKey
  };
}

function TracksContextController(props: TracksContextControllerProps) {
  const { children } = props;

  const reducer = (
    state: TracksContextState,
    action: TracksContextAction
  ): TracksContextState => {
    switch (action.type) {
      case "TRACKS_LOAD":
      case "TRACKS_LOAD_SUCCESS":
      case "TRACKS_LOAD_FAILURE":
        state = reduceTrackState(state, action);
        return state;
      default:
        throw new Error(`Unrecognized action "${{ action }}"`);
    }
  };

  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    tracks: [],
    loading: true,
    tracksFetchKey: 0
  });

  useEffect(() => {
    async function fetchTracks() {
      try {
        let res = await fetch("/getEpisodes");
        let json = (await res.json()) as { tracks: ITrack[] };

        dispatch({
          type: "TRACKS_LOAD_SUCCESS",
          payload: {
            tracks: json.tracks
          }
        });
      } catch (err) {
        dispatch({
          type: "TRACKS_LOAD_FAILURE",
          payload: {
            error: err
          }
        });
      }
    }

    fetchTracks();
  }, [state.tracksFetchKey]);

  return (
    <TracksStateContext.Provider value={state}>
      <TracksDispatcherContext.Provider value={dispatch}>
        {children}
      </TracksDispatcherContext.Provider>
    </TracksStateContext.Provider>
  );
}

export { TracksStateContext, TracksDispatcherContext, TracksContextController };
