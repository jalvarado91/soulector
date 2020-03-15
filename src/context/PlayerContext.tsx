import React, { useReducer } from "react";

// Actions

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

// Reducer

function reduceState(
  state: PlayerState,
  action: PlayerContextAction
): PlayerState {
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

// Context Controller

export type PlayerContextControllerProps = {
  children: React.ReactNode;
};

function PlayerContextController(props: PlayerContextControllerProps) {
  const { children } = props;

  const [state, dispatch] = useReducer<typeof reduceState>(reduceState, {
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
