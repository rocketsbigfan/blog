import useSWR from "swr";

export default function useTestFetch() {
  const { data, isLoading, error } = useSWR("/api/test");

  return { data, isLoading, error };
}