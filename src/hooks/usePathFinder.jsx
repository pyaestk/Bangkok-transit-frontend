import { useState } from "react";
import { fetchShortestPath, fetchLongestPath } from "../services/pathsApi";

export function useShortestPath() {
  const [pathData, setPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function getShortestPath(fromCode, toCode) {
    setIsLoading(true);
    setError("");
    setPathData(null);

    const result = await fetchShortestPath(fromCode, toCode);

    if (result.ok) setPathData(result.data);
    else setError(result.error || "Failed to fetch route");

    setIsLoading(false);
  }

  async function getLongestPath(fromCode, toCode) {
    setIsLoading(true);
    setError("");
    setPathData(null);

    const result = await fetchLongestPath(fromCode, toCode);

    if (result.ok) setPathData(result.data);
    else setError(result.error || "Failed to fetch route");

    setIsLoading(false);
  }

  return {
    pathData,
    isLoading,
    error,
    getShortestPath,
    getLongestPath, 
  };
}
