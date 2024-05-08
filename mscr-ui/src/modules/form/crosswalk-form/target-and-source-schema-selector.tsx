import { SingleSelect, TextInput } from 'suomifi-ui-components';
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
import { formatsAvailableForCrosswalkCreation } from '@app/common/interfaces/format.interface';
import { useTranslation } from 'next-i18next';

interface CrosswalkFormProps {
  formData: CrosswalkFormType;
  setFormData: (value: CrosswalkFormType) => void;
  createNew: boolean;
  schemaSelectorDisabled?: boolean;
}

interface SelectableSchema {
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

  useEffect(() => {
    const fetchedSchemas: { labelText: string; uniqueItemId: string }[] = [];
    data?.hits.hits.forEach((item: MscrSearchResult) => {
      const label = getLanguageVersion({
        data: item._source.label,
        lang,
      });
      const schema = { labelText: label, uniqueItemId: item._source.id };
      fetchedSchemas.push(schema);
    });
    setDefaultSchemas(fetchedSchemas);
    setDataLoaded(true);
    // console.log('schemas', defaultSchemas);
  }, [data?.hits.hits, isSuccess, lang]);

  function setSource(selectedSchemaId: string | null) {
    if (selectedSchemaId) {
      setFormData({
        ...formData,
        sourceSchema: selectedSchemaId,
      });
      // console.log('SOURCE SET', formData);
    }
  }

  function setTarget(selectedSchemaId: string | null) {
    if (selectedSchemaId) {
      setFormData({
        ...formData,
        targetSchema: selectedSchemaId,
      });
      // console.log('TARGET SET', formData.targetSchema);
    }
  }

  return (
    <ModelFormContainer>
      <div className="crosswalk-selection-modal">
        {dataLoaded && (
          <div className="row">
            <div className="col-6">
              {!schemaSelectorDisabled && (
                <SingleSelect
                  className="source-select-dropdown"
                  labelText="Select source schema"
                  hintText=""
                  clearButtonLabel="Clear selection"
                  items={defaultSchemas}
                  visualPlaceholder="Search or select"
                  noItemsText="No items"
                  ariaOptionsAvailableTextFunction={(amount) =>
                    amount === 1 ? 'option available' : 'options available'
                  }
                  onItemSelect={setSource}
                />
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
                <SingleSelect
                  className="source-select-dropdown"
                  labelText="Select target schema"
                  hintText=""
                  clearButtonLabel="Clear selection"
                  items={defaultSchemas}
                  visualPlaceholder="Search or select"
                  noItemsText="No items"
                  ariaOptionsAvailableTextFunction={(amount) =>
                    amount === 1 ? 'option available' : 'options available'
                  }
                  onItemSelect={setTarget}
                />
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
        )}
      </div>
    </ModelFormContainer>
  );
}
