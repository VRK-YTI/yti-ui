import { InlineAlert } from 'suomifi-ui-components';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { selectDisplayWarning } from '../model/model.slice';

const AlertWrapper = styled.div`
  padding: ${(props) => props.theme.suomifi.spacing.s};
`;

export default function DrawerTopAlert() {
  const { t } = useTranslation('admin');
  const displayWarning = useSelector(selectDisplayWarning());

  if (!displayWarning) {
    return <></>;
  }

  return (
    <AlertWrapper>
      <InlineAlert status="warning">
        {t('you-have-unsaved-changes')}
        <br />
        {t('save-or-cancel-changes')}
      </InlineAlert>
    </AlertWrapper>
  );
}
