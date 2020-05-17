import React, { useState, useLayoutEffect, useCallback } from "react";

function getSize(el: HTMLElement) {
  if (!el) {
    return {
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }

  const rect = el.getBoundingClientRect();

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  };
}

export function useComponentSize(ref: any) {
  var [componentSize, setComponentSize] = useState(
    getSize(ref ? ref.current : {})
  );

  var handleResize = useCallback(
    function handleResize() {
      if (ref.current) {
        setComponentSize(getSize(ref.current));
      }
    },
    [ref]
  );

  useLayoutEffect(
    function () {
      if (!ref.current) {
        return;
      }

      handleResize();
      // @ts-ignore
      if (typeof ResizeObserver === "function") {
        // @ts-ignore
        var resizeObserver = new ResizeObserver(function () {
          handleResize();
        });
        resizeObserver.observe(ref.current);

        return function () {
          resizeObserver.disconnect(ref.current);
          resizeObserver = null;
        };
      } else {
        window.addEventListener("resize", handleResize);

        return function () {
          window.removeEventListener("resize", handleResize);
        };
      }
    },
    [ref.current]
  );

  return componentSize;
}
