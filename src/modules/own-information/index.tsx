import { Heading } from 'suomifi-ui-components';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
import { useTranslation } from 'next-i18next';
import { HeadingBlock, MainContent, OrganizationAndRoles, OrganizationAndRolesHeading, OrganizationAndRolesItem, OrganizationAndRolesWrapper, PageContent } from './own-information.styles';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import { useEffect, useRef } from 'react';
import { BasicBlock } from '../../common/components/block';
import { useSelector } from 'react-redux';
import { selectLogin } from '../../common/components/login/login-slice';
import Separator from '../../common/components/separator';

export default function OwnInformation() {
  const user = useSelector(selectLogin());
  const { breakpoint } = useBreakpoints();
  const { t } = useTranslation('own-information');

  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url="/own-information" current>
          {t('own-information')}
        </BreadcrumbLink>
      </Breadcrumb>

      <PageContent breakpoint={breakpoint}>
        <MainContent id="main">
          <HeadingBlock>
            <Heading variant="h1" tabIndex={-1} ref={titleRef}>
              {t('own-information')}
            </Heading>
          </HeadingBlock>

          <BasicBlock title={<h2>{t('field-name')}</h2>}>
            {`${user.firstName} ${user.lastName}`}
          </BasicBlock>
          <BasicBlock title={<h2>{t('field-email')}</h2>}>
            {user.email}
          </BasicBlock>

          <Separator isLarge />

          <BasicBlock title={<h2>{t('field-organizations-and-roles')}</h2>} largeGap>
            <OrganizationAndRolesWrapper>
              <OrganizationAndRoles>
                <OrganizationAndRolesItem>
                  <OrganizationAndRolesHeading>Organisaatio</OrganizationAndRolesHeading>
                  <div>Digi- ja Väestötietovirasto</div>
                </OrganizationAndRolesItem>

                <OrganizationAndRolesItem>
                  <OrganizationAndRolesHeading>Roolit</OrganizationAndRolesHeading>
                  <ul>
                    <li>Sanastotyöntekijä</li>
                    <li>Koodistotyöntekijä</li>
                    <li>Tietomallintaja</li>
                  </ul>
                </OrganizationAndRolesItem>
              </OrganizationAndRoles>
              <OrganizationAndRoles>
                <OrganizationAndRolesItem>
                  <OrganizationAndRolesHeading>Organisaatio</OrganizationAndRolesHeading>
                  <div>Digi- ja Väestötietovirasto</div>
                </OrganizationAndRolesItem>

                <OrganizationAndRolesItem>
                  <OrganizationAndRolesHeading>Roolit</OrganizationAndRolesHeading>
                  <ul>
                    <li>Sanastotyöntekijä</li>
                    <li>Koodistotyöntekijä</li>
                    <li>Tietomallintaja</li>
                  </ul>
                </OrganizationAndRolesItem>
              </OrganizationAndRoles>
            </OrganizationAndRolesWrapper>
          </BasicBlock>

          {/* <MultilingualPropertyBlock
            title={<h2>{t('field-example')}</h2>}
            data={concept?.properties.example}
          /> */}
          {/* <TermBlock
            title={<h2>{t('field-terms-label')}</h2>}
            data={[
              ...(concept?.references.prefLabelXl ?? []).map(term => ({ term, type: t('field-terms-preferred') })),
              ...(concept?.references.altLabelXl ?? []).map(term => ({ term, type: t('field-terms-alternative') })),
              ...(concept?.references.notRecommendedSynonym ?? []).map(term => ({ term, type: t('field-terms-non-recommended') })),
              ...(concept?.references.searchTerm ?? []).map(term => ({ term, type: t('field-terms-search-term') })),
              ...(concept?.references.hiddenTerm ?? []).map(term => ({ term, type: t('field-terms-hidden') })),
            ]}
          /> */}

          {/* <MultilingualPropertyBlock
            title={<h2>{t('field-note')}</h2>}
            data={concept?.properties.note}
          /> */}

          {/* <DetailsExpander concept={concept} /> */}

          {/* <Separator isLarge /> */}

          {/* <VisuallyHidden as="h2">
            {t('additional-technical-information', { ns: 'common' })}
          </VisuallyHidden> */}

          {/* <PropertyBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            property={terminology?.references.contributor?.[0]?.properties.prefLabel}
            fallbackLanguage="fi"
          /> */}
          {/* <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={concept?.createdDate} />, {concept?.createdBy}
          </BasicBlock> */}
          {/* <BasicBlock title={t('vocabulary-info-modified-at', { ns: 'common' })}>
            <FormattedDate date={concept?.lastModifiedDate} />, {concept?.lastModifiedBy}
          </BasicBlock> */}
          {/* <BasicBlock title="URI">
            {concept?.uri}
          </BasicBlock> */}

          {/* <Separator isLarge /> */}

          {/* <BasicBlock
            extra={
              <ExternalLink
                href={`mailto:${getPropertyValue({ property: terminology?.properties.contact })}?subject=${conceptId}`}
                labelNewWindow={t('site-open-link-new-window', { ns: 'common' })}
              >
                {t('feedback-action')}
              </ExternalLink>
            }
          >
            {t('feedback-label')}
          </BasicBlock> */}
        </MainContent>
      </PageContent>
    </>
  );
};
