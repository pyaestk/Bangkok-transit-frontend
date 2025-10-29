import { useState } from "react";
import { fetchFarePath } from "../services/pathsApi";

export function useFarePath() {
  const [pathData, setPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPath = () => setPathData(null);

  async function getFarePath(fromCode, toCode) {
    setIsLoading(true);
    setError("");
    setPathData(null);

    const result = await fetchFarePath(fromCode, toCode);

    if (result.ok) {
      setPathData(result.data);
    } else {
      setError(result.error || "Failed to fetch route");
    }

    setIsLoading(false);
  }

  return {
    pathData,
    isLoading,
    error,
    getFarePath, 
    resetPath
  };
}

