import { Expander, ExpanderContent, ExpanderTitleButton } from 'suomifi-ui-components';
import { TermHeading, TermText } from './term-modal.style';

interface TermExpanderProps {
  title: string;
  data: { subtitle: string, value?: string, checkCondition?: boolean }[];
}

export default function TermExpander({ title, data }: TermExpanderProps) {
  if (data.filter(d => d.value).length < 1) {
    return null;
  }

  return (
    <Expander>
      <ExpanderTitleButton asHeading='h4'>
        {title}
      </ExpanderTitleButton>
      <ExpanderContent>
        {data.map((d, idx) => {
          if (d.value) {
            if (d.checkCondition === false) {
              return null;
            }

            return (
              <div key={`${title}-${idx}`}>
                <TermHeading variant='h4'>
                  {d.subtitle}
                </TermHeading>
                <TermText>
                  {d.value}
                </TermText>
              </div>
            );
          }
        })}
      </ExpanderContent>
    </Expander>
  );

};
