import { useState } from 'react';
import { Button, IconPlus } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import {
  ExternalNamespace,
  InternalNamespace,
} from '@app/common/interfaces/model.interface';
import ExternalForm from './external-form';
import ListForm from './list-form';

export default function LinkedModel({
  initialData,
  setInternalData,
  setExternalData,
  currentModel,
  languages,
  applicationProfile,
}: {
  initialData: {
    internalNamespaces: InternalNamespace[];
  };
  setInternalData: (value: InternalNamespace[]) => void;
  setExternalData: (value: ExternalNamespace) => void;
  currentModel: string;
  languages: string[];
  applicationProfile?: boolean;
}) {
  const { t } = useTranslation('admin');
  const [listVisible, setListVisible] = useState(false);
  const [extFormVisible, setExtFormVisible] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [data, setData] = useState({
    name: languages.reduce(
      (n, lang) => Object.assign(n, { [lang]: '' }),
      {}
    ) as { [key: string]: string },
    namespace: '',
    prefix: '',
  });
  const [selected, setSelected] = useState<InternalNamespace[]>([]);

  const handleClose = () => {
    setSelected([]);
    setData({
      name: {},
      namespace: '',
      prefix: '',
    });
    setUserPosted(false);
    setListVisible(false);
    setExtFormVisible(false);
  };

  const handleSubmit = () => {
    if (!userPosted) {
      setUserPosted(true);
    }

    if (extFormVisible) {
      setExternalData({
        ...data,
        namespace:
          !data.namespace.startsWith('http://') &&
          !data.namespace.startsWith('https://')
            ? `http://${data.namespace}`
            : data.namespace,
      });
    } else {
      setInternalData([...initialData.internalNamespaces, ...selected]);
    }

    handleClose();
  };

  return (
    <>
      <Button
        variant="secondary"
        icon={<IconPlus />}
        onClick={() => setListVisible(true)}
        id="add-data-model-button"
      >
        {t('add-data-model')}
      </Button>

      <ListForm
        initialData={initialData}
        modelId={currentModel}
        selected={selected}
        visible={listVisible}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setExternalVisible={() => {
          setExtFormVisible(true);
          setListVisible(false);
        }}
        setSelected={setSelected}
        applicationProfile={applicationProfile}
      />

      <ExternalForm
        data={data}
        setData={setData}
        visible={extFormVisible}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        userPosted={userPosted}
        languages={languages}
      />
    </>
  );
}
