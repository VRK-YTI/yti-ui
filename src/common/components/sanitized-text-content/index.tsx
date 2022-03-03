import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { SuomiInternalLink, SuomiExternalLink } from './sanitized-text-content.style';

interface TextLinksProps {
  text: string;
}

interface ChildType extends ChildNode {
  href?: string;
  dataset?: {
    type: string;
  };
}

export default function SanitizedTextContent({ text }: TextLinksProps) {
  const { t } = useTranslation('common');

  const internalTypes = ['broader', 'internal', 'related'];
  const htmlChildNodes = new DOMParser().parseFromString(text, 'text/html').children[0].children[1].childNodes;
  const children = Array.from(htmlChildNodes).map((child: ChildType, idx: number) => {
    if (child.nodeName.toLowerCase() === 'a') {
      const childHref = child.href ?? '';
      const childTextValue = child.firstChild?.textContent;

      const url = new URL(childHref);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return <span key={`${child.textContent}-${idx}`}>{child.textContent}</span>;
      }

      if (child.dataset?.type && internalTypes.includes(child.dataset.type)) {
        return (
          <Link
            passHref
            href={`/terminology-api/api/v1/resolve?uri=${childHref}`}
            key={`${childTextValue}-${idx}`}
          >
            <SuomiInternalLink href=''>
              {childTextValue}
            </SuomiInternalLink>
          </Link>
        );

      } else {
        return (
          <Link passHref href={childHref} key={`${childTextValue}-${idx}`}>
            <SuomiExternalLink href='' labelNewWindow={`${t('link-opens-new-window-external')} ${childTextValue}`} >
              {childTextValue}
            </SuomiExternalLink>
          </Link>
        );
      }

    } else if (child.nodeName.toLowerCase() === 'br') {
      return <br key={`br-${idx}`} />;
    } else if (child.textContent) {
      return <span key={`${child.textContent}-${idx}`}>{child.textContent}</span>;
    } else {
      console.log('ignored child');
      console.log(child);
    }
  });

  return <>{children}</>;
}
