import { useEffect, useRef, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import {
  ContentWrapper,
  ControlButton,
  ControlsRow,
  FullWidthTextarea,
} from './documentation.styles';

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
      case 'quote':
        elem = '>';
        setValue(
          `${value.slice(0, selection.start)}${elem}${value.slice(
            selection.end
          )}`
        );
        return;
      case 'link':
        elem = '[](http://)';
        setValue(
          `${value.slice(0, selection.start)}${elem}${value.slice(
            selection.end
          )}`
        );
        return;
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
        <ContentWrapper>
          <div>
            <ControlsRow>
              <ControlButton onClick={() => handleButtonClick('bold')}>
                B
              </ControlButton>
              <ControlButton onClick={() => handleButtonClick('italic')}>
                I
              </ControlButton>
              <ControlButton onClick={() => handleButtonClick('quote')}>
                ``
              </ControlButton>
              <ControlButton onClick={() => handleButtonClick('listBulleted')}>
                <Icon icon="listBulleted" />
              </ControlButton>
              <ControlButton onClick={() => handleButtonClick('listNumbered')}>
                <Icon icon="listNumbered" />
              </ControlButton>
              <ControlButton onClick={() => handleButtonClick('link')}>
                <Icon icon="attachment" />
              </ControlButton>
            </ControlsRow>

            <FullWidthTextarea
              labelText=""
              labelMode="hidden"
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
              onKeyDown={(e) => e.key === 'Enter' && console.log(e.target)}
            />
          </div>

          <div>
            <div>
              <Text variant="bold" smallScreen>
                Esikatselu
              </Text>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} unwrapDisallowed={false}>
              {value}
            </ReactMarkdown>
          </div>
        </ContentWrapper>
      </DrawerContent>
    </>
  );
}
