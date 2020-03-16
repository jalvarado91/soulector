import React, { useState } from "react";
import "./index.css";
import TracksScreen from "./TracksScreen";

export function App() {
  const [searchText, setSearchText] = useState("");

  return (
    <TracksScreen
      onSearchChange={setSearchText}
      onSearchClose={() => setSearchText("")}
      searchText={searchText}
    />
  );
}
