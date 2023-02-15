import { useState } from 'react';
import { Text } from 'suomifi-ui-components';
import ClassForm from '../class-form';
import ClassModal from '../class-modal';
import { FullwidthSearchInput } from './model.styles';

export default function ClassView() {
  const [view, setView] = useState<'listing' | 'form'>('listing');

  const handleFollowUpAction = (value: any) => {
    setView('form');
  };

  const handleFormReturn = () => {
    setView('listing');
  };

  return (
    <div>
      {renderListing()}
      {renderForm()}
    </div>
  );

  function renderListing() {
    if (view !== 'listing') {
      return <></>;
    }

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Text variant="bold">0 luokkaa</Text>
          <ClassModal handleFollowUp={handleFollowUpAction} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <FullwidthSearchInput
            labelText=""
            clearButtonLabel=""
            searchButtonLabel=""
          />
          <Text>Tietomallissa ei ole vielä yhtään luokkaa.</Text>
        </div>
      </>
    );
  }

  function renderForm() {
    if (view !== 'form') {
      return <></>;
    }

    return <ClassForm handleReturn={handleFormReturn} />;
  }
}
