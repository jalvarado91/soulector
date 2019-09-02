import React, { Component } from "react";
import "./index.css";
import { TracksContextController } from "./context/TracksContext";
import { Tracks } from "./components/Tracks";

export function App() {
  return (
    <TracksContextController>
      {/* <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Soulector</h1>
      </div>
      <hr /> */}
      <Tracks />
    </TracksContextController>
  );
}
