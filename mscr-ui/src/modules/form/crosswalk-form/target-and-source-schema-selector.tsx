import { SingleSelect, TextInput } from 'suomifi-ui-components';
import { DropdownItem } from 'suomifi-ui-components';
import { CrosswalkFormType } from '@app/common/interfaces/crosswalk.interface';
import * as React from 'react';
import {
  useGetPublicSchemasQuery,
  useGetSchemaQuery,
} from '@app/common/components/schema/schema.slice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MscrSearchResult } from '@app/common/interfaces/search.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { ModelFormContainer } from '@app/modules/form/form.styles';
import { useTranslation } from 'next-i18next';
import {
  Format,
  formatsAvailableForCrosswalkCreation,
  formatsAvailableForCrosswalkRegistration
} from '@app/common/interfaces/format.interface';
import {CrosswalkModal, WideDropdown, WideSingleSelect} from "@app/modules/form/crosswalk-form/crosswalk-form.styles";

interface CrosswalkFormProps {
  formData: CrosswalkFormType;
  setFormData: (value: CrosswalkFormType) => void;
  createNew: boolean;
  schemaSelectorDisabled?: boolean;
}

interface SelectableSchema {
  labelText: string;
  uniqueItemId: string;
  organization: string;
}

interface SelectableWorkspace {
  labelText: string;
  uniqueItemId: string;
}

