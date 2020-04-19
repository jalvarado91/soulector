import {
  TrackListContainer,
  useTrackListContainer
} from "./TrackListContainer";
import React from "react";
import TrackListSpinner from "./TrackListSpinner";
import { withContainer } from "../../infra/withContainer";
import { Tracks } from "./Tracks";
import { match } from "../../helpers";

type Props = {
  filterText?: string;
};
function TrackList({ filterText = "" }: Props) {
  const {
    activate,
    currentTrackId,
    onTrackClick,
    onRandomClick,
    filteredTracks
  } = useTrackListContainer(filterText);

  return (
    <React.Fragment>
      {match(activate, {
        pending: () => <TrackListSpinner />,
        rejected: () => <div>Something went wrong dawg</div>,
        resolved: () => (
          <Tracks
            filterText={filterText}
            tracks={filteredTracks}
            currentTrackId={currentTrackId}
            onTrackClick={onTrackClick}
            onRandomClick={onRandomClick}
            focusTrackId={currentTrackId}
          />
        )
      })}
    </React.Fragment>
  );
}

export default withContainer(TrackList, TrackListContainer);
