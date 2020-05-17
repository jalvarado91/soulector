import { IconShuffle } from "./Icons";
import React from "react";
import { cx } from "emotion";

type Props = {
  onClick: () => void;
} & React.HTMLAttributes<HTMLButtonElement>;

export function ShuffleButton({ onClick, className }: Props) {
  return (
    <button
      onClick={() => onClick()}
      className={cx(
        "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold",
        "py-3 px-12",
        "rounded-full",
        "shadow-md",
        "flex items-center",
        className
      )}
    >
      <IconShuffle className="fill-current w-5 h-5" />
      <span className="ml-2">Play Random</span>
    </button>
  );
}
