import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import {
  SuomiInternalLink,
  SuomiExternalLink,
} from './sanitized-text-content.style';
import { polyfill } from 'interweave-ssr';
import Interweave, { Node } from 'interweave';

interface SanitizedTextContentProps {
  text: string;
}

export default function SanitizedTextContent({
  text,
}: SanitizedTextContentProps) {
  const { t } = useTranslation('common');
  const internalTypes = ['broader', 'internal', 'related'];

  // This is needed for this component to work in SSR
  polyfill();

  function transform(node: HTMLElement, children: Node[]): React.ReactNode {
    if (
      node.tagName === 'a' &&
      !node.getAttribute('href')?.includes('script')
    ) {
      if (internalTypes.includes(node.getAttribute('data-type') as string)) {
        return (
          <Link
            passHref
            href={`/terminology-api/api/v1/resolve?uri=${node.getAttribute(
              'href'
            )}`}
          >
            <SuomiInternalLink href="">{children}</SuomiInternalLink>
          </Link>
        );
      } else {
        return (
          <Link passHref href={node.getAttribute('href') ?? ''}>
            <SuomiExternalLink
              href=""
              labelNewWindow={`${t(
                'link-opens-new-window-external'
              )} ${children}`}
            >
              {children}
            </SuomiExternalLink>
          </Link>
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
