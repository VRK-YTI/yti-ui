import { DropdownItem, TextInput } from 'suomifi-ui-components';
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
import { formatsAvailableForCrosswalkCreation } from '@app/common/interfaces/format.interface';
import {
  CrosswalkModal,
  WideDropdown,
  WideSingleSelect,
} from '@app/modules/form/crosswalk-form/crosswalk-form.styles';

import { selectLogin } from '@app/common/components/login/login.slice';
import { useSelector } from 'react-redux';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { FormType } from '@app/common/utils/hooks/use-initial-form';

interface CrosswalkFormProps {
  formData: FormType;
  setFormData: (value: FormType) => void;
  createNew: boolean;
  schemaSelectorDisabled?: boolean;
  groupWorkspacePid: string | undefined;
}

interface SelectableSchema {
  labelText: string;
  uniqueItemId: string;
  organizationIds: string[];
  owner: string[];
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
  groupWorkspacePid,
}: CrosswalkFormProps) {
  const user: User = useSelector(selectLogin());
  const formatRestrictions = createNew
    ? formatsAvailableForCrosswalkCreation
    : [];
  const { data, isSuccess } = useGetPublicSchemasQuery(formatRestrictions);

  const { data: sourceSchemaData } = useGetSchemaQuery(
    formData.sourceSchema ?? '',
    {
      skip: !schemaSelectorDisabled,
    }
  );
  const { data: targetSchemaData } = useGetSchemaQuery(
    formData.targetSchema ?? '',
    {
      skip: !schemaSelectorDisabled,
    }
  );
  //defaultSchemas.push({ labelText: 'test', uniqueItemId: 'test'});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [defaultSchemas, setDefaultSchemas] = useState(
    Array<SelectableSchema>()
  );
  const [sourceSchemas, setSourceSchemas] = useState(Array<SelectableSchema>());
  const [targetSchemas, setTargetSchemas] = useState(Array<SelectableSchema>());

  const workspaceValuesInit: SelectableWorkspace[] = [];
  const [workspaceValues, setWorkspaceValues] =
    useState<SelectableWorkspace[]>(workspaceValuesInit);

  const [selectedSourceWorkspace, setSelectedSourceWorkspace] =
    useState<string>('');
  const [selectedTargetWorkspace, setSelectedTargetWorkspace] =
    useState<string>('');

  const [defaultSourceSchema, setDefaultSourceSchema] = useState('');
  const [defaultTargetSchema, setDefaultTargetSchema] = useState('');
  const router = useRouter();
  const lang = router.locale ?? '';
  const { t } = useTranslation('common');

  useEffect(() => {
    if (schemaSelectorDisabled && sourceSchemaData && targetSchemaData) {
      setDefaultSourceSchema(
        getLanguageVersion({
          data: sourceSchemaData.label,
          lang,
        })
      );
      setDefaultTargetSchema(
        getLanguageVersion({
          data: targetSchemaData.label,
          lang,
        })
      );
    }
  }, [lang, schemaSelectorDisabled, sourceSchemaData, targetSchemaData]);

  const workspaceValuesPersonalCrosswalks: SelectableWorkspace[] = [
    {
      labelText: t('crosswalk-form.all'),
      uniqueItemId: 'all',
    },
    {
      labelText: t('crosswalk-form.personal-workspace'),
      uniqueItemId: 'personalWorkspace',
    },
  ];

  const workspaceValuesGroupCrosswalks: SelectableWorkspace[] = [
    {
      labelText: t('crosswalk-form.all'),
      uniqueItemId: 'all',
    },
    {
      labelText: t('crosswalk-form.group-workspace'),
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

      const schema = {
        labelText: label,
        uniqueItemId: item._source.id,
        organizationIds:
          item._source.organizations.length > 0
            ? item._source.organizations.map((organization) => organization.id)
            : [''],
        owner:
          item._source?.owner && item._source?.owner?.length > 0
            ? item._source.owner
            : [],
      };
      fetchedSchemas.push(schema);
    });
    setDefaultSchemas(fetchedSchemas);
    setSourceSchemas(fetchedSchemas);
    setTargetSchemas(fetchedSchemas);
    setDataLoaded(true);
    setSelectedSourceWorkspace('all');
    setSelectedTargetWorkspace('all');

    if (router.asPath.includes('personal')) {
      setWorkspaceValues([...workspaceValuesPersonalCrosswalks]);
    } else {
      setWorkspaceValues([...workspaceValuesGroupCrosswalks]);
    }
  }, [data?.hits.hits, isSuccess, lang]);

  useEffect(() => {
    if (selectedSourceWorkspace === 'all') {
      setSourceSchemas(defaultSchemas);
    } else if (selectedSourceWorkspace === 'personalWorkspace') {
      setSourceSchemas(
        defaultSchemas.filter((item) => item.owner.includes(user.id))
      );
    } else {
      setSourceSchemas(
        defaultSchemas.filter((item) => {
          if (groupWorkspacePid) {
            return item.organizationIds.includes(groupWorkspacePid);
          }
        })
      );
    }
  }, [selectedSourceWorkspace, groupWorkspacePid]);

  useEffect(() => {
    if (selectedTargetWorkspace === 'all') {
      setTargetSchemas(defaultSchemas);
    } else if (selectedTargetWorkspace === 'personalWorkspace') {
      setTargetSchemas(
        defaultSchemas.filter((item) => item.owner.includes(user.id))
      );
    } else {
      setTargetSchemas(
        defaultSchemas.filter((item) => {
          if (groupWorkspacePid) {
            return item.organizationIds.includes(groupWorkspacePid);
          }
        })
      );
    }
  }, [selectedTargetWorkspace, groupWorkspacePid]);

  function setSource(selectedSchemaId: string | null) {
      setFormData({
        ...formData,
        sourceSchema: selectedSchemaId ?? '',
      });
  }

  function setTarget(selectedSchemaId: string | null) {
      setFormData({
        ...formData,
        targetSchema: selectedSchemaId ?? '',
      });
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
                    <div className="mb-3">
                      <WideDropdown
                        labelText={t('crosswalk-form.source-schema-workspace')}
                        defaultValue={'all'}
                        onChange={(e: string) => {
                          setSelectedSourceWorkspace(e);
                        }}
                      >
                        {workspaceValues.map((format) => (
                          <DropdownItem
                            key={format.labelText}
                            value={format.uniqueItemId}
                          >
                            {format.labelText}
                          </DropdownItem>
                        ))}
                      </WideDropdown>
                    </div>
                    <WideSingleSelect
                      className="source-select-dropdown"
                      labelText={t('metadata.source-schema')}
                      hintText=""
                      clearButtonLabel={t('crosswalk-form.clear-selection')}
                      items={sourceSchemas}
                      visualPlaceholder={t('crosswalk-form.search-or-select')}
                      noItemsText={t('crosswalk-form.no-items')}
                      ariaOptionsAvailableTextFunction={(amount) =>
                        amount === 1
                          ? t('crosswalk-form.option-available')
                          : t('crosswalk-form.options-available')
                      }
                      onItemSelect={setSource}
                    />
                  </>
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
                    <div className="mb-3">
                      <WideDropdown
                        labelText={t('crosswalk-form.target-schema-workspace')}
                        defaultValue={'all'}
                        onChange={(e: string) => {
                          setSelectedTargetWorkspace(e);
                        }}
                      >
                        {workspaceValues.map((format) => (
                          <DropdownItem
                            key={format.labelText}
                            value={format.uniqueItemId}
                          >
                            {format.labelText}
                          </DropdownItem>
                        ))}
                      </WideDropdown>
                    </div>
                    <WideSingleSelect
                      className="source-select-dropdown"
                      labelText={t('metadata.target-schema')}
                      hintText=""
                      clearButtonLabel={t('crosswalk-form.clear-selection')}
                      items={targetSchemas}
                      visualPlaceholder={t('crosswalk-form.search-or-select')}
                      noItemsText={t('crosswalk-form.no-items')}
                      ariaOptionsAvailableTextFunction={(amount) =>
                        amount === 1
                          ? t('crosswalk-form.option-available')
                          : t('crosswalk-form.options-available')
                      }
                      onItemSelect={setTarget}
                    />
                  </>
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
