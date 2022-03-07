// Code copied from suomifi-ui-components@6.1.1
import { useState, useEffect, useLayoutEffect } from "react";

function windowAvailable() {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

const useEnhancedEffect = windowAvailable() ? useLayoutEffect : useEffect;

let autoId = 0;
let clientRender = false;

const generateNextId = () => {
  autoId += 1;
  return autoId;
};

export const useGeneratedId = (propId?: string | null) => {
  const startId = propId || (clientRender ? generateNextId() : null);
  const [generatedId, setId] = useState(startId);

  useEnhancedEffect(() => {
    if (generatedId === null) {
      setId(generateNextId());
    }
  }, []);

  useEffect(() => {
    if (!clientRender) {
      clientRender = true;
    }
  }, []);
  return generatedId != null ? String(generatedId) : undefined;
};
