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
  const [examples, setExamples] = useState<any[]>([]);
  const [id, setId] = useState<number>(0);

  const handleUpdate = ({id, lang, value}) => {
    const updatedExamples = examples.map((example) => {
      if (example.id === id) {
        return {id: id, lang: lang ? lang : example.lang, value: value ? value : example.value};
      }

      return example;
    });

    console.log('updatedExamples', updatedExamples);

    setExamples(updatedExamples);
    update({key: 'example', value: updatedExamples});
  };

  const handleRemove = (id: number) => {
    const updatedExamples = examples.filter((example) => example.id !== id);
    console.log(updatedExamples);
    setExamples(updatedExamples);
    update({key: 'example', value: updatedExamples});
  };

  const handleClick = () => {
    const updatedExamples = [...examples, {id: id, lang: 'fi', value: ''}];
    setExamples(updatedExamples);
    update({key: 'example', value: updatedExamples});
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
            update={handleUpdate}
            remove={handleRemove}
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
