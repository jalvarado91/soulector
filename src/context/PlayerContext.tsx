import React, { useReducer } from "react";

export type PlayerContextControllerProps = {
  children: React.ReactNode;
};

type ACTION_PLAY = {
  type: "PLAYER_PLAY";
  payload: {
    trackId: string;
  };
};

type PlayerContextAction = ACTION_PLAY;

type PlayerState = {
  playing: boolean;
  currentTrackId?: string;
};

const PlayerContextState = React.createContext<PlayerState>(
  (null as unknown) as PlayerState
);
PlayerContextState.displayName = "PlayerContextState";

type PlayerDispatcher = (action: PlayerContextAction) => void;
const PlayerContextDispatcher = React.createContext<PlayerDispatcher>(
  (null as unknown) as PlayerDispatcher
);

function reduceState(state: PlayerState, action: PlayerContextAction) {
  let { currentTrackId, playing } = state;

  switch (action.type) {
    case "PLAYER_PLAY":
      currentTrackId = action.payload.trackId;
      playing = true;
  }

  return {
    ...state,
    currentTrackId,
    playing
  };
}

function PlayerContextController(props: PlayerContextControllerProps) {
  const { children } = props;

  const reducer = (
    state: PlayerState,
    action: PlayerContextAction
  ): PlayerState => {
    return reduceState(state, action);
  };

  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    currentTrackId: undefined,
    playing: false
  });

  return (
    <PlayerContextState.Provider value={state}>
      <PlayerContextDispatcher.Provider value={dispatch}>
        {children}
      </PlayerContextDispatcher.Provider>
    </PlayerContextState.Provider>
  );
}

export { PlayerContextState, PlayerContextDispatcher, PlayerContextController };
