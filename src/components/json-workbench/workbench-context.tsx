"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  parseJson,
  type ParseResult,
} from "@/lib/json-workbench/parse";
import { WORKBENCH_SAMPLE_JSON } from "@/lib/json-workbench/sample";

type WorkbenchContextValue = {
  source: string;
  setSource: (value: string) => void;
  parsed: ParseResult;
  /** Second document for Compare Structure / reverse transforms */
  secondary: string;
  setSecondary: (value: string) => void;
  /** Push a result string back into the shared source */
  useAsSource: (value: string) => void;
  loadSample: () => void;
  clearSource: () => void;
};

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [source, setSourceState] = useState(WORKBENCH_SAMPLE_JSON);
  const [secondary, setSecondary] = useState("");

  const parsed = useMemo(() => parseJson(source), [source]);

  const setSource = useCallback((value: string) => {
    setSourceState(value);
  }, []);

  const useAsSource = useCallback((value: string) => {
    setSourceState(value);
  }, []);

  const loadSample = useCallback(() => {
    setSourceState(WORKBENCH_SAMPLE_JSON);
  }, []);

  const clearSource = useCallback(() => {
    setSourceState("");
  }, []);

  const value = useMemo(
    () => ({
      source,
      setSource,
      parsed,
      secondary,
      setSecondary,
      useAsSource,
      loadSample,
      clearSource,
    }),
    [
      source,
      setSource,
      parsed,
      secondary,
      useAsSource,
      loadSample,
      clearSource,
    ],
  );

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  );
}

export function useWorkbench(): WorkbenchContextValue {
  const ctx = useContext(WorkbenchContext);
  if (!ctx) {
    throw new Error("useWorkbench must be used within WorkbenchProvider");
  }
  return ctx;
}
