import { useEffect, useRef, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { Button, Text, Textarea } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import Separator from 'yti-common-ui/separator';

const FullWidthTextarea = styled(Textarea)`
  width: 100%;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 30px;
  flex-wrap: wrap;

  > div {
    min-width: 300px;
    flex-grow: 4;
  }
`;

export default function Documentation() {
  const ref = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [value, setValue] = useState('');
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const handleButtonClick = (key: string) => {
    let elem = '';
    switch (key) {
      case 'bold':
        elem = '**';
        break;
      case 'italic':
        elem = '*';
        break;
      case 'strike':
        elem = '~~';
        break;
      default:
        return;
    }

    setValue(
      `${value.slice(0, selection.start)}${elem}${value.slice(
        selection.start,
        selection.end
      )}${elem}${value.slice(selection.end)}`
    );
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Text variant="bold">Dokumentaatio</Text>
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight} spaced>
        <Button onClick={() => handleButtonClick('bold')} variant="secondary">
          B
        </Button>
        <Button onClick={() => handleButtonClick('italic')} variant="secondary">
          I
        </Button>
        <Button onClick={() => handleButtonClick('strike')} variant="secondary">
          <del>I</del>
        </Button>
        <ContentWrapper>
          <div>
            <FullWidthTextarea
              labelText="Input"
              value={value}
              onChange={(e) => setValue(e.target.value ?? '')}
              onKeyUp={(e) =>
                setSelection({
                  start: e.target.selectionStart,
                  end: e.target.selectionEnd,
                })
              }
              onClickCapture={(e) =>
                setSelection({
                  start: e.target.selectionStart,
                  end: e.target.selectionEnd,
                })
              }
            />
          </div>

          <Separator />

          <div>
            <Text variant="bold" smallScreen>
              Output
            </Text>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          </div>
        </ContentWrapper>
      </DrawerContent>
    </>
  );
}
