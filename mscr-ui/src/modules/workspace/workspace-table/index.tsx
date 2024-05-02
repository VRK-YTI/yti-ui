import { useTranslation } from 'next-i18next';
import { Type } from '@app/common/interfaces/search.interface';
import GenericTable from '@app/common/components/generic-table';
import { State } from '@app/common/interfaces/state.interface';

export interface ContentRow {
  label: string;
  namespace?: string;
  state: State;
  numberOfRevisions: string;
  pid: string;
  linkUrl: JSX.Element;
}

export default function WorkspaceTable({
  content,
  contentType,
}: {
  content: ContentRow[];
  contentType: Type;
}) {
  const { t } = useTranslation('common');

  const caption =
    contentType == Type.Schema
      ? t('workspace.schemas')
      : t('workspace.crosswalks');

  const headings = [
    t('workspace.label'),
    ...((contentType == Type.Schema) ? [t('workspace.namespace')] : []),
    t('workspace.state'),
    t('workspace.numberOfRevisions'),
    t('workspace.pid'),
    '',
  ];

  return <GenericTable items={content} headings={headings} caption={caption} />;
}
