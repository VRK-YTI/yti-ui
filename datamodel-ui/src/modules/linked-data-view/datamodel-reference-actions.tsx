import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import {
  ActionMenu,
  ActionMenuItem,
  Button,
  Dropdown,
  DropdownItem,
  InlineAlert,
  LoadingSpinner,
  ModalFooter,
  ModalTitle,
  Text,
} from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';
import { useChangeNamespaceVersionMutation } from '@app/common/components/namespaces/namespaces.slice';
import { useState } from 'react';
import { useGetPriorVersionsQuery } from '@app/common/components/model/model.slice';
import { InternalNamespace } from '@app/common/interfaces/model.interface';
import { translateStatus } from '@app/common/utils/translation-helpers';
import getApiError from '@app/common/utils/get-api-errors';

export default function DatamodelReferenceActions({
  prefix,
  namespace,
}: {
  prefix: string;
  namespace: InternalNamespace;
}) {
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('admin');
  const [newVersion, setNewVersion] = useState('');
  const [visible, setVisible] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [changeVersion, result] = useChangeNamespaceVersionMutation();
  const { data: versions } = useGetPriorVersionsQuery(
    { modelId: namespace.prefix },
    { skip: !visible }
  );

  const handlePost = () => {
    setUserPosted(true);
    changeVersion({
      prefix,
      referenceURI: namespace.namespace,
      newVersion: newVersion,
    });
  };

  const handleUpdateVersion = (version: string) => {
    setNewVersion(version);
  };

  function renderChooseReferenceVersion() {
    return (
      <>
        <SimpleModalContent>
          <ModalTitle>{t('change-reference-model-version')}</ModalTitle>
          <Text>
            {t('change-reference-version-description', {
              namespace: namespace.namespace,
            })}
          </Text>
          <div style={{ marginBottom: '20px' }}>
            {versions && (
              <Dropdown
                labelText={t('change-reference-select-version')}
                onChange={(v) => handleUpdateVersion(v)}
              >
                {versions.map((version) => (
                  <DropdownItem
                    key={version.versionIri}
                    value={version.version}
                  >
                    {`${version.version} - ${translateStatus(
                      version.status,
                      t
                    )}`}
                  </DropdownItem>
                ))}
                <DropdownItem value="">
                  {translateStatus('DRAFT', t)}
                </DropdownItem>
              </Dropdown>
            )}
          </div>
        </SimpleModalContent>
        <ModalFooter>
          <Button onClick={handlePost}>{t('save')}</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </>
    );
  }

  function renderChooseReferenceVersionProcess() {
    return (
      <>
        <SimpleModalContent>
          <ModalTitle>{t('change-reference-model-version')}</ModalTitle>
          {result.isLoading && <LoadingSpinner text="" />}
          {result.isError && (
            <InlineAlert status="error">
              {getApiError(result.error)}
            </InlineAlert>
          )}
          {result.isSuccess && <Text>{t('change-reference-updated')}</Text>}
        </SimpleModalContent>
        <ModalFooter>
          <Button
            onClick={() => {
              setVisible(false);
              setUserPosted(false);
            }}
          >
            {t('close', { ns: 'common' })}
          </Button>
        </ModalFooter>
      </>
    );
  }

  return (
    <>
      <ActionMenu buttonVariant="secondary">
        <ActionMenuItem onClick={() => setVisible(true)}>
          {t('change-reference-model-version')}
        </ActionMenuItem>
      </ActionMenu>

      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
      >
        {!userPosted
          ? renderChooseReferenceVersion()
          : renderChooseReferenceVersionProcess()}
      </NarrowModal>
    </>
  );
}
