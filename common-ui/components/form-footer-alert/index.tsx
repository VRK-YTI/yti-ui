import { InlineAlert } from 'suomifi-ui-components';
import { FormFooterUl } from './form-footer-alert.styles';

interface FormFooterAlertProps {
  labelText: string;
  alerts?: string[];
}

export default function FormFooterAlert({
  labelText,
  alerts,
}: FormFooterAlertProps) {
  if (!alerts || alerts.length < 1) {
    return null;
  }

  return (
    <InlineAlert status="warning" labelText={labelText}>
      <FormFooterUl>
        {alerts.map((alert, idx) => (
          <li key={`form-footer-alert-${idx}`}>{alert}</li>
        ))}
      </FormFooterUl>
    </InlineAlert>
  );
}
