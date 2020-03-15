import React from "react";
import { PlayerContextController } from "../context/PlayerContext";

type Props = {
  children: React.ReactElement;
};
export function TracksScreenContainer({ children }: Props) {
  return <PlayerContextController>{children}</PlayerContextController>;
}
