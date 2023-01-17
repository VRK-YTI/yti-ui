import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  ExternalLink,
  Heading,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import {
  getBaseModelPrefix,
  getIsPartOf,
  getLanguages,
  getLink,
  getUri,
} from '@app/common/utils/get-value';
import { ModelInfoListWrapper, ModelInfoWrapper } from './model.styles';

export default function ModelInfoView() {
  const { i18n } = useTranslation('common');
  const { query } = useRouter();
  const [modelId] = useState(
    Array.isArray(query.modelId) ? query.modelId[0] : query.modelId ?? ''
  );
  const { data: modelInfo } = useGetModelQuery(modelId);

  console.log(modelInfo);

  if (!modelInfo) {
    return <ModelInfoWrapper />;
  }

  return (
    <ModelInfoWrapper>
      <Heading variant="h2">Tiedot</Heading>

      <BasicBlock title="Nimi"></BasicBlock>
      <BasicBlock title="Kuvaus"></BasicBlock>
      <BasicBlock title="Tunnus">{getBaseModelPrefix(modelInfo)}</BasicBlock>
      <BasicBlock title="Tietomallin URI">{getUri(modelInfo)}</BasicBlock>
      <BasicBlock title="Tietoalueet">
        {getIsPartOf(modelInfo, i18n.language).join(', ')}
      </BasicBlock>
      <BasicBlock title="Tietomallin kielet">
        {getLanguages(modelInfo).join(', ')}
      </BasicBlock>

      <BasicBlock title="Käytetyt sanastot">Ei lisätty</BasicBlock>
      <BasicBlock title="Käytetyt koodistot">Ei lisätty</BasicBlock>
      <BasicBlock title="Käytetyt tietomallit">Ei lisätty</BasicBlock>
      <BasicBlock title="Linkit">
        <ModelInfoListWrapper>
          {getLink(modelInfo).map((link, idx) => (
            <div key={`model-link-${idx}`}>
              <ExternalLink href={link.url} labelNewWindow="avaa uuden sivun">
                {link.title}
              </ExternalLink>
              <br />
              {link.description}
            </div>
          ))}
        </ModelInfoListWrapper>
      </BasicBlock>

      <ExpanderGroup closeAllText="" openAllText="" showToggleAllButton={false}>
        <Expander>
          <ExpanderTitleButton>
            Viittaukset muista komponenteista
          </ExpanderTitleButton>
        </Expander>
      </ExpanderGroup>
    </ModelInfoWrapper>
  );
}
