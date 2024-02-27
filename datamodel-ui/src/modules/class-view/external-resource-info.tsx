import { selectDisplayLang } from '@app/common/components/model/model.slice';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { BasicBlock } from 'yti-common-ui/block';
import Separator from 'yti-common-ui/separator';

export default function ExternalResourceInfo({
  resource,
  renderActions,
}: {
  resource: SimpleResource;
  renderActions: () => void;
}) {
  const { t, i18n } = useTranslation('common');
  const displayLang = useSelector(selectDisplayLang());

  return (
    <>
      {renderActions()}
      <Separator />

      <BasicBlock title={t('name')}>
        {getLanguageVersion({
          data: resource.label,
          lang: displayLang ?? i18n.language,
        })}
      </BasicBlock>

      <BasicBlock title={t('description')}>
        {resource.note ? (
          getLanguageVersion({
            data: resource.note,
            lang: displayLang ?? i18n.language,
          })
        ) : (
          <>{t('not-defined')}</>
        )}
      </BasicBlock>

      <BasicBlock title="URI">{resource.uri}</BasicBlock>
    </>
  );
}
