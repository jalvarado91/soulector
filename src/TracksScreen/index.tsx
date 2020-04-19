import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import TrackList from "./TrackList";
import { withContainer } from "../infra/withContainer";
import { TracksScreenContainer } from "./TracksScreenContainer";
import Player from "./Player";
import { createApiClient } from "../infra/apiClient";

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
      <Player />
      {/* <TestComponent /> */}
    </div>
  );
}
export default withContainer(TracksScreen, TracksScreenContainer);
