import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';
import { LabelLink } from '@app/modules/workspace/workspace-table/workspace-table-styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  MscrSearchResults,
  Type,
} from '@app/common/interfaces/search.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { Typography } from '@mui/material';
import GenericTable, { TableItemWithLink } from '@app/common/components/generic-table';

export interface TableContent {
  ariaLabel: string;
  headers: {
    headerKey: string;
    text: string;
  }[];
  rows?: {
    linkUrl: string;
    rowKey: string;
    rowContent: {
      cellKey: string;
      cellContent: string;
    }[];
  }[];
}

export default function WorkspaceTable({
  data,
  contentType,
}: {
  data?: MscrSearchResults;
  contentType: Type;
}) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale ?? '';

  if (!data) return <></>;

  const items: TableItemWithLink[] = data.hits.hits.map(
    (result) => {
      const info = result._source;
      const item: TableItemWithLink = {
        label: getLanguageVersion({
          data: info.label,
          lang,
        }),
        namespace: info.namespace,
        state: info.state,
        numberOfRevisions: info.numberOfRevisions.toString(),
        pid: info.handle ?? t('metadata.not-available'),
        linkUrl: contentType == 'SCHEMA'
          ? router.basePath + '/schema/' + info.id
          : router.basePath + '/crosswalk/' + info.id
      };
      item.label = getLanguageVersion({
        data: info.label,
        lang,
      });
      // itemDisplay.namespace = info.namespace;
      // itemDisplay.state = info.state;
      // itemDisplay.numberOfRevisions = info.numberOfRevisions.toString();
      // itemDisplay.pid = info.id;
      // itemDisplay.linkUrl = contentType == 'SCHEMA'
      //   ? router.basePath + '/schema/' + info.id
      //   : router.basePath + '/crosswalk/' + info.id;
      return item;
    }
  );
  const caption = contentType == 'SCHEMA'
    ? t('workspace.schemas')
    : t('workspace.crosswalks');
  const headings = [t('workspace.label'), t('workspace.namespace'), t('workspace.state'), t('workspace.numberOfRevisions'), t('workspace.pid')];


  const keysWithTranslations = [
    {
      key: 'label',
      translation: t('workspace.label'),
    },
    {
      key: 'namespace',
      translation: t('workspace.namespace'),
    },
    {
      key: 'state',
      translation: t('workspace.state'),
    },
    {
      key: 'numberOfRevisions',
      translation: t('workspace.numberOfRevisions'),
    },
    {
      key: 'pid',
      translation: t('workspace.pid'),
    },
  ];

  const content: TableContent = {
    ariaLabel:
      contentType == 'SCHEMA'
        ? t('workspace.schemas')
        : t('workspace.crosswalks'),
    headers: keysWithTranslations.map((key) => ({
      headerKey: key.key,
      text: key.translation,
    })),
    rows: items?.map((item) => {
      return {
        linkUrl:
          contentType == 'SCHEMA'
            ? router.basePath + '/schema/' + item.pid
            : router.basePath + '/crosswalk/' + item.pid,
        rowKey: item.pid,
        rowContent: keysWithTranslations.map((key) => ({
          cellKey: key.key,
          cellContent: item[key.key],
        })),
      };
    }),
  };

  if (!data) return <></>;

  return (
    <>
      <GenericTable items={items} headings={headings} caption={caption} asLinks={true} />
      <Typography marginTop={5}>{content.ariaLabel}</Typography>
      <TableContainer>
        <Table aria-label={content.ariaLabel}>
          <TableHead>
            <TableRow>
              {content.headers.map((header) => (
                <TableCell key={header.headerKey}>{header.text}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {content.rows?.map((row) => (
              <Link key={row.rowKey} href={row.linkUrl} passHref>
                <TableRow
                  hover
                  sx={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  {row.rowContent.map((cell) => {
                    if (cell.cellKey == 'label') {
                      return (
                        <TableCell key={cell.cellKey}>
                          <LabelLink href={row.linkUrl}>
                            {cell.cellContent}
                          </LabelLink>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={cell.cellKey}>
                          {cell.cellContent}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
