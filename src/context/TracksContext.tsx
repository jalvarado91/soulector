import React, { useState, useEffect } from "react";
import { ITrack } from "../types";

export type TracksContextControllerProps = {
  children: React.ReactNode;
};

type StateContext = {
  tracks: ITrack[];
};

const TracksStateContext = React.createContext<StateContext>({
  tracks: []
});
TracksStateContext.displayName = "TracksStateContext";

function TracksContextController(props: TracksContextControllerProps) {
  const { children } = props;
  const [tracks, setTracks] = useState<ITrack[]>([]);

  useEffect(() => {
    async function fetchTracks() {
      let res = await fetch("/getEpisodes");
      let json = (await res.json()) as { tracks: ITrack[] };

      console.log(json);
      return setTracks(json.tracks);
    }

    fetchTracks();
  }, []);

  return (
    <TracksStateContext.Provider value={{ tracks }}>
      {children}
    </TracksStateContext.Provider>
  );
}

export { TracksStateContext, TracksContextController };
