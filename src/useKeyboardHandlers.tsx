import {
  PlayerStore,
  playerStoreSelectors,
  usePlayerStore,
} from "./TracksScreen/PlayerStore";
import shallow from "zustand/shallow";
import { useEffect, useMemo } from "react";
import {
  isWritableElement,
  isInputLike,
  KEYS,
  isArrowKey,
  EVENT,
} from "./helpers";
import { useNavbarStore } from "./TracksScreen/Navbar";

export interface KeyboardAction {
  perform: Function;
  keyPriority?: number;
  keyTest: (event: globalThis.KeyboardEvent) => boolean;
}

export type KeyboarActionsMap = {
  [key: string]: KeyboardAction;
};

export function useShortcutHandlers() {
  const playerSelectors = (state: PlayerStore) => ({
    playing: state.playing,
    resume: state.resume,
    pause: state.pause,
    volumeUp: state.volumeUp,
    volumeDown: state.volumeDown,
    toggleMute: state.toggleMute,
    forward: state.forward,
    rewind: state.rewind,
  });

  const {
    playing,
    resume,
    pause,
    volumeUp,
    volumeDown,
    toggleMute,
    forward,
    rewind,
  } = usePlayerStore(playerSelectors, shallow);

  const openSearch = useNavbarStore((state) => state.openSearch);

  const togglePlay = useMemo(() => {
    return playing ? pause : resume;
  }, [playing, pause, resume]);

  const keyboardActions: KeyboarActionsMap = {
    VOLUME_UP: {
      keyTest: (event: globalThis.KeyboardEvent) => {
        return event.key === KEYS.ARROW_UP && event.shiftKey;
      },
      perform: volumeUp,
    },
    VOLUME_DOWN: {
      keyTest: (event: globalThis.KeyboardEvent) => {
        return event.key === KEYS.ARROW_DOWN && event.shiftKey;
      },
      perform: volumeDown,
    },
    TOGGLE_MUTE: {
      keyTest: (event: globalThis.KeyboardEvent) => {
        return event.keyCode === KEYS.M_KEY_CODE;
      },
      perform: toggleMute,
    },
    TOGGLE_PLAY: {
      keyTest: (event: globalThis.KeyboardEvent) => {
        return event.key === KEYS.SPACE;
      },
      perform: togglePlay,
    },
    FORWARD_THIRTY: {
      keyTest: (event: globalThis.KeyboardEvent) => {
        return event.key === KEYS.ARROW_RIGHT;
      },
      perform: () => forward(30),
    },
    REWIND_THIRTY: {
      keyTest: (event: globalThis.KeyboardEvent) => {
        return event.key === KEYS.ARROW_LEFT;
      },
      perform: () => rewind(30),
    },
    OPEN_SEARCH: {
      keyTest: (event: globalThis.KeyboardEvent) => {
        return event[KEYS.CTRL_OR_CMD] && event.keyCode === KEYS.F_KEY_CODE;
      },
      perform: openSearch,
    },
  };

  function handleKeyDown(event: globalThis.KeyboardEvent) {
    const data = Object.values(keyboardActions)
      .sort((a, b) => (b.keyPriority || 0) - (a.keyPriority || 0))
      .filter((action) => action.keyTest(event));

    if (data.length === 0) {
      return false;
    }

    event.preventDefault();

    data[0].perform();
    return true;
  }

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      // Ignore events in inputs
      if (
        (isWritableElement(event.target) && event.key !== KEYS.ESCAPE) ||
        // case: using arrows to move between buttons
        (isArrowKey(event.key) && isInputLike(event.target))
      ) {
        return;
      }

      if (event.key === KEYS.QUESTION_MARK) {
        // TODO: Open keyboard shortcuts dialog
      }

      if (handleKeyDown(event)) {
        return;
      }
    }

    document.addEventListener(EVENT.KEYDOWN, onKeyDown, false);

    return () => {
      document.removeEventListener(EVENT.KEYDOWN, onKeyDown, false);
    };
  });
}
