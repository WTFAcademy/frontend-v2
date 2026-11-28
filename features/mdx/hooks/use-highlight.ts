import { useQuery } from "@tanstack/react-query";

export const FALLBACK_LANG = "txt";

export const useHighlight = (text: string, lang: string, isDarkMode: boolean) =>
  useQuery({
    queryKey: [
      "highlight",
      lang.toLowerCase(),
      isDarkMode ? "dark" : "light",
      text,
    ],
    queryFn: async () => {
      const { highlight } = await import("../highlight");
      return highlight(text, lang.toLowerCase(), isDarkMode);
    },
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
