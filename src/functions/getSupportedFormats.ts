import { useMemo } from "react";
import { getMimeType } from "../utils/mime-lookup";

const useGetSupportedFormats = (accept: string) => {
  return useMemo(() => {
    // 1. Split into array & sort alphabetically (for display)
    const supportedFormats = accept.trim().split(" ").sort();

    // 2. Convert to HTML-compatible MIME types (e.g., ".png" → "image/png")
    const mimeExtensions = supportedFormats
      .map((ext) => getMimeType(ext) || "")
      .filter(Boolean) // Remove invalid MIME types
      .join(",");

    return {
      supportedFormats, // [".png", ".svg", ".webp"] (sorted)
      mimeExtensions, // "image/png,image/svg+xml,image/webp"
    };
  }, [accept]);
};

export default useGetSupportedFormats;