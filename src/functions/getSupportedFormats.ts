import { useMemo } from "react";
import { getMimeType } from "../utils/mime-lookup";

const useGetSupportedFormats = (accept: string) => {
  return useMemo(() => {
    const supportedFormats = accept.trim().split(" ").sort();

    const mimeExtensions = supportedFormats
      .map((ext) => getMimeType(ext) || "")
      .filter(Boolean) // Remove invalaid MIMEs
      .join(",");

    return {
      supportedFormats, // [".png", ".svg", ".webp"] (sorted)
      mimeExtensions, // "image/png,image/svg+xml,image/webp"
    };
  }, [accept]);
};

export default useGetSupportedFormats;