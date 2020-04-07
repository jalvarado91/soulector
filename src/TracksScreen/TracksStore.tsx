import create from "zustand";
import { createApiClient, TrackDTO } from "../infra/apiClient";
import { CollectionNormalized, normalize } from "../infra/collection-utils";
import { useCallback } from "react";

const apiClient = createApiClient();

export type TrackSource = "soundcloud" | "mixcloud";

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

type TrackStore = {
  tracks: CollectionNormalized<TrackModel>;
  fetchTracksState: "pending" | "resolved" | "rejected";
  rejectionReason?: string;
  fetchTracks: () => Promise<void>;
};

const [useTracksStore] = create<TrackStore>(set => ({
  tracks: {},

  fetchTracksState: "pending",
  fetchTracks: async () => {
    try {
      const trackDtos = await apiClient.getEpisodes();
      const trackModels = trackDtos.map(trackMapper);
      const normalized = normalize(trackModels, track => track.id);
      set({
        tracks: normalized,
        fetchTracksState: "resolved"
      });
    } catch (err) {
      set({
        fetchTracksState: "rejected",
        rejectionReason: err
      });
    }
  }
}));

type TrackViewStore = {
  activate: (filterText: string) => Promise<void>;
  activateState: "pending" | "resolved" | "rejected";
  filteredTracks: TrackStore["tracks"];
  rejectionReason?: string;
};
const [useTrackViewStore] = create<TrackViewStore>(set => {
  const fetchTracks = useTracksStore(state => state.fetchTracks);
  const tracks = useTracksStore(state => state.tracks);

  return {
    activateState: "pending",
    filteredTracks: tracks,
    activate: async () => {
      await fetchTracks()
        .then(() => set({ activateState: "resolved" }))
        .catch(err => set({ activateState: "rejected", rejectionReason: err }));
    }
  };
});