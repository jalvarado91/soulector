import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { TracksContextController } from "./context/TracksContext";
import { PlayerContextController } from "./context/PlayerContext";
import { TracksContainer } from "./components/Tracks";
import { Soulector, SearchIcon, TimesIcon } from "./components/Icons";
import { PlayerContainer } from "./components/PlayerContainer";
import { Helmet } from "react-helmet";

export function App() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <TracksContextController>
      <Helmet titleTemplate="%s | Soulector" defaultTitle="Soulector"></Helmet>
      <div className="flex flex-col h-full text-gray-900">
        <div className="px-4 py-3 shadow-md flex items-center">
          {searchActive ? (
            <NavbarSearch
              searchText={searchText}
              onCloseClick={() => {
                setSearchText("");
                setSearchActive(false);
              }}
              onSearchChange={setSearchText}
            />
          ) : (
            <React.Fragment>
              <div className="flex items-center">
                <Soulector className="w-8 h-8 mr-2" />
                <div className="text-2xl font-bold">Soulector</div>
              </div>
              <div className="flex items-center ml-auto">
                <button
                  className="p-2 hover:bg-gray-200 rounded-full focus:outline-none"
                  onClick={() => setSearchActive(true)}
                >
                  <SearchIcon className="fill-current w-6 h-6"></SearchIcon>
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
        <PlayerContextController>
          <TracksContainer filterText={searchText} />
          <PlayerContainer />
        </PlayerContextController>
      </div>
    </TracksContextController>
  );
}

type NavbarSearch = {
  searchText: string;
  onSearchChange: (searchText: string) => void;
  onCloseClick: () => void;
};
function NavbarSearch({
  searchText,
  onSearchChange,
  onCloseClick
}: NavbarSearch) {
  let searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchRef.current]);

  return (
    <React.Fragment>
      <div className="flex flex-grow items-center relative">
        <div className="text-gray-500 absolute pl-4">
          <SearchIcon className="fill-current w-6 h-6"></SearchIcon>
        </div>
        <input
          ref={searchRef}
          value={searchText}
          onChange={e => onSearchChange(e.target.value)}
          type="text"
          className="w-full py-2 pl-12 pl-3 rounded-lg bg-gray-200 text-gray-900 outline-none focus:bg-gray-300 focus:border-gray-400"
          placeholder="Search for episodes..."
        ></input>
        <div className="flex items-center ml-auto absolute right-0 mr-3">
          <button
            className="p-2 text-gray-700 hover:bg-gray-400 hover:text-gray-600 hover:shadow-sm rounded-lg focus:outline-none"
            onClick={() => onCloseClick()}
          >
            <TimesIcon className="fill-current w-3 h-3"></TimesIcon>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
