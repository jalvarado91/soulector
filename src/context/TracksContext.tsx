import React, { useEffect, useReducer } from "react";
import { ITrack } from "../types";
import { createApiClient, TrackDTO } from "../infra/apiClient";

const apiClient = createApiClient();

export type TrackSource = "soundcloud" | "mixcloud";

type BaseTrack = {
  id: string;
  duration: number;
  created_time: string;
  name: string;
  url: string;
  picture_large: string;
};

type SoundCloudTrack = {
  key: number;
  source: Extract<TrackSource, "soundcloud">;
};

type MixCloudTrack = {
  key: string;
  source: Extract<TrackSource, "mixcloud">;
};

export type TrackModel = {
  id: string;
  source: TrackSource;
  duration: number;
  created_time: string;
  key: number | string;
  name: string;
  url: string;
  picture_large: string;
};

function trackMapper(dto: TrackDTO): TrackModel {
  return {
    id: dto._id,
    created_time: dto.created_time,
    duration: dto.duration,
    key: dto.key,
    name: dto.name,
    picture_large: dto.picture_large,
    source: dto.source === "SOUNDCLOUD" ? "soundcloud" : "mixcloud",
    url: dto.url
  };
}

export type TracksContextControllerProps = {
  children: React.ReactNode;
};

type ACTION_TRACKS_LOAD = {
  type: "TRACKS_LOAD";
};

type ACTION_TRACKS_LOAD_SUCCESS = {
  type: "TRACKS_LOAD_SUCCESS";
  payload: {
    tracks: TrackModel[];
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

type CollectionNormed<T> = {
  [key: string]: T;
};

function normalize<T>(
  items: T[],
  getId: (item: T) => string
): CollectionNormed<T> {
  const normed = {} as CollectionNormed<T>;
  for (var i of items) {
    normed[getId(i)] = i;
  }
  return normed;
}

type TracksContextState = {
  tracks: TrackModel[];
  tracksById: CollectionNormed<TrackModel>;
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
  let { tracks, tracksById, loading, tracksFetchKey } = state;

  switch (action.type) {
    case "TRACKS_LOAD":
      loading = true;
      tracksFetchKey = tracksFetchKey + 1;
      break;
    case "TRACKS_LOAD_SUCCESS":
      loading = false;
      tracks = action.payload.tracks;
      tracksById = normalize(action.payload.tracks, track => track.id);
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

  const [state, dispatch] = useReducer<typeof reduceTrackState>(
    reduceTrackState,
    {
      tracks: [],
      tracksById: {},
      loading: true,
      tracksFetchKey: 0
    }
  );

  useEffect(() => {
    async function fetchTracks() {
      try {
        let trackDtos = await apiClient.getEpisodes();
        let trackModels = trackDtos.map(trackMapper);

        dispatch({
          type: "TRACKS_LOAD_SUCCESS",
          payload: {
            tracks: trackModels
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
