import CommonWrapper from "../wrapper";
import React from "react";
import { LoadingSpinner } from "suomifi-ui-components";

interface SaveSpinnerProps {
  text: string;
}

function SaveSpinner({ text }: SaveSpinnerProps) {
  return (
    <div role="alert">
      <LoadingSpinner
        textAlign="right"
        variant="small"
        status="loading"
        text={text}
      />
    </div>
  );
}

export default CommonWrapper(SaveSpinner);
