import generateNewConcept from '@app/common/components/modify/generate-new-concept';
import { usePostConceptMutation } from '@app/common/components/modify/modify.slice';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from 'suomifi-ui-components';
import { FooterBlock } from './new-concept.styles';

export default function FormFooter({ conceptInfo, terminologyId }: any) {
  const { t } = useTranslation('admin');
  const router = useRouter();
  const [postConcept, result] = usePostConceptMutation();

  useEffect(() => {
    if (result.isSuccess) {
      router.push(`/terminology/${router.query.terminologyId}`);
    }
  }, [result, router]);

  const handleClick = () => {
    // This temporarily adds prefLabel from router params
    // Remove this when terms are added to conceptInfo
    conceptInfo.terms = {preferredTerm: [{lang: 'fi', prefLabel: 'demo'}]};

    console.log(conceptInfo);

    const postData = generateNewConcept(conceptInfo, terminologyId);

    if (postData) {
      postConcept(postData);
    }
  };

  return (
    <FooterBlock>
      <Separator isLarge />
      <div>
        <Button onClick={() => handleClick()}>{t('save')}</Button>
        <Button variant="secondary">{t('cancel-variant')}</Button>
      </div>
    </FooterBlock>
  );
}
