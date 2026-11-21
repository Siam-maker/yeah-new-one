"use client";

import { useEffect, useState } from "react";
import type { PopulationSnapshot } from "@/lib/content/demographics";

let snapshot: PopulationSnapshot | null = null;
let pending: Promise<PopulationSnapshot> | null = null;

function load() {
  if (!pending) pending = fetch("/data/demographics.json")
    .then((response) => {
      if (!response.ok) throw new Error("Unable to read the population snapshot.");
      return response.json() as Promise<PopulationSnapshot>;
    })
    .then((data) => (snapshot = data))
    .catch((error) => { pending = null; throw error; });
  return pending;
}

export function usePopulation() {
  const [data, setData] = useState(snapshot);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    if (!data) void load().then((value) => { if (mounted) setData(value); }, () => { if (mounted) setError(true); });
    return () => { mounted = false; };
  }, [attempt, data]);

  return { data, error, retry: () => { setError(false); setAttempt((value) => value + 1); } };
}
