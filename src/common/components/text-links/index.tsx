import Link from 'next/link';
import { Link as SuomiLink } from 'suomifi-ui-components';
import { VocabularyConceptDTO } from '../../interfaces/vocabulary.interface';

interface TextLinksProps {
  text: string;
  obj: VocabularyConceptDTO;
}

export function getTextLinks({text, obj}: TextLinksProps) {

}

export default function TextLinks({ text, obj }: TextLinksProps) {
  if (!text.includes('<')) {
    return <>{text}</>;
  }

  if (text.includes('internal')) {
    const baseUri = 'http://localhost:3000/';

    const uri = `/terminology/${obj.terminology.id}/concept/${obj.broader}`;

    const newText = text.split(/<\/?a[^>]*>/g);

    return (
      <>
        {newText.map((t, idx) => {
          if (t.includes(' ')) {
            return (
              <span key={`${t}-${idx}`}>{t}</span>
            );
          } else {
            return (
              <Link href={uri} passHref key={`${t}-${idx}`}>
                <SuomiLink href=''>
                  {t}
                </SuomiLink>
              </Link>
            );
          }
        })}
      </>
    );
  } else {
    return (
      <div dangerouslySetInnerHTML={{ __html: text }}></div>
    );
  }
}
