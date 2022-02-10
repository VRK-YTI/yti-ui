import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Link as SuomiLink, ExternalLink } from 'suomifi-ui-components';
import { useGetResolveQuery } from '../resolve/resolve.slice';

interface TextLinksProps {
  text: string;
}

export function parseToURI(text: string) {
  const uriAndType = text.match(/'.+?'/g);

  if (!uriAndType) {
    return null;
  } else if (uriAndType.length === 2) {
    return [uriAndType[0]];
  } else {
    let uriList: string[] = uriAndType.filter((_, index) => {
      if (index + 1 < uriAndType.length) {
        return uriAndType[index + 1].includes('internal');
      }
    });

    if (!uriList) {
      return null;
    }
    return uriList;
  }
}

function GetLink(uri: string, terminologyId: string) {
  const { data, isLoading } = useGetResolveQuery(uri.replaceAll('\/', '%2F').replaceAll(':', '%3A').replaceAll('\'', '') ?? null, {skip: !uri});
  if (!isLoading) {
    return `/terminology/${terminologyId}/concept/${data?.[0].id}`;
  }
}

export default function TextLinks({ text }: TextLinksProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const textFormatted = parseToURI(text);

  let internalLinks = textFormatted?.map(txt => {
    return GetLink(txt, router.query.terminologyId as string);
  }) ?? [];

  if (text.includes('<a')) {
    const textSplit = text.split(/<\/?a>? ?/g);

    if (textSplit.length < 1 || internalLinks.includes(undefined)) {
      return null;
    }

    return (
      <>
        {textSplit.map((txt, idx) => {
          if (txt.includes('href')) {
            if (txt.includes('internal')) {
              return renderLink(txt, idx, 'internal');
            } else if (txt.includes('external')) {
              return renderLink(txt, idx, 'external');
            }
          } else {
            return (
              <span key={`${txt}-${idx}`} dangerouslySetInnerHTML={{__html: txt}} />
            );
          }
        })}
      </>
    );

  } else {
    return (
      <>{text}</>
    );
  }

  function renderLink(txt: string, idx: number, type: 'internal' | 'external') {
    if (type === 'internal') {
      const link = internalLinks[0];
      internalLinks.shift();

      return (
        <Link
          passHref
          href={link ?? ''}
          key={`${txt}-${idx}`}
        >
          <SuomiLink href={''}>
            {txt.replace(/.*>/g, '')}
          </SuomiLink>
        </Link>
      );
    } else {
      const externalLink = txt.match(/href='.+?'/g)?.[0].match(/'.*/g)?.[0].replaceAll('\'', '') ?? '';
      return (
        <Link
          passHref
          href={externalLink}
          key={`${txt}-${idx}`}
        >
          <ExternalLink href={''} labelNewWindow={`${t('link-opens-new-window-external')} ${txt.replace(/.*>/g, '')}`}>
            {txt.replace(/.*>/g, '')}
          </ExternalLink>
        </Link>
      );
    }
  }
}

