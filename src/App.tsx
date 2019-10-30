import React, { Component } from "react";
import "./index.css";
import { TracksContextController } from "./context/TracksContext";
import { Tracks } from "./components/Tracks";
import { Soulector } from "./components/Icons";

export function App() {
  return (
    <TracksContextController>
      {/* <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Soulector</h1>
      </div>
      <hr /> */}
      <div className="flex flex-col h-screen text-gray-900">
        <div className="px-6 py-3 shadow-md flex">
          <Soulector className="w-8 mr-2" />
          <div className="text-2xl font-bold">Soulector</div>
        </div>
        <Tracks />
      </div>
    </TracksContextController>
  );
}
