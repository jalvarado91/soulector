import React, { useEffect } from "react";
import { FixedSizeList } from "react-window";

export default function useFocusReactWindowItem(
  listRef: React.RefObject<FixedSizeList>,
  index: number
) {
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(index, "center");
    }
  }, [index, listRef]);
}