export default function TargetAndSourceSchemaSelector({
  formData,
  setFormData,
  createNew,
  schemaSelectorDisabled,
}: CrosswalkFormProps) {
  const formatRestrictions = createNew
    ? formatsAvailableForCrosswalkCreation
    : [];
  const { data, isSuccess } = useGetPublicSchemasQuery(formatRestrictions);

  const { data: sourceSchemaData } = useGetSchemaQuery(
    formData.sourceSchema,
    { skip: !schemaSelectorDisabled }
  );
  const { data: targetSchemaData } = useGetSchemaQuery(
    formData.targetSchema,
    { skip: !schemaSelectorDisabled }
  );
  //defaultSchemas.push({ labelText: 'test', uniqueItemId: 'test'});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [defaultSchemas, setDefaultSchemas] = useState(
    Array<SelectableSchema>()
  );
  const [sourceSchemas, setSourceSchemas] = useState(
    Array<SelectableSchema>()
  );
  const [targetSchemas, setTargetSchemas] = useState(
    Array<SelectableSchema>()
  );

  const workspaceValuesInit: SelectableWorkspace[] = [];
  const [workspaceValues, setWorkspaceValues] = useState<SelectableWorkspace[]>(workspaceValuesInit);

  const [selectedSourceWorkspace, setSelectedSourceWorkspace] = useState<string>('');
  const [selectedTargetWorkspace, setSelectedTargetWorkspace] = useState<string>('');

  const [defaultSourceSchema, setDefaultSourceSchema] = useState('');
  const [defaultTargetSchema, setDefaultTargetSchema] = useState('');
  const router = useRouter();
  const lang = router.locale ?? '';
  const { t } = useTranslation('common');

  useEffect(() => {
    if (schemaSelectorDisabled && sourceSchemaData && targetSchemaData) {
      setDefaultSourceSchema(getLanguageVersion({
        data: sourceSchemaData.label,
        lang,
      }));
      setDefaultTargetSchema(getLanguageVersion({
        data: targetSchemaData.label,
        lang,
      }));
    }
  }, [lang, schemaSelectorDisabled, sourceSchemaData, targetSchemaData]);

  const workspaceValuesPersonalCrosswalks: SelectableWorkspace[] = [
    {
      labelText: 'All',
      uniqueItemId: 'all',
    },
    {
      labelText: 'Personal workspace',
      uniqueItemId: 'personalWorkspace',
    },
  ];

  const workspaceValuesGroupCrosswalks: SelectableWorkspace[] = [
    {
      labelText: 'All',
      uniqueItemId: 'all',
    },
    {
      labelText: 'Group workspace',
      uniqueItemId: 'groupWorkspace',
    },
  ];

  useEffect(() => {
    const fetchedSchemas: SelectableSchema[] = [];
    data?.hits.hits.forEach((item: MscrSearchResult) => {
      const label = getLanguageVersion({
        data: item._source.label,
        lang,
      });
      const schema = { labelText: label, uniqueItemId: item._source.id, organization: item._source.organizations.length > 0 ? item._source.organizations[0].id : '' };
      fetchedSchemas.push(schema);
    });
    setDefaultSchemas(fetchedSchemas);
    setSourceSchemas(fetchedSchemas);
    setTargetSchemas(fetchedSchemas);
    setDataLoaded(true);

    if (router.asPath.includes('personal')) {
      setWorkspaceValues([...workspaceValuesPersonalCrosswalks]);
    } else {
      setWorkspaceValues([...workspaceValuesGroupCrosswalks]);
    }
  }, [data?.hits.hits, isSuccess, lang]);

  useEffect(() => {
      if (selectedSourceWorkspace === 'all'){
        setSourceSchemas(defaultSchemas);
      }
      else if (selectedSourceWorkspace === 'personalWorkspace'){
        setSourceSchemas(defaultSchemas.filter(item => item.organization === ''));
      }
      else {
        setSourceSchemas(defaultSchemas.filter(item => item.organization !== ''));
      }
  }, [selectedSourceWorkspace]);

  useEffect(() => {
    if (selectedTargetWorkspace === 'all'){
      setTargetSchemas(defaultSchemas);
    }
    else if (selectedTargetWorkspace === 'personalWorkspace'){
      setTargetSchemas(defaultSchemas.filter(item => item.organization === ''));
    }
    else {
      setTargetSchemas(defaultSchemas.filter(item => item.organization !== ''));
    }
  }, [selectedTargetWorkspace]);

  function setSource(selectedSchemaId: string | null) {
    if (selectedSchemaId) {
      setFormData({
        ...formData,
        sourceSchema: selectedSchemaId,
      });
    }
  }

  function setTarget(selectedSchemaId: string | null) {
    if (selectedSchemaId) {
      setFormData({
        ...formData,
        targetSchema: selectedSchemaId,
      });
    }
  }

  return (
    <ModelFormContainer>
      <CrosswalkModal>
        {dataLoaded && (
          <>
            <div className="row mt-2">
              <div className="col-6">
                {!schemaSelectorDisabled && (
                  <>
                    <div className='mb-3'>
                      <WideDropdown
                        labelText={'Source schema workspace'}
                        defaultValue={'all'}
                        onChange={(e: any) => {
                          setSelectedSourceWorkspace(e);
                        }}
                      >
                        {workspaceValues.map((format) => (
                          <DropdownItem key={format.labelText} value={format.uniqueItemId}>
                            {format.labelText}
                          </DropdownItem>
                        ))}
                      </WideDropdown>
                    </div>
                    <WideSingleSelect
                      className="source-select-dropdown"
                      labelText="Source schema"
                      hintText=""
                      clearButtonLabel="Clear selection"
                      items={sourceSchemas}
                      visualPlaceholder="Search or select"
                      noItemsText="No items"
                      ariaOptionsAvailableTextFunction={(amount) => amount === 1 ? 'option available' : 'options available'}
                      onItemSelect={setSource}/></>
                )}
                {schemaSelectorDisabled && (
                  <TextInput
                    labelText={t('metadata.source-schema')}
                    disabled
                    defaultValue={defaultSourceSchema}
                  />
                )}
                {/*<Box*/}
                {/*  className="source-select-info-box"*/}
                {/*  sx={{ height: 180, flexGrow: 1 }}*/}
                {/*>*/}
                {/*  <div>*/}
                {/*    <p className="mx-2">Select a schema to see properties.</p>*/}
                {/*  </div>*/}
                {/*</Box>*/}
              </div>

              <div className="col-6">
                {!schemaSelectorDisabled && (
                  <>
                    <div className='mb-3'>
                      <WideDropdown
                        labelText={'Target schema workspace'}
                        defaultValue={'all'}
                        onChange={(e: any) => {
                          setSelectedTargetWorkspace(e);
                        }}
                      >
                        {workspaceValues.map((format) => (
                          <DropdownItem key={format.labelText} value={format.uniqueItemId}>
                            {format.labelText}
                          </DropdownItem>
                        ))}
                      </WideDropdown>
                    </div>
                    <WideSingleSelect
                      className="source-select-dropdown"
                      labelText="Target schema"
                      hintText=""
                      clearButtonLabel="Clear selection"
                      items={targetSchemas}
                      visualPlaceholder="Search or select"
                      noItemsText="No items"
                      ariaOptionsAvailableTextFunction={(amount) => amount === 1 ? 'option available' : 'options available'}
                      onItemSelect={setTarget}/></>
                  )}
                {schemaSelectorDisabled && (
                  <TextInput
                  labelText={t('metadata.target-schema')}
                  disabled
                  defaultValue={defaultTargetSchema}
                  />
                  )}
                {/*<Box*/}
                {/*  className="source-select-info-box"*/}
                {/*  sx={{ height: 180, flexGrow: 1 }}*/}
                {/*>*/}
                {/*  <div>*/}
                {/*    <p className="mx-2">Select a schema to see properties.</p>*/}
                {/*  </div>*/}
                {/*</Box>*/}
              </div>
            </div>
          </>
        )}
      </CrosswalkModal>
    </ModelFormContainer>
  );
}
