"use client";

import { relativeDate, formatAbsoluteDate } from "@/lib/utils/relativeDate";
import { useState } from "react";

export default function NoteDate({ date }: { date: Date | string }) {
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer"
    >
      {isHover && date !== undefined
        ? formatAbsoluteDate(date)
        : relativeDate(date)}
    </span>
  );
}
