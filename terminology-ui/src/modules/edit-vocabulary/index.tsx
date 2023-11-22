import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import {
  selectLogin,
  useGetAuthenticatedUserMutMutation,
  useGetAuthenticatedUserQuery,
} from '@app/common/components/login/login.slice';
import { useEditTerminologyMutation } from '@app/common/components/modify/modify.slice';
import PropertyValue from '@app/common/components/property-value';
import SaveSpinner from 'yti-common-ui/save-spinner';
import Title from 'yti-common-ui/title';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Heading,
  InlineAlert,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import generateNewTerminology from '../new-terminology/generate-new-terminology';
import InfoManual from '../new-terminology/info-manual';
import MissingInfoAlert from '../new-terminology/missing-info-alert';
import { TallerSeparator } from '../new-terminology/new-terminology.styles';
import {
  FormWrapper,
  FormFooter,
  FormTitle,
  ButtonBlock,
} from './edit-vocabulary.styles';
import generateInitialData from './generate-initial-data';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import {
  TitleType,
  TitleTypeAndStatusWrapper,
} from 'yti-common-ui/title/title.styles';
import { translateTerminologyType } from '@app/common/utils/translation-helpers';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { useStoreDispatch } from '@app/store';
import { setTitle } from '@app/common/components/title/title.slice';
import { StatusChip } from 'yti-common-ui/status-chip';

interface EditVocabularyProps {
  terminologyId: string;
}

export default function EditVocabulary({ terminologyId }: EditVocabularyProps) {
  const { t, i18n } = useTranslation('admin');
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const { data: info, error: infoError } = useGetVocabularyQuery({
    id: terminologyId,
  });
  const user = useSelector(selectLogin());
  const [data, setData] = useState(generateInitialData(i18n.language, info));
  const [isValid, setIsValid] = useState(true);
  const [userPosted, setUserPosted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editTerminology, result] = useEditTerminologyMutation();
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery();
  const [getAuthenticatedMutUser, authenticatedMutUser] =
    useGetAuthenticatedUserMutMutation();

  const handleSubmit = () => {
    getAuthenticatedMutUser();
    setUserPosted(true);
    disableConfirmation();

    if (!data || !isValid) {
      return;
    }

    const newData = generateNewTerminology({
      data: data,
      code: info?.code,
      createdBy: info?.createdBy,
      createdDate: info?.createdDate,
      id: info?.id,
      lastModifiedBy: `${user.firstName} ${user.lastName}`,
      terminologyId: terminologyId,
      uri: info?.uri,
      origin: info?.properties.origin?.[0].value,
    });

    if (!newData) {
      return;
    }
    setIsCreating(true);
    editTerminology(newData);
  };

  const handleReturn = useCallback(() => {
    disableConfirmation();
    router.replace(`/terminology/${terminologyId}`);
  }, [disableConfirmation, router, terminologyId]);

  useEffect(() => {
    if (result.isSuccess) {
      handleReturn();
    }
  }, [result, handleReturn]);

  useEffect(() => {
    dispatch(
      setTitle(
        getPropertyValue({
          property: info?.properties.prefLabel,
          language: i18n.language,
        })
      )
    );
  }, [dispatch, info?.properties.prefLabel, i18n.language]);

  if (infoError || !info) {
    return (
      <>
        <Breadcrumb>
          <BreadcrumbLink url="" current>
            ...
          </BreadcrumbLink>
        </Breadcrumb>
      </>
    );
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url={`/terminology/${terminologyId}`} current>
          <PropertyValue property={info.properties.prefLabel} />
        </BreadcrumbLink>
      </Breadcrumb>

      <Title
        title={getPropertyValue({
          property: info?.properties.prefLabel,
          language: i18n.language,
        })}
        extra={
          <TitleTypeAndStatusWrapper>
            <TitleType>
              {translateTerminologyType(
                info?.properties.terminologyType?.[0].value ??
                  'TERMINOLOGICAL_VOCABULARY',
                t
              )}
            </TitleType>{' '}
            &middot;
            <StatusChip
              status={info?.properties.status?.[0].value ?? 'DRAFT'}
              id="status-chip"
            >
              {translateStatus(
                info?.properties.status?.[0].value ?? 'DRAFT',
                t
              )}
            </StatusChip>
          </TitleTypeAndStatusWrapper>
        }
      />

      <FormWrapper>
        <FormTitle>
          <Heading variant="h3">{t('edit-terminology-info')}</Heading>

          <Paragraph>
            <Text>{t('info-input-description')}</Text>
          </Paragraph>
        </FormTitle>

        <InfoManual
          setIsValid={setIsValid}
          setManualData={setData}
          userPosted={userPosted}
          initialData={data}
          onChange={enableConfirmation}
        />

        <TallerSeparator />

        <FormFooter>
          {(authenticatedUser?.anonymous ||
            authenticatedMutUser.data?.anonymous) && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-occurred_unauthenticated', { ns: 'alert' })}
            </InlineAlert>
          )}
          {userPosted && data && <MissingInfoAlert data={data} />}
          <ButtonBlock>
            <Button
              disabled={
                isCreating ||
                authenticatedUser?.anonymous ||
                authenticatedMutUser.data?.anonymous
              }
              onClick={() => handleSubmit()}
              id="submit-button"
            >
              {t('save')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleReturn()}
              id="cancel-button"
            >
              {t('cancel')}
            </Button>
            {isCreating && <SaveSpinner text={t('saving-terminology')} />}
          </ButtonBlock>
        </FormFooter>
      </FormWrapper>
    </>
  );
}
