import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import getOrganizations from '@app/common/utils/get-organizations';
import getServiceCategories from '@app/common/utils/get-service-categories';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  Label,
  RadioButton,
  RadioButtonGroup,
  Text,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import { ModelFormContainer } from './crosswalk-form.styles';
import { FormErrors } from './validate-form';
import {
  CrosswalkFormMockupType,
  CrosswalkFormType,
} from '@app/common/interfaces/crosswalk.interface';
import { FormUpdateErrors } from '../schema-form/validate-form-update';
import * as React from 'react';
import { SingleSelect, SingleSelectData } from 'suomifi-ui-components';
import { MultiSelect } from 'suomifi-ui-components';
import Box from '@mui/material/Box';

interface CrosswalkFormProps {
  formData: CrosswalkFormMockupType;
  setFormData: (value: CrosswalkFormMockupType) => void;
  userPosted: boolean;
  disabled?: boolean;
  errors?: FormErrors | FormUpdateErrors;
  editMode?: boolean;
}

const allValues: any = [];

export default function CrosswalkForm({
  formData,
  setFormData,
  userPosted,
  disabled,
  errors,
  editMode,
}: CrosswalkFormProps) {
  let selectedValues = React.useMemo(
    () => allValues.filter((v) => v.selected),
    [allValues]
  );
  const { t, i18n } = useTranslation('admin');
  const { data: serviceCategoriesData } = useGetServiceCategoriesQuery(
    i18n.language
  );

  //TODO: get users schema list
  const defaultSchemas = [
    { labelText: 'Default schema 1', uniqueItemId: 'asd123' },
    { labelText: 'Test schema 2', uniqueItemId: 'asd234' },
  ];

  function setSource(value: any) {
    setFormData({
      ...formData,
      sourceSchema: value,
    });
  }

  function setTarget(value: any) {
    setFormData({
      ...formData,
      targetSchema: value,
    });
  }

  function setName(value: any) {
    setFormData({
      ...formData,
      name: value,
    });
  }

  function setDescription(value: any) {
    setFormData({
      ...formData,
      description: value,
    });
  }

  return (
    <ModelFormContainer>
      <div className="crosswalk-selection-modal">
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
            <Box
              className="source-select-info-box"
              sx={{ height: 180, flexGrow: 1 }}
            >
              <div>
                <p className="mx-2">Select a schema to see properties.</p>
              </div>
            </Box>
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
            <Box
              className="source-select-info-box"
              sx={{ height: 180, flexGrow: 1 }}
            >
              <div>
                <p className="mx-2">Select a schema to see properties.</p>
              </div>
            </Box>
          </div>

          <div className="col-6">
            <div className="my-4">
              <TextInput
                onBlur={(value) => setName(event.target.value)}
                labelText="Name"
                defaultValue=""
              />
            </div>
          </div>
          <div className="col-6">
            <div className="my-4">
              <Textarea
                onBlur={(value) => setDescription(event.target.value)}
                labelText="Description"
                resize="vertical"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </ModelFormContainer>
  );
}
