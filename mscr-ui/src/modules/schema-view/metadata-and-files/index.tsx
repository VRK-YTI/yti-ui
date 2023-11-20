import {useTranslation} from 'next-i18next';
import {useMemo} from 'react';
import {Schema} from '@app/common/interfaces/schema.interface';
import router from 'next/router';

export default function MetadataAndFiles({ schemaDetails }: { schemaDetails?: Schema }) {
  const { t } = useTranslation('common');
  const lang = router.query.lang;

  // TODO: Only edit with permission, we have util has-permission
  // TODO: Get organization names neatly
  // Locale: Object.entries(schemaDetails.label).find((t) => t[0] === lang)?.[1] ?? ''
  // Organization: see datamodel-ui/src/modules/model/model-info-view.tsx
  interface SchemaDisplay {
    [key:string]: string;
  }
  const schemaDisplay : SchemaDisplay = useMemo(() => {
    if (!schemaDetails) {
      return (
        {
          schemaPid: '',
          schemaLabel: '',
          schemaDescription: '',
          schemaCreated: '',
          schemaModified: '',
          schemaState: '',
          schemaOrganizations: '',
          schemaVisibility: '',
          schemaFormat: '',
          schemaVersionLabel: '',
          schemaNamespace: ''
        }
      );
    }

    return (
      {
        schemaPid: schemaDetails?.pid ?? '',
        schemaLabel: schemaDetails?.label ? Object.entries(schemaDetails.label).find((t) => t[0] === lang)?.[1] ?? '' : '',
        schemaDescription: schemaDetails?.description ? Object.entries(schemaDetails.description).find((t) => t[0] === lang)?.[1] ?? '' : '',
        schemaCreated: schemaDetails?.created ?? '',
        schemaModified: schemaDetails?.modified ?? '',
        schemaState: schemaDetails?.state ?? '',
        schemaOrganizations: schemaDetails?.organizations.toString() ?? '',
        schemaVisibility: schemaDetails?.visibility ?? '',
        schemaFormat: schemaDetails?.format ?? '',
        schemaVersionLabel: schemaDetails?.versionLabel ?? '',
        schemaNamespace: schemaDetails?.namespace ?? ''
      }
    );
  }, [schemaDetails, lang]);

  return (
    <>
      <dl>
        <dt>
          {t('schema.name')}
        </dt>
        <dd>
          {schemaDisplay.schemaLabel}
        </dd>
      </dl>
      <div className='crosswalk-editor mx-2'>
        <h2 className='mt-4 mb-3'>Crosswalk details</h2>
        <div className='row d-flex justify-content-between metadata-and-files-wrap mx-2'>
          <div className='row bg-light-blue'>
            <div className='col-6'>
              <div className='my-3'> Name: <span></span></div>
              <div className='my-3'> Description: <span>{schemaDisplay.schemaDescription}</span></div>
              <div className='my-3'> PID: <span>{schemaDisplay.schemaPid}</span></div>
              <div className='my-3'> Version: <span>{schemaDisplay.schemaVersionLabel}</span></div>
              <div className='my-3'> Created: <span>{schemaDisplay.schemaCreated}</span></div>
              <div className='my-3'> Modified: <span>{schemaDisplay.schemaModified}</span></div>
              <div className='my-3'> State: <span>{schemaDisplay.schemaState}</span></div>
              <div className='my-3'> Visibility: <span>{schemaDisplay.schemaVisibility}</span></div>
              <div className='my-3'> Format: <span>{schemaDisplay.schemaFormat}</span></div>
              <div className='my-3'> Namespace: <span>{schemaDisplay.schemaNamespace}</span></div>
              <div className='my-3'> Organizations: <span>{schemaDisplay.schemaOrganizations}</span></div>
            </div>
          </div>
        </div>
        <h2 className='mt-4 mb-3'>Files</h2>
        <div className='row d-flex justify-content-between metadata-and-files-wrap mx-2'>
          <br/>

          <div>TABLE HERE{/* TODO: Display schema files */}</div>
        </div>
      </div>
    </>
  );
}
