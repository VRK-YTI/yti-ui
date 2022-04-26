import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Separator from '@app/common/components/separator';
import { Button } from 'suomifi-ui-components';
import { DefinitionTextarea, ExpanderBlock, H2Sm, SubjectTextInput } from './concept-basic-information.styles';
import ConceptDiagramsAndSources from './concept-diagrams-and-sources';
import OtherInformation from './other-information';
import OrganizationInformation from './organizational-information';
import RelationalInformation from './relational-information';

export default function ConceptBasicInformation() {

  return (
    <>
      <Separator isLarge />

      <H2Sm variant='h2'>
        Käsitteen perustiedot
      </H2Sm>

      {renderDefinitions()}
      {renderExample()}
      {renderSubject()}
      {renderNote()}

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
        labelText={`Määritelmä, ${lang}`}
        visualPlaceholder='Kirjoita määritelmä'
      />
    );
  }

  function renderExample() {
    return (
      <BasicBlock title='Käyttöesimerkki' extra={
        <BasicBlockExtraWrapper>
          <Button variant='secondary'>Lisää uusi käyttöesimerkki</Button>
        </BasicBlockExtraWrapper>
      }>
        Käyttöesimerkki on esimerkki käsitteen käytöstä.
      </BasicBlock>
    );
  }

  function renderSubject() {
    return (
      <SubjectTextInput
        labelText='Aihealue'
        hintText='Voit määritellä käsitteelle aihealueen, johon se kuuluu.'
        visualPlaceholder='Kirjoita aihealueen nimi'
      />
    );
  }

  function renderNote() {
    return (
      <BasicBlock title='Huomautus' extra={
        <BasicBlockExtraWrapper>
          <Button variant='secondary'>Lisää uusi huomautus</Button>
        </BasicBlockExtraWrapper>
      }>
        Voit lisätä liittyvän muun huomautuksen. Älä lisää tähän tietoja, joille on olemassa oma kohtansa lomakkeella.
      </BasicBlock>
    );
  }
}
