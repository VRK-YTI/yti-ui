import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Separator from '@app/common/components/separator';
import { Button } from 'suomifi-ui-components';
import { DefinitionTextarea, ExpanderBlock, H2Sm, SubjectTextInput } from './concept-basic-information.styles';
import ConceptDiagramsAndSources from './concept-diagrams-and-sources';
import OtherInformation from './other-information';
import OrganizationInformation from './organizational-information';
import RelationalInformation from './relational-information';
import { useTranslation } from 'next-i18next';
import { Notes } from './notes';

export default function ConceptBasicInformation() {
  const { t } = useTranslation('admin');

  return (
    <>
      <Separator isLarge />

      <H2Sm variant='h2'>
        {t('concept-basic-information')}
      </H2Sm>

      {renderDefinitions()}
      {renderExample()}
      {renderSubject()}

      <Notes />

      <ExpanderBlock>
        <ConceptDiagramsAndSources />
        <OrganizationInformation />
        <OtherInformation />
        <RelationalInformation />
      </ExpanderBlock>
    </>
  );

  function renderDefinitions() {
    return (
      <>
        {renderDefinitionTextarea('fi')}
        {renderDefinitionTextarea('sv')}
        {renderDefinitionTextarea('en')}
      </>
    );
  }

  function renderDefinitionTextarea(lang: string) {
    return (
      <DefinitionTextarea
        labelText={t('definition-label-text', { lang: lang, langUpper: lang.toUpperCase() })}
        optionalText={t('optional')}
        visualPlaceholder={t('give-definition')}
      />
    );
  }

  function renderExample() {
    return (
      <BasicBlock
        title={t('example')}
        extra={
          <BasicBlockExtraWrapper>
            <Button variant='secondary'>{t('add-new-example')}</Button>
          </BasicBlockExtraWrapper>
        }
      >
        {t('example-description')}
      </BasicBlock>
    );
  }

  function renderSubject() {
    return (
      <SubjectTextInput
        labelText={t('subject')}
        hintText={t('subject-hint-text')}
        visualPlaceholder={t('subject-visual-placeholder')}
      />
    );
  }
}
