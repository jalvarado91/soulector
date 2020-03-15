import axios from "axios";

export function createApiClient() {
  return new APIClient();
}

export class APIClient {
  get client() {
    return axios.create();
  }

  getEpisodes(): Promise<TrackDTO[]> {
    return this.client
      .get<GetEpisodesDTO>("/getEpisodes")
      .then(this._data)
      .then(data => data.tracks);
  }

  updateEpisodes(): Promise<string[]> {
    return this.client
      .get<UpdateEpisodesDTO>("/updateEpisodes")
      .then(this._data)
      .then(data => data.retrievedTracks);
  }

  /**
   * Helper to extract data.
   */
  _data<T>(resp: { data: T }) {
    return resp.data;
  }
}

/**
 * DTOs
 */
export type TrackDTO = {
  _id: string;
  source: string;
  duration: number;
  created_time: string;
  key: number | string;
  name: string;
  url: string;
  picture_large: string;
};

type GetEpisodesDTO = {
  tracks: TrackDTO[];
};

type UpdateEpisodesDTO = {
  msg: string;
  retrievedTracks: string[];
};
