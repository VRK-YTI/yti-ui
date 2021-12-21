import { Property } from '../../interfaces/termed-data-types.interface';
import {
  InfoBlockData,
  InfoBlockDescription,
  InfoBlockLanguage,
  InfoBlockTitle,
  InfoBlockWrapper
} from './info-block.styles';

interface InfoBlockProps {
  data: Property | Property[];
  title: string;
}

export default function InfoBlock({ data, title }: InfoBlockProps) {

  if (!data) {
    return <></>;
  }

  return (
    <InfoBlockWrapper>
      <InfoBlockTitle>
        {title}
      </InfoBlockTitle>
      <InfoBlockData>
        {
          Array.isArray(data)
            ?
            data.map((d, idx: number) => {
              return (
                <div key={`info-block-${title}-${idx}`}>
                  <InfoBlockLanguage>
                    {d.lang.toUpperCase()}
                  </InfoBlockLanguage>
                  <InfoBlockDescription>
                    {d.value}
                  </InfoBlockDescription>
                </div>
              );
            })
            :
            <div>
              <InfoBlockLanguage>
                {data.lang.toUpperCase()}
              </InfoBlockLanguage>
              <InfoBlockDescription>
                {data.value}
              </InfoBlockDescription>
            </div>
        }
      </InfoBlockData>
    </InfoBlockWrapper>
  );
}
