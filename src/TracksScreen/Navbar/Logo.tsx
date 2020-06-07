import React from "react";
import { Soulector } from "../../components/Icons";

export default function Logo() {
  return (
    <React.Fragment>
      <Soulector className="w-8 h-8 mr-2" />
      <div className="text-2xl font-bold">Soulection</div>
    </React.Fragment>
  );
}
