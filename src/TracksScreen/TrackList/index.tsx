import { useTrackListContainer } from "./TrackListContainer";
import React from "react";
import TrackListSpinner from "./TrackListSpinner";
import { Tracks } from "./Tracks";
import { match } from "../../infra/match";

type Props = {
  filterText?: string;
};
export default function TrackList({ filterText = "" }: Props) {
  const {
    activate,
    currentTrackId,
    onTrackClick,
    onRandomClick,
    filteredTracks,
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
        ),
      })}
    </React.Fragment>
  );
}
