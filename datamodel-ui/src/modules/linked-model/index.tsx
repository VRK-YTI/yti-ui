import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  ExternalLink,
  IconPlus,
  InlineAlert,
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
import { useGetNamespacesQuery } from '@app/common/components/namespaces/namespaces.slice';
import { WideSingleSelect } from '../model-form/model-form.styles';
import { ADMIN_EMAIL } from '@app/common/utils/get-value';
import {
  ExternalNamespace,
  InternalNamespace,
} from '@app/common/interfaces/model.interface';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';

export default function LinkedModel({
  initialData,
  setInternalData,
  setExternalData,
  currentModel,
  languages,
}: {
  initialData: {
    internalNamespaces: InternalNamespace[];
  };
  setInternalData: (value: InternalNamespace[]) => void;
  setExternalData: (value: ExternalNamespace) => void;
  currentModel: string;
  languages: string[];
}) {
  const { t, i18n } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [showExternalForm, setShowExternalForm] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [errors, setErrors] = useState({
    name: true,
    namespace: true,
    prefix: true,
  });
  const [data, setData] = useState({
    name: languages.reduce((n, lang) => Object.assign(n, { [lang]: '' }), {}),
    namespace: '',
    prefix: '',
  });
  const [selected, setSelected] = useState<InternalNamespace[]>(
    initialData.internalNamespaces
  );
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

  useEffect(() => {
    models?.responseObjects.some((model) => model.prefix === currentModel)
      ? setHitCount(models.totalHitCount - 1 ?? 0)
      : setHitCount(models?.totalHitCount ?? 0);
  }, [currentModel, models]);

  const { data: namespaces } = useGetNamespacesQuery(void null, {
    skip: !showExternalForm,
  });

  const setDataValue = (
    key: keyof typeof data,
    value: { [key: string]: string } | string
  ) => {
    if (userPosted && Object.values(errors).some((val) => val === true)) {
      const newErrors = {
        name: !data.name || data.name === '',
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

  const handleCheckboxClick = (value: InternalNamespace) => {
    setSelected((selected) =>
      selected.map((s) => s.namespace).includes(value.namespace)
        ? selected.filter((s) => s.namespace !== value.namespace)
        : [...selected, value]
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
                : (initialData.internalNamespaces.length === 0 &&
                    selected.length === 0) ||
                  (selected.length === initialData.internalNamespaces.length &&
                    selected.every((s) =>
                      initialData.internalNamespaces
                        .map((i) => i.namespace)
                        .includes(s.namespace)
                    ))
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
          <div className="namespaceInternal">
            <TextInput
              labelText={t('search-data-model')}
              onChange={(e) => setKeyword(e?.toString() ?? '')}
              debounce={300}
              id="search-input"
              maxLength={TEXT_INPUT_MAX}
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
                key={`selected-result-${select.namespace}`}
                onClick={() =>
                  setSelected(selected.filter((s) => s !== select))
                }
                removable
                id={`selected-result-chip-button_${select.namespace}`}
              >
                {data
                  ? getLanguageVersion({
                      data: select.name,
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
                {t('data-models-count', { count: hitCount })}
              </Text>
            </div>
          )}

          <div>
            {keyword !== '' && models && (
              <>
                {models.responseObjects
                  .filter((obj) => obj.prefix !== currentModel)
                  .map((obj) => (
                    <SearchResult key={`data-model-result-${obj.id}`}>
                      <Checkbox
                        checked={selected
                          .map((s) => s.namespace)
                          .includes(obj.id)}
                        onClick={() =>
                          handleCheckboxClick({
                            name: obj.label,
                            namespace: obj.id,
                            prefix: obj.prefix,
                          })
                        }
                        id={`data-model-checkbox_${obj.id}}`}
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
              labelNewWindow={t('link-opens-new-window-external')}
            >
              {ADMIN_EMAIL}
            </ExternalLink>
          </InlineAlert>
          {languages.map((lang) => (
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
    );
  }
}
