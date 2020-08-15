import React, { useEffect, useRef } from "react";
import { IconSearch, IconTimes } from "../../components/Icons";
import { KEYS } from "../../helpers";

type Props = {
  searchText: string;
  onSearchChange: (searchText: string) => void;
  onCloseClick: () => void;
};
export default function NavbarSearch({
  searchText,
  onSearchChange,
  onCloseClick,
}: Props) {
  let searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  function handleKeydown(event: React.KeyboardEvent) {
    if (event.key === KEYS.ESCAPE) {
      event.nativeEvent.stopImmediatePropagation();
      onCloseClick();
    }
  }

  return (
    <React.Fragment>
      <div className="mx-full md:max-w-xl w-full ml-auto">
        <div className="flex flex-grow items-center relative">
          <div className="text-gray-500 absolute pl-4">
            <IconSearch className="fill-current w-6 h-6"></IconSearch>
          </div>
          <input
            ref={searchRef}
            onKeyDown={handleKeydown}
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            className="w-full py-2 pl-12 pl-3 rounded-lg bg-gray-200 text-gray-900 outline-none focus:bg-gray-300 focus:border-gray-400"
            placeholder="Search for episodes..."
          ></input>
          <div className="flex items-center ml-auto absolute right-0 mr-3">
            <button
              className="p-2 text-gray-700 hover:bg-gray-400 hover:text-gray-600 hover:shadow-sm rounded-lg focus:outline-none"
              onClick={() => onCloseClick()}
            >
              <IconTimes className="fill-current w-3 h-3"></IconTimes>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
