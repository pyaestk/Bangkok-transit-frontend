import { useState } from "react";
import { fetchLongestPath } from "../services/pathsApi";

export function useLongestPath() {
  const [pathData, setPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPath = () => setPathData(null);

  async function getLongestPath(fromCode, toCode) {
    setIsLoading(true);
    setError("");
    setPathData(null);

    const result = await fetchLongestPath(fromCode, toCode);

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
    getLongestPath, 
    resetPath
  };
}

