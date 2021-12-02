import {
  InfoBlockData,
  InfoBlockDescription,
  InfoBlockLanguage,
  InfoBlockTitle,
  InfoBlockWrapper
} from './info-block.styles';

interface InfoBlockProps {
  data: any;
  title: string;
}

export default function InfoBlock({ data, title }: InfoBlockProps) {
  return (
    <InfoBlockWrapper>
      <InfoBlockTitle>
        {title}
      </InfoBlockTitle>
      <InfoBlockData>
        {
          data.length > 1
            ?
            data?.map((d: any, idx: number) => {
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
                {data?.lang?.toUpperCase()}
              </InfoBlockLanguage>
              <InfoBlockDescription>
                {data?.value}
              </InfoBlockDescription>
            </div>
        }
      </InfoBlockData>
    </InfoBlockWrapper>
  );
}
