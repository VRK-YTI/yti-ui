import { SingleSelect } from 'suomifi-ui-components';
import { CrosswalkFormType } from '@app/common/interfaces/crosswalk.interface';
import * as React from 'react';
import { useGetPublicSchemasQuery } from '@app/common/components/schema/schema.slice';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MscrSearchResult } from '@app/common/interfaces/search.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { ModelFormContainer } from '@app/modules/form/form.styles';
import { formatsAvailableForCrosswalkCreation } from '@app/common/interfaces/format.interface';

interface CrosswalkFormProps {
  formData: CrosswalkFormType;
  setFormData: Dispatch<SetStateAction<CrosswalkFormType>>;
  createNew: boolean;
}

interface SelectableSchema {
  labelText: string;
  uniqueItemId: string;
}

export default function TargetAndSourceSchemaSelector({
  formData,
  setFormData,
  createNew,
}: CrosswalkFormProps) {
  const formatRestrictions = createNew
    ? formatsAvailableForCrosswalkCreation
    : [];
  const { data, isSuccess } = useGetPublicSchemasQuery(formatRestrictions);
  //defaultSchemas.push({ labelText: 'test', uniqueItemId: 'test'});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [defaultSchemas, setDefaultSchemas] = useState(
    Array<SelectableSchema>()
  );
  const router = useRouter();
  const lang = router.locale ?? '';

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
