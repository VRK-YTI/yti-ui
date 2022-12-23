import { InlineAlert } from 'suomifi-ui-components';
import { FormFooterUl } from './form-footer-alert.styles';

interface FormFooterAlertProps {
  alerts?: string[];
  labelText?: string;
}

export default function FormFooterAlert({
  alerts,
  labelText,
}: FormFooterAlertProps) {
  if (!alerts || alerts.length < 1) {
    return null;
  }

  return (
    <InlineAlert status="warning" labelText={labelText ?? 'Puuttuvia tietoja'}>
      <FormFooterUl>
        {alerts.map((alert, idx) => (
          <li key={`form-footer-alert-${idx}`}>{alert}</li>
        ))}
      </FormFooterUl>
    </InlineAlert>
  );
}
