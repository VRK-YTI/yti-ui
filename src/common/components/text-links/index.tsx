import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Link as SuomiLink, ExternalLink } from 'suomifi-ui-components';

interface TextLinksProps {
  text: string;
}

interface ParseTextProps {
  text: string;
  t: Function;
}

interface ChildType extends ChildNode {
  href?: string;
  dataset?: {
    type: string;
  };
}

function ParseText({ text, t }: ParseTextProps) {
  const parser = new DOMParser();
  const html = parser.parseFromString(text, 'text/html');
  const htmlChildNodes = html.children[0].children[1].childNodes;

  let children = Array.from(htmlChildNodes).map((child: ChildType, idx: number) => {
    if (child.nodeName.toLowerCase().includes('a')) {
      const childHref = child.href ?? '';
      const childTextValue = child.firstChild?.textContent;

      if (child.dataset?.type === 'internal') {
        return (
          <Link
            passHref
            href={`http://localhost:3000/terminology-api/api/v1/resolve?uri=${childHref}`}
            key={`${childTextValue}-${idx}`}
          >
            <SuomiLink href=''>
              {childTextValue}
            </SuomiLink>
          </Link>
        );

      } else {
        return (
          <Link passHref href={childHref} key={`${childTextValue}-${idx}`}>
            <ExternalLink href='' labelNewWindow={`${t('link-opens-new-window-external')} ${childTextValue}`} >
              {childTextValue}
            </ExternalLink>
          </Link>
        );
      }

    } else if (child.nodeName.toLowerCase().includes('text')) {
      if (child.textContent) {
        return <span key={`${child.textContent}-${idx}`}>{child.textContent}</span>;
      }

    } else if (child.nodeName.toLowerCase() === 'br') {
      return <br key={`br-${idx}`}/>;
    }
  });

  return <>{children}</>;
}

export default function TextLinks({ text }: TextLinksProps) {
  const { t } = useTranslation('common');

  return (
    <>
      <ParseText text={text} t={t} />
    </>
  );
}
