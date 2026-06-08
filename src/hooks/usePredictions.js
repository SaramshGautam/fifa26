import { useState, useCallback } from "react";
import { saveUserPredictions } from "../utils/storage";

/**
 * usePredictions — manages bracket predictions and persists them to storage.
 *
 * @param {string} username — current user's username
 * @param {object} initial  — initial predictions loaded from storage
 *
 * Returns:
 *   predictions        — { group: {A:[t,t,t], ...}, r32: [t,...], ... }
 *   updateStage(id, d) — update a single stage's data and save
 *   resetAll()         — wipe all predictions
 */
export function usePredictions(username, initial = {}) {
  const [predictions, setPredictions] = useState(initial);

  const updateStage = useCallback(
    (stageId, data) => {
      setPredictions((prev) => {
        const next = { ...prev, [stageId]: data };
        saveUserPredictions(username, next);
        return next;
      });
    },
    [username]
  );

  const resetAll = useCallback(() => {
    setPredictions({});
    saveUserPredictions(username, {});
  }, [username]);

  return { predictions, updateStage, resetAll };
}
