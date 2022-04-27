import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import ConceptInfoBlockList from './concept-info-block-list';

interface ExamplesProps {
  update: (value: any) => void;
}

export default function Examples({ update }: ExamplesProps) {
  const { t } = useTranslation('admin');
  const [examples, setExamples] = useState<number[]>([]);
  const [id, setId] = useState<number>(0);

  const handleArrayUpdate = (id: number) => {
    const updatedExamples = examples.filter((example) => example !== id);
    setExamples(updatedExamples);
    update({key: 'example', value: updatedExamples});
  };

  const handleClick = () => {
    setExamples([...examples, id]);
    update({key: 'example', value: [...examples, id]});
    setId(id + 1);
  };

  return (
    <BasicBlock
      largeWidth
      title={t('example')}
      extra={
        <BasicBlockExtraWrapper>
          <ConceptInfoBlockList
            list={examples}
            parent={'example'}
            setList={handleArrayUpdate}
          />

          <Button
            variant="secondary"
            onClick={() => handleClick()}
          >
            {t('add-new-example')}
          </Button>
        </BasicBlockExtraWrapper>
      }
    >
      {t('example-description')}
    </BasicBlock>
  );
}
