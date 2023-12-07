import {useGetServiceCategoriesQuery} from '@app/common/components/service-categories/service-categories.slice';
import {useTranslation} from 'next-i18next';
import {Textarea, TextInput} from 'suomifi-ui-components';
import {ModelFormContainer} from './crosswalk-form.styles';
import {FormErrors} from './validate-form';
import {CrosswalkFormMockupType, CrosswalkFormType} from '@app/common/interfaces/crosswalk.interface';
import {FormUpdateErrors} from '../schema-form/validate-form-update';
import * as React from 'react';
import {SingleSelect} from 'suomifi-ui-components';
import Box from '@mui/material/Box';
import {useGetPublicSchemasQuery} from "@app/common/components/schema/schema.slice";
import {useEffect, useState} from 'react';

interface CrosswalkFormProps {
    formData: CrosswalkFormMockupType;
    setFormData: (value: { targetSchema: string; versionLabel?: string; languages: any; format: string; organizations: any; namespace?: string; description?: any; pid?: string; state: string | undefined; label: any; sourceSchema: string; status?: string | undefined }) => void;
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
    const {t, i18n} = useTranslation('admin');
    const {data: serviceCategoriesData} = useGetServiceCategoriesQuery(
        i18n.language
    );
    const {data, isLoading, isSuccess, isError, error} =
        useGetPublicSchemasQuery('');

    const defaultSchemasInit: { labelText: any; uniqueItemId: any; }[] = [];
    const defaultSchemas2: { labelText: any; uniqueItemId: any; }[] = [];
    //defaultSchemas.push({ labelText: 'test', uniqueItemId: 'test'});
    const [dataLoaded, setDataLoaded] = useState(false);
    const [defaultSchemas, setDefaultSchemas] = useState(defaultSchemasInit);

    useEffect(() => {
        data?.hits.hits.forEach((item: { _source: { label: { [x: string]: any; }; id: any; }; }) => {
            const label = item._source.label['fi'] ? item._source.label['fi'] : item._source.label['en'] ? item._source.label['en'] : '';
            const schema = {labelText: label, uniqueItemId: item._source.id};
            defaultSchemas2.push(schema);
        });
        setDefaultSchemas(defaultSchemas2);
        setDefaultInitValues();
        setDataLoaded(true);
        console.log('schemas', defaultSchemas);

    }, [isSuccess]);

    useEffect(() => {
        console.log('!!!!!!!!! formData', formData);
    }, [formData]);

    function setDefaultInitValues() {
        setFormData({
            ...formData,
            format: 'MSCR',
            state: 'DRAFT',
            status: 'DRAFT',
            versionLabel: '1'
        });
    }

    function setSource(value: any) {
        if (value) {
            setFormData({
                ...formData,
                sourceSchema: value.toString(),
            });
            console.log('SOURCE SET', formData);
        }
    }

    function setTarget(value: any) {
        if (value) {
            setFormData({
                ...formData,
                targetSchema: value.toString(),
            });
            console.log('TARGET SET', formData);
        }
    }

    function setName(value: any) {
        const label = {'en': value}
        setFormData({
            ...formData,
            label: label,
        });
    }

    function setDescription(value: any) {
        const description = {'en': value}
        setFormData({
            ...formData,
            description: description,
        });
    }

    return (
        <ModelFormContainer>
            <div className="crosswalk-selection-modal">
                {dataLoaded &&
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
                                sx={{height: 180, flexGrow: 1}}
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
                                sx={{height: 180, flexGrow: 1}}
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
                }
            </div>
        </ModelFormContainer>
    );
}
