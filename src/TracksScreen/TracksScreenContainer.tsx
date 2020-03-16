import React from "react";
import { PlayerContextController } from "./PlayerContextController";
import { TracksContextController } from "./TracksContextController";

type Props = {
  children: React.ReactElement;
};
export function TracksScreenContainer({ children }: Props) {
  return (
    <TracksContextController>
      <PlayerContextController>{children}</PlayerContextController>
    </TracksContextController>
  );
}
