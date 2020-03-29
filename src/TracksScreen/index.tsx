import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import TrackList from "./TrackList";
import { withContainer } from "../infra/withContainer";
import { TracksScreenContainer } from "./TracksScreenContainer";
import Player from "./Player";
import { createApiClient } from "../infra/apiClient";

type Props = {
  searchText: string;
  onSearchClose: () => void;
  onSearchChange: (searchText: string) => void;
};

function TracksScreen({ searchText, onSearchChange, onSearchClose }: Props) {
  return (
    <div className="flex flex-col h-full text-gray-900">
      {/* <Navbar
        searchText={searchText}
        onSearchChange={onSearchChange}
        onSearchClose={onSearchClose}
      />
      <TrackList filterText={searchText}>test</TrackList>
      <Player /> */}
      <TestComponent />
    </div>
  );
}

type TaskMatchProps<R> = {
  pending?: () => any;
  rejected?: (error: unknown) => any;
  resolved?: (result: R) => any;
};

type TaskStatus = "pending" | "rejected" | "resolved";
function useTask<T>(
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

function fakeApi(
  shouldFail: boolean = false,
  delay: number = 500
): Promise<{ name: string }[]> {
  let result = [{ name: "dell" }, { name: "sony" }, { name: "apple" }];

  return new Promise((res, rej) => {
    setTimeout(() => {
      if (shouldFail) {
        return rej("failed");
      } else {
        return res(result);
      }
    }, delay);
  });
}

const apiClient = createApiClient();

function TestComponent() {
  const fetchTracks = useTask(async () => {
    // return await fakeApi(false, 1000);
    return await apiClient.getEpisodes();
  });

  return (
    <div>
      {fetchTracks.match({
        pending: () => <div>Waiting</div>,
        rejected: (err: any) => <div>{JSON.stringify(err)}</div>,
        resolved: result => (
          <div>
            {result.map(t => (
              <div>{t.name}</div>
            ))}
          </div>
        )
      })}
    </div>
  );
}

function match<T extends string | number | symbol, R>(
  matchOn: T,
  cases: Record<T, () => R>
): R {
  const val = cases[matchOn];
  return val();
}

type Colors = "red" | "yellow" | "orange";
enum Fruits {
  Banana,
  Apple,
  Orange
}
function TestMatch() {
  const [sFruit, setSFruit] = useState<Fruits>(Fruits.Banana);
  const [sColor, setSColor] = useState<Colors>("orange");

  let val1 = match(sFruit, {
    [Fruits.Banana]: () => console.log("Banana case"),
    [Fruits.Apple]: () => console.log("Apple case"),
    [Fruits.Orange]: () => console.log("Orange case")
  });

  let val = match(sColor, {
    orange: () => "orange",
    red: () => "red",
    yellow: () => "yellow"
  });
}

export default withContainer(TracksScreen, TracksScreenContainer);
