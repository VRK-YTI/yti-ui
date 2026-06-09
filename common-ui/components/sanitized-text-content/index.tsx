import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import {
  SuomiInternalLink,
  SuomiExternalLink,
} from './sanitized-text-content.styles';
import { polyfill } from 'interweave-ssr';
import { Interweave, Node } from 'interweave';
import { getEnvParam } from '../../utils/link-utils';

interface SanitizedTextContentProps {
  text: string;
}

function getValidHref(href: string | null) {
  const trimmedHref = href?.trim();

  if (!trimmedHref) {
    return undefined;
  }

  if (trimmedHref.startsWith('/')) {
    return trimmedHref;
  }

  try {
    const url = new URL(trimmedHref);
    const allowedProtocols = ['http:', 'https:', 'mailto:'];

    if (allowedProtocols.includes(url.protocol)) {
      return trimmedHref;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export default function SanitizedTextContent({
  text,
}: SanitizedTextContentProps) {
  const { t } = useTranslation('common');
  const internalTypes = ['broader', 'internal', 'related'];

  // This is needed for this component to work in SSR
  polyfill();

  function transform(node: HTMLElement, children: Node[]): React.ReactNode {
    if (node.tagName === 'a') {
      const href = getValidHref(node.getAttribute('href'));

      if (!href) {
        const rawHref = node.getAttribute('href');
        const hrefAttr = rawHref !== null ? ` href="${rawHref}"` : '';
        return (
          <>
            {`<a${hrefAttr}>`}
            {children}
            {'</a>'}
          </>
        );
      }

      if (internalTypes.includes(node.getAttribute('data-type') as string)) {
        return (
          <SuomiInternalLink asProp={Link} href={`${href}${getEnvParam(href)}`}>{children}</SuomiInternalLink>
        );
      } else {
        return (
          <SuomiExternalLink
            asProp={Link}
            href={href}
            labelNewWindow={`${t(
              'link-opens-new-window-external'
            )} ${children}`}
          >
            {children}
          </SuomiExternalLink>
        );
      }
    }
  }

  /*
   * allowList={['a', 'br']} could be added if wanted since these
   * are (currently) only types expected to be parsed
   */
  return <Interweave content={text} transform={transform} />;
}
