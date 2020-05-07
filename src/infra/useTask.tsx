import { useState, useEffect } from "react";
import React from "react";

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
    ),
  };
}
