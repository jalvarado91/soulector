import React from "react";
import "./index.css";
import { TracksContextController } from "./context/TracksContext";
import { PlayerContextController } from "./context/PlayerContext";
import { TracksContainer } from "./components/Tracks";
import { Soulector } from "./components/Icons";
import { PlayerContainer } from "./components/PlayerContainer";
import { Helmet } from "react-helmet";

export function App() {
  return (
    <TracksContextController>
      <Helmet titleTemplate="%s | Soulector" defaultTitle="Soulector"></Helmet>
      {/* <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Soulector</h1>
      </div>
      <hr /> */}
      <div className="flex flex-col h-full text-gray-900">
        <div className="px-6 py-3 shadow-md flex items-center">
          <Soulector className="w-8 h-8 mr-2" />
          <div className="text-2xl font-bold">Soulector</div>
        </div>
        <PlayerContextController>
          <TracksContainer />
          <PlayerContainer />
        </PlayerContextController>
      </div>
    </TracksContextController>
  );
}
