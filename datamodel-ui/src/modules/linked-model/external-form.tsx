import { useTranslation } from 'next-i18next';
import {
  Button,
  ExternalLink,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  TextInput,
} from 'suomifi-ui-components';
import { ContentWrapper } from './linked-model.styles';
import { ADMIN_EMAIL } from '@app/common/utils/get-value';
import { WideSingleSelect } from '../model-form/model-form.styles';
import { useGetNamespacesQuery } from '@app/common/components/namespaces/namespaces.slice';
import { compareLocales } from '@app/common/utils/compare-locals';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import { useState } from 'react';
import isURL from 'validator/lib/isURL';

interface ExternalFormProps {
  data: {
    name: { [key: string]: string };
    namespace: string;
    prefix: string;
  };
  languages: string[];
  userPosted: boolean;
  visible: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  setData: (value: {
    name: { [key: string]: string };
    namespace: string;
    prefix: string;
  }) => void;
}

export default function ExternalForm({
  data,
  languages,
  userPosted,
  visible,
  handleClose,
  handleSubmit,
  setData,
}: ExternalFormProps) {
  const { t } = useTranslation('admin');
  const [errors, setErrors] = useState({
    name: true,
    namespace: true,
    prefix: true,
  });

  const { data: namespaces } = useGetNamespacesQuery(void null, {
    skip: !visible,
  });

  const setDataValue = (
    key: keyof typeof data,
    value: { [key: string]: string } | string
  ) => {
    if (userPosted && Object.values(errors).some((val) => val === true)) {
      const newErrors = {
        name:
          !data.name ||
          Object.values(data.name).some((n) => n.trim().length === 0),
        namespace:
          !data.namespace || data.namespace === '' || !isURL(data.namespace),
        prefix: !data.prefix || data.namespace === '',
      };

      setErrors(newErrors);
    }

    const newValue =
      typeof value === 'object' ? { ...data['name'], ...value } : value;

    setData({
      ...data,
      [key]: newValue,
    });
  };

  const handleSubmitClick = () => {
    const newErrors = {
      name:
        !data.name ||
        Object.values(data.name).some((n) => n.trim().length === 0),
      namespace:
        !data.namespace || data.namespace === '' || !isURL(data.namespace),
      prefix: !data.prefix || data.namespace === '',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((val) => val === true)) {
      return;
    }

    handleSubmit();
  };

  if (!visible) {
    return <></>;
  }

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
    >
      <ModalContent>
        <ModalTitle>{t('add-reference-to-data-model-outside')}</ModalTitle>

        <ContentWrapper>
          <WideSingleSelect
            labelText={t('namespace-with-examples')}
            items={
              namespaces?.map((ns) => ({
                uniqueItemId: ns,
                labelText: ns,
              })) ?? []
            }
            visualPlaceholder={t('input-uri-namespace')}
            clearButtonLabel=""
            itemAdditionHelpText=""
            ariaOptionsAvailableText=""
            onItemSelect={(e) => setDataValue('namespace', e?.toString() ?? '')}
            id="namespaces-dropdown"
            status={userPosted && errors.namespace ? 'error' : 'default'}
            statusText={
              userPosted && errors.namespace ? t('namespace-is-not-valid') : ''
            }
          />
          <InlineAlert>
            {t('namespace-missing-info')}{' '}
            <ExternalLink
              href={`mailto:${ADMIN_EMAIL}`}
              labelNewWindow={t('link-opens-new-window-external', {
                ns: 'common',
              })}
            >
              {ADMIN_EMAIL}
            </ExternalLink>
          </InlineAlert>
          {Array.from(languages)
            .sort((a, b) => compareLocales(a, b))
            .map((lang) => (
              <TextInput
                key={`datamodel-name-${lang}`}
                labelText={`${t('data-model-name')}, ${lang}`}
                visualPlaceholder={t('input-data-model-name')}
                fullWidth
                onChange={(e) =>
                  setDataValue('name', { [lang]: e?.toString() ?? '' })
                }
                status={userPosted && errors.name ? 'error' : 'default'}
                id="data-model-name-input"
                maxLength={TEXT_INPUT_MAX}
              />
            ))}

          <TextInput
            labelText={t('prefix-in-this-service')}
            visualPlaceholder={t('input-data-model-prefix')}
            fullWidth
            onChange={(e) => setDataValue('prefix', e?.toString() ?? '')}
            status={userPosted && errors.prefix ? 'error' : 'default'}
            id="prefix-input"
            maxLength={32}
          />
        </ContentWrapper>
      </ModalContent>

      <ModalFooter>
        <Button
          onClick={() => handleSubmitClick()}
          disabled={
            data.prefix.trim().length === 0 ||
            data.namespace.trim().length === 0 ||
            Object.values(data.name).some((n) => n.trim().length === 0)
          }
          id="submit-button"
        >
          {t('add')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleClose()}
          id="cancel-button"
        >
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
