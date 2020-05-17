import React, { useRef } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";
import { useComponentSize } from "../infra/useComponentSize";

export type ProgressBarProps = {
  duration: number;
  progress: number;
  onSeek: (progressTarget: number) => void;
  onChange: (progressTarget: number) => void;
};

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { duration, progress, onSeek, onChange } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const containerSize = useComponentSize(rootRef);
  const {
    width: containerWidth,
    left: containerLeft,
    right: containerRight,
  } = containerSize;

  const progressPercent = progress / duration;
  const progX = progressPercent * containerWidth;

  const [{ x }, set] = useSpring(() => ({ x: 0 }));
  const bind = useDrag(
    ({ event, dragging, delta: [xDelta], down, last, memo }) => {
      if (dragging && event) {
        event.preventDefault();
      }

      const clOffX = clampedOffsetX(xDelta);
      const offSetProgress = offsetToProgress(clOffX);

      // check if new computed progress is same as last calculation
      if (memo !== offSetProgress) {
        onSeek(offSetProgress);
      }
      if (last) {
        onChange(offSetProgress);
      }

      set({ x: down ? xDelta : 0, immediate: true });

      return offSetProgress;
    }
  );

  // Offset Interplation
  function clampedOffsetX(x: number) {
    return clamp(x + progX, 0, containerWidth);
  }

  function offsetToProgress(offset: number) {
    return (offset / containerWidth) * duration;
  }

  function onContainerClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    event.persist();

    let { clientX } = event;
    let clamped = clamp(clientX, containerLeft, containerRight);
    let offset = clamped - containerLeft;
    let offsetPercent = offset / containerWidth;
    let progressTarget = offsetPercent * duration;

    onChange(progressTarget);
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full h-1 cursor-pointer"
      onClick={onContainerClick}
    >
      <div className="absolute w-full h-full rounded overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600" />
        <animated.div
          className="absolute inset-0 rounded bg-gray-300 "
          style={{
            transform: interpolate([x], clampedOffsetX).interpolate(
              (x: any) => `translateX(${x}px)`
            ),
          }}
        />
      </div>

      <animated.div
        className="absolute flex items-center h-full justify-center"
        style={{
          transform: interpolate([x], clampedOffsetX).interpolate(
            (x: any) => `translateX(${x}px)`
          ),
        }}
      >
        <animated.div
          {...bind()}
          className="w-3 h-3 rounded-full bg-indigo-600 hover:bg-indigo-700"
          style={{
            transformOrigin: "center",
            transform: `translateX(-50%)`,
          }}
        />
      </animated.div>
    </div>
  );
};
