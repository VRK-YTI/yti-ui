import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  ExternalLink,
  IconPlus,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { ContentWrapper, SearchResult } from './linked-model.styles';
import { useGetSearchModelsQuery } from '@app/common/components/search-models/search-models.slice';
import { useTranslation } from 'next-i18next';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import isURL from 'validator/lib/isURL';

export default function LinkedModel({
  initialData,
  setInternalData,
  setExternalData,
}: {
  initialData: {
    internalNamespaces: {
      name: string;
      uri: string;
    }[];
  };
  setInternalData: (
    value: {
      name: string;
      uri: string;
    }[]
  ) => void;
  setExternalData: (value: {
    name: string;
    namespace: string;
    prefix: string;
  }) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [showExternalForm, setShowExternalForm] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [errors, setErrors] = useState({
    name: true,
    namespace: true,
    prefix: true,
  });
  const [data, setData] = useState({
    name: '',
    namespace: '',
    prefix: '',
  });
  const [selected, setSelected] = useState<
    {
      name: string;
      uri: string;
    }[]
  >(initialData.internalNamespaces);
  const { data: models, isUninitialized } = useGetSearchModelsQuery(
    {
      lang: i18n.language,
      urlState: {
        domain: [],
        lang: i18n.language,
        organization: '',
        page: 1,
        q: keyword,
        status: [],
        type: '',
        types: [],
      },
    },
    { skip: keyword === '' }
  );

  const setDataValue = (key: keyof typeof data, value: string) => {
    if (userPosted && Object.values(errors).some((val) => val === true)) {
      const newErrors = {
        name: !data.name || data.name === '',
        namespace:
          !data.namespace || data.namespace === '' || !isURL(data.namespace),
        prefix: !data.prefix || data.namespace === '',
      };

      setErrors(newErrors);
    }

    setData({
      ...data,
      [key]: value,
    });
  };

  const handleClose = () => {
    setKeyword('');
    setShowExternalForm(false);
    setSelected(initialData.internalNamespaces);
    setData({
      name: '',
      namespace: '',
      prefix: '',
    });
    setUserPosted(false);
    setVisible(false);
  };

  const handleSubmit = () => {
    if (!userPosted) {
      setUserPosted(true);
    }

    if (showExternalForm) {
      const newErrors = {
        name: !data.name || data.name === '',
        namespace:
          !data.namespace || data.namespace === '' || !isURL(data.namespace),
        prefix: !data.prefix || data.namespace === '',
      };

      setErrors(newErrors);

      if (Object.values(newErrors).some((val) => val === true)) {
        return;
      }

      setExternalData({
        ...data,
        namespace:
          !data.namespace.startsWith('http://') &&
          !data.namespace.startsWith('https://')
            ? `http://${data.namespace}`
            : data.namespace,
      });
    } else {
      setInternalData(selected);
    }

    handleClose();
  };

  const handleCheckboxClick = ({
    name,
    uri,
  }: {
    name: string;
    uri: string;
  }) => {
    setSelected((selected) =>
      selected.map((s) => s.uri).includes(uri)
        ? selected.filter((s) => s.uri !== uri)
        : [...selected, { name: name, uri: uri }]
    );
  };

  useEffect(() => {
    setSelected(initialData.internalNamespaces);
  }, [initialData]);

  return (
    <>
      <Button
        variant="secondary"
        icon={<IconPlus />}
        onClick={() => setVisible(true)}
        id="add-data-model-button"
      >
        {t('add-data-model')}
      </Button>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        {renderForm()}
        {renderExternal()}

        <ModalFooter>
          <Button
            onClick={() => handleSubmit()}
            disabled={
              showExternalForm
                ? Object.values(data).filter((val) => val !== '').length < 3
                : selected.length < 1
            }
            id="submit-button"
          >
            {showExternalForm ? <>{t('add')}</> : <>{t('add-selected')}</>}
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
    </>
  );

  function renderForm() {
    if (showExternalForm) {
      return <></>;
    }

    return (
      <ModalContent>
        <ModalTitle>{t('add-reference-to-data-model')}</ModalTitle>

        <ContentWrapper>
          <div>
            <TextInput
              labelText={t('search-data-model')}
              onChange={(e) => setKeyword(e?.toString() ?? '')}
              debounce={300}
              id="search-input"
            />

            <Button
              variant="secondary"
              onClick={() => setShowExternalForm(true)}
              id="add-external-button"
            >
              {t('add-reference-to-external-data-model')}
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '5px' }}>
            {selected.map((select) => (
              <Chip
                key={`selected-result-${select.uri}`}
                onClick={() =>
                  setSelected(selected.filter((s) => s !== select))
                }
                removable
                id="selected-result-chip-button"
              >
                {data
                  ? getLanguageVersion({
                      data: models?.responseObjects.find(
                        (obj) => obj.id === select.uri
                      )?.label,
                      lang: i18n.language,
                      appendLocale: true,
                    })
                  : select}
              </Chip>
            ))}
          </div>

          {!isUninitialized && (
            <div>
              <Text variant="bold">
                {t('data-models-count', { count: models?.totalHitCount ?? 0 })}
              </Text>
            </div>
          )}

          <div>
            {keyword !== '' && models ? (
              <>
                {models.responseObjects.map((obj) => (
                  <SearchResult key={`data-model-result-${obj.id}`}>
                    <Checkbox
                      checked={selected.map((s) => s.uri).includes(obj.id)}
                      onClick={() =>
                        handleCheckboxClick({
                          name: getLanguageVersion({
                            data: obj.label,
                            lang: i18n.language,
                            appendLocale: true,
                          }),
                          uri: obj.id,
                        })
                      }
                      id="data-model-checkbox"
                    >
                      {getLanguageVersion({
                        data: obj.label,
                        lang: i18n.language,
                        appendLocale: true,
                      })}
                    </Checkbox>
                    <ExternalLink
                      href={obj.id}
                      labelNewWindow={t('link-opens-new-window-external', {
                        ns: 'common',
                      })}
                    >
                      {obj.id}
                    </ExternalLink>
                  </SearchResult>
                ))}
              </>
            ) : (
              <Text smallScreen>{t('search-data-model-by-keyword')}</Text>
            )}
          </div>
        </ContentWrapper>
      </ModalContent>
    );
  }

  function renderExternal() {
    if (!showExternalForm) {
      return <></>;
    }

    return (
      <ModalContent>
        <ModalTitle>{t('add-reference-to-data-model-outside')}</ModalTitle>

        <ContentWrapper>
          <TextInput
            labelText={t('data-model-name')}
            visualPlaceholder={t('input-data-model-name')}
            fullWidth
            onChange={(e) => setDataValue('name', e?.toString() ?? '')}
            status={userPosted && errors.name ? 'error' : 'default'}
            id="data-model-name-input"
          />

          <TextInput
            labelText={t('namespace-with-examples')}
            visualPlaceholder={t('input-uri-namespace')}
            fullWidth
            onChange={(e) => setDataValue('namespace', e?.toString() ?? '')}
            status={userPosted && errors.namespace ? 'error' : 'default'}
            statusText={
              userPosted && errors.namespace ? t('namespace-is-not-valid') : ''
            }
            id="namespace-input"
          />

          <TextInput
            labelText={t('prefix-in-this-service')}
            visualPlaceholder={t('input-data-model-prefix')}
            fullWidth
            onChange={(e) => setDataValue('prefix', e?.toString() ?? '')}
            status={userPosted && errors.prefix ? 'error' : 'default'}
            id="prefix-input"
          />
        </ContentWrapper>
      </ModalContent>
    );
  }
}
