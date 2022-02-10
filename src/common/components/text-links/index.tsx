import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Link as SuomiLink, ExternalLink } from 'suomifi-ui-components';
import { useGetResolveQuery } from '../resolve/resolve.slice';

interface TextLinksProps {
  text: string;
}

export default function TextLinks({ text }: TextLinksProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const textFormatted = text.match(/'.+?'/g)?.[0].replaceAll('\/', '%2F').replaceAll(':', '%3A').replaceAll('\'', '');

  const { data } = useGetResolveQuery(textFormatted, {skip: !textFormatted});

  const internalLink = `/terminology/${router.query.terminologyId}/concept/${data?.[0].id}`;

  if (text.includes('<a')) {
    const textSplit = text.split(/<\/?a>? ?/g);

    if (textSplit.length < 1) {
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
      return (
        <Link
          passHref
          href={internalLink}
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

