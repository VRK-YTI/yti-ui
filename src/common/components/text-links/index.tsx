import Link from 'next/link';
import { useRouter } from 'next/router';
import { Link as SuomiLink } from 'suomifi-ui-components';
import { useGetResolveQuery } from '../resolve/resolve.slice';

interface TextLinksProps {
  text: string;
}

export function GetLinks(text: string) {
  const { data } = useGetResolveQuery(text);
  return data;
}

export default function TextLinks({ text }: TextLinksProps) {
  const router = useRouter();
  const textFormatted = text.match(/'.+?'/g)?.[0].replaceAll('\/', '%2F').replaceAll(':', '%3A').replaceAll('\'', '');

  if (!text.includes('<a') || !textFormatted) {
    return <>{text}</>;
  }

  const data = GetLinks(textFormatted);

  if (text.includes('internal')) {
    const textSplit = text.split(/<\/?a>? ?/g);

    return (
      textSplit.map((t, idx) => {
        if (t.includes('href')) {
          return (
            <Link
              passHref
              href={`/terminology/${router.query.terminologyId}/concept/${data?.[0].id}`}
              key={`${t}-${idx}`}
            >
              <SuomiLink href={''}>
                {t.replace(/.*>/g, '')}
              </SuomiLink>
            </Link>
          );
        } else {
          return (
            <span key={`${t}-${idx}`}>{t}</span>
          );
        }
      })
    );
  } else {
    return (
      <div dangerouslySetInnerHTML={{ __html: text }}></div>
    );
  }
}
