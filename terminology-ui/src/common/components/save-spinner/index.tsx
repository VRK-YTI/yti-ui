import { LoadingSpinner } from 'suomifi-ui-components';

interface SaveSpinnerProps {
  text: string;
}

export default function SaveSpinner({ text }: SaveSpinnerProps) {
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
