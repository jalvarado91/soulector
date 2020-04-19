import format from "date-fns/format";
import { useState, useEffect } from "react";
import React from "react";

export function createLargeSoundtrackThumbUrl(url: string) {
  const newUrl = url.replace("-large", "-t500x500");
  return newUrl;
}

export function formatTime(timeMillis: number) {
  const seconds = Math.floor((timeMillis / 1000) % 60);
  const minutes = Math.floor((timeMillis / (1000 * 60)) % 60);
  const hours = Math.floor((timeMillis / (1000 * 60 * 60)) % 24);

  const secsStr = `${seconds}`.padStart(2, "0");
  const minsStr = `${minutes}`.padStart(2, "0");
  const hrsStr = hours !== 0 ? `${hours}:` : "";

  return `${hrsStr}${minsStr}:${secsStr}`;
}

export function formatTimeSecs(timeSeconds: number) {
  return formatTime(timeSeconds * 1000);
}

export function formatDate(dateString: string) {
  var date = new Date(dateString);
  return format(date, "MMMM do yyyy");
}


/**
 * Pattern match util
 * 
 * Usage: 
 *  
 *      type Colors = "red" | "yellow" | "orange";
        enum Fruits {
          Banana,
          Apple,
          Orange
        }
        function TestMatch(fruit: Fruits, color: Colors) {
          let apple = match(fruit, {
            [Fruits.Banana]: () => "Banana case",
            [Fruits.Apple]: () => "Apple case",
            [Fruits.Orange]: () => "Orange case"
          });

          let red = match(color, {
            orange: () => "orange",
            red: () => "red",
            yellow: () => "yellow"
          });
        }
 *  
 * 
 * @param matchOn
 * @param cases 
 */
export function match<T extends string | number | symbol, R>(
  matchOn: T,
  cases: Record<T, () => R>
): R {
  const val = cases[matchOn];
  return val();
}



/**
 * useTask Hook
 */

type TaskMatchProps<R> = {
  pending?: () => any;
  rejected?: (error: unknown) => any;
  resolved?: (result: R) => any;
};

type TaskStatus = "pending" | "rejected" | "resolved";
export function useTask<T>(
  taskFunc: () => Promise<T>,
  initialStatus: TaskStatus = "pending"
) {
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(initialStatus);
  const [taskVal, setTaskVal] = useState<T | null>(null);

  useEffect(() => {
    async function runTask() {
      try {
        let v = await taskFunc();
        setTaskVal(v);
        setTaskStatus("resolved");
      } catch (err) {
        setTaskVal(err);
        setTaskStatus("rejected");
      }
    }

    if (taskStatus === "pending") {
      runTask();
    }
  }, [taskFunc, initialStatus]);

  return {
    match: React.useCallback(
      (cases: TaskMatchProps<T>) => {
        switch (taskStatus) {
          case "pending":
            return cases.pending && cases.pending();
          case "resolved":
            return (
              cases.resolved &&
              cases.resolved(taskVal ? taskVal : ((null as unknown) as T))
            );
          case "rejected":
            return cases.rejected && cases.rejected(taskVal);
        }
      },
      [taskStatus, taskVal]
    )
  };
}
