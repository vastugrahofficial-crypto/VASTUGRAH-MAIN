import React from "react";
import ZodiacWheel from "@/components/site/ZodiacWheel";

/**
 * The rashi wheel from the brand reference, cropped at the top-left and turning
 * slowly behind every page. Vector lines, so it stays crisp at any zoom.
 */
export default function Chakra() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden text-primary">
      <ZodiacWheel className="chakra-spin absolute -left-[40vmin] -top-[34vmin] h-[135vmin] w-[135vmin] opacity-[0.16] dark:opacity-[0.24]" />
    </div>
  );
}