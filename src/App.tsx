import React, { useState } from "react";
import "./index.css";
import TracksScreen from "./TracksScreen";
import { useShortcutHandlers } from "./useKeybardHandlers";

export default function App() {
  const [searchText, setSearchText] = useState("");

  useShortcutHandlers();

  return (
    <TracksScreen
      onSearchChange={setSearchText}
      onSearchClose={() => setSearchText("")}
      searchText={searchText}
    />
  );
}
