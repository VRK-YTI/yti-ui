import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { SuomiInternalLink, SuomiExternalLink } from './text-links.style';

interface TextLinksProps {
  text: string;
}

interface ParseTextProps {
  text: string;
}

interface ChildType extends ChildNode {
  href?: string;
  dataset?: {
    type: string;
  };
}

function ParseText({ text }: ParseTextProps) {
  const { t } = useTranslation('common');
  const htmlChildNodes = new DOMParser().parseFromString(text, 'text/html').children[0].children[1].childNodes;

  const children = Array.from(htmlChildNodes).map((child: ChildType, idx: number) => {
    if (child.nodeName.toLowerCase() === 'a') {
      const childHref = child.href ?? '';
      const childTextValue = child.firstChild?.textContent;

      if (child.dataset?.type === 'internal') {
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
    }
  });

  return <>{children}</>;
}

export default function TextLinks({ text }: TextLinksProps) {
  return (
    <>
      <ParseText text={text} />
    </>
  );
}
