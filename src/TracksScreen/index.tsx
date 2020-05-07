import React from "react";
import Navbar from "./Navbar";
import TrackList from "./TrackList";
import Player from "./Player";

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
      <TrackList filterText={searchText}></TrackList>
      <Player />
    </div>
  );
}
export default TracksScreen;
