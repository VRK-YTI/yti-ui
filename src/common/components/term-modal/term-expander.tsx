import { Expander, ExpanderContent, ExpanderTitleButton, Text } from 'suomifi-ui-components';
import { TermModalParagraph } from './term-modal.style';

interface TermExpanderProps {
  title: string;
  data: { subtitle: string, value?: string, checkCondition?: boolean }[];
}

export default function TermExpander({ title, data }: TermExpanderProps) {

  return (
    <Expander>
      <ExpanderTitleButton asHeading='h3'>
        {title}
      </ExpanderTitleButton>
      <ExpanderContent>
        {data.map((d, idx) => {
          if (d.value) {
            if (d.checkCondition === false) {
              return null;
            }

            return (
              <TermModalParagraph marginBottomSpacing='m' key={`${title}-${idx}`}>
                <Text variant='bold'>
                  {d.subtitle}
                </Text>
                <Text>
                  {d.value}
                </Text>
              </TermModalParagraph>
            );
          }
        })}
      </ExpanderContent>
    </Expander>
  );

};
