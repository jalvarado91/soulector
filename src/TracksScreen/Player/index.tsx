import React from "react";
import { Helmet } from "react-helmet";
import { withContainer } from "../../infra/withContainer";
import { PlayerContainer, usePlayerContainer } from "./PlayerContainer";
import { EmbedPlayer } from "../../components/EmbedPlayer";

function Player() {
  const { currentTrack, showPlayer } = usePlayerContainer();

  return (
    <React.Fragment>
      {showPlayer && currentTrack && (
        <React.Fragment>
          <Helmet>
            <title>{currentTrack.name}</title>
          </Helmet>
          <div
            className="bg-white p-3"
            style={{
              boxShadow:
                "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
          >
            <div className="max-w-4xl m-auto">
              <EmbedPlayer track={currentTrack} />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default withContainer(Player, PlayerContainer);
