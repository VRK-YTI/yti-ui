import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  ExternalLink,
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

export default function LinkedModel({
  initialData,
  setInternalData,
  setExternalData,
}: {
  initialData: {
    internalNamespaces: string[];
  };
  setInternalData: (value: string[]) => void;
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
  const [data, setData] = useState({
    name: '',
    namespace: '',
    prefix: '',
  });
  const [selected, setSelected] = useState<string[]>(
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

  const handleClose = () => {
    setKeyword('');
    setShowExternalForm(false);
    setSelected(initialData.internalNamespaces);
    setData({
      name: '',
      namespace: '',
      prefix: '',
    });
    setVisible(false);
  };

  const handleSubmit = () => {
    if (showExternalForm) {
      setExternalData(data);
    } else {
      setInternalData(selected);
    }

    handleClose();
  };

  const handleCheckboxClick = (id: string) => {
    setSelected((selected) =>
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  useEffect(() => {
    setSelected(initialData.internalNamespaces);
  }, [initialData]);

  return (
    <>
      <Button variant="secondary" icon="plus" onClick={() => setVisible(true)}>
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
          >
            {showExternalForm ? <>{t('add')}</> : <>{t('add-selected')}</>}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
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
            />

            <Button
              variant="secondary"
              onClick={() => setShowExternalForm(true)}
            >
              {t('add-reference-to-external-data-model')}
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '5px' }}>
            {selected.map((select) => (
              <Chip
                key={`selected-result-${select}`}
                onClick={() =>
                  setSelected(selected.filter((s) => s !== select))
                }
                removable
              >
                {select}
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
                      checked={selected.includes(obj.id)}
                      onClick={() => handleCheckboxClick(obj.id)}
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
            onChange={(e) =>
              setData((f) => ({ ...f, name: e?.toString() ?? '' }))
            }
          />

          <TextInput
            labelText={t('namespace-with-examples')}
            visualPlaceholder={t('input-uri-namespace')}
            fullWidth
            onChange={(e) =>
              setData((f) => ({ ...f, namespace: e?.toString() ?? '' }))
            }
          />

          <TextInput
            labelText={t('prefix-in-this-service')}
            visualPlaceholder={t('input-data-model-prefix')}
            fullWidth
            onChange={(e) =>
              setData((f) => ({ ...f, prefix: e?.toString() ?? '' }))
            }
          />
        </ContentWrapper>
      </ModalContent>
    );
  }
}
