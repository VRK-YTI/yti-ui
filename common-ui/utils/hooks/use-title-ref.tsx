import { useEffect, useRef } from "react";

export default function useTitleRef() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  return titleRef;
}
