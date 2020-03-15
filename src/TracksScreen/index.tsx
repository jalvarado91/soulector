import React from "react";
import Navbar from "./Navbar";
import TrackList from "./TrackList";
import { withContainer } from "../infra/withContainer";
import { TracksScreenContainer } from "./TracksScreenContainer";

type Props = {
  searchText: string;
  onSearchClose: () => void;
  onSearchChange: (searchText: string) => void;
};

function TracksScreen({ searchText, onSearchChange, onSearchClose }: Props) {
  return (
    <div className="flex flex-col h-full text-gray-900">
      <Navbar
        searchText={searchText}
        onSearchChange={onSearchChange}
        onSearchClose={onSearchClose}
      />
      <TrackList filterText={searchText}>test</TrackList>
      {/* <PlayerContextController>
        <PlayerContainer />
      </PlayerContextController> */}
      <div className="w-full py-1 text-xs text-center text-orange-700 bg-orange-200">
        Refactor Version
      </div>
    </div>
  );
}

export default withContainer(TracksScreen, TracksScreenContainer);
