import Logo from "./Logo";
import React, { useState, useEffect } from "react";
import { SearchIcon } from "../../components/Icons";
import NavbarSearch from "../Navbar/NavbarSearch";
import { cx } from "emotion";

type Props = {
  searchText: string;
  onSearchClose: () => void;
  onSearchChange: (searchText: string) => void;
};

export default function Navbar({
  searchText,
  onSearchChange,
  onSearchClose
}: Props) {
  const [searchOpen, setSearchOpen] = useState(false);

  function onClose() {
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!searchOpen) {
      onSearchClose();
    }
  }, [searchOpen]);

  return (
    <div className="px-4 py-3 shadow-md flex items-center">
      <React.Fragment>
        <div
          className={cx("flex", "items-center", searchOpen && "hidden sm:flex")}
        >
          <Logo />
        </div>
        <div className="flex items-center ml:auto sm:ml-6 w-full justify-end">
          {searchOpen ? (
            <NavbarSearch
              searchText={searchText}
              onCloseClick={onClose}
              onSearchChange={onSearchChange}
            />
          ) : (
            <SearchButton onClick={() => setSearchOpen(true)} />
          )}
        </div>
      </React.Fragment>
    </div>
  );
}

type SearchButtonProps = {
  onClick: () => void;
};
function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button
      className="p-2 hover:bg-gray-200 rounded-full focus:outline-none"
      onClick={() => onClick()}
    >
      <SearchIcon className="fill-current w-6 h-6"></SearchIcon>
    </button>
  );
}
