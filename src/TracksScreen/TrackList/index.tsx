import {
  TrackListContainer,
  useTrackListContainer
} from "./TrackListContainer";
import React from "react";
import TrackListSpinner from "./TrackListSpinner";
import { withContainer } from "../../infra/withContainer";
import { Tracks } from "./Tracks";

type Props = {
  filterText?: string;
};
function TrackList({ filterText = "" }: Props) {
  const {
    currentTrackId,
    tracksLoading,
    onTrackClick,
    onRandomClick,
    filteredTracks
  } = useTrackListContainer(filterText);

  return (
    <React.Fragment>
      {tracksLoading ? (
        <TrackListSpinner />
      ) : (
        <Tracks
          filterText={filterText}
          tracks={filteredTracks}
          currentTrackId={currentTrackId}
          onTrackClick={onTrackClick}
          onRandomClick={onRandomClick}
          focusTrackId={currentTrackId}
        />
      )}
    </React.Fragment>
  );
}

export default withContainer(TrackList, TrackListContainer);
