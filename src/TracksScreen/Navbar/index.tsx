import Logo from "./Logo";
import React, { useEffect } from "react";
import { IconSearch } from "../../components/Icons";
import NavbarSearch from "../Navbar/NavbarSearch";
import { cx } from "emotion";
import create from "zustand";

export type NavbarStore = {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

export const [useNavbarStore] = create<NavbarStore>((set, get) => ({
  searchOpen: false,
  openSearch() {
    set({
      searchOpen: true,
    });
  },
  closeSearch() {
    set({
      searchOpen: false,
    });
  },
}));

type Props = {
  searchText: string;
  onSearchClose: () => void;
  onSearchChange: (searchText: string) => void;
};

export default function Navbar({
  searchText,
  onSearchChange,
  onSearchClose,
}: Props) {
  const searchOpen = useNavbarStore((state) => state.searchOpen);
  const openSearch = useNavbarStore((state) => state.openSearch);
  const closeSearch = useNavbarStore((state) => state.closeSearch);

  useEffect(() => {
    if (!searchOpen) {
      onSearchClose();
    }
  }, [searchOpen, onSearchClose]);

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
              onCloseClick={closeSearch}
              onSearchChange={onSearchChange}
            />
          ) : (
            <SearchButton onClick={openSearch} />
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
      <IconSearch className="fill-current w-6 h-6"></IconSearch>
    </button>
  );
}
