import { KeyboardEvent, createRef, useEffect, useRef, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { Button, Icon, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import {
  ContentWrapper,
  ControlButton,
  ControlsRow,
  FullWidthTextarea,
} from './documentation.styles';
import { useTranslation } from 'next-i18next';
import {
  useGetModelQuery,
  usePostModelMutation,
} from '@app/common/components/model/model.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import generatePayload from '../model/generate-payload';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import {
  getIsPartOfWithId,
  getOrganizationsWithId,
} from '@app/common/utils/get-value';
import FormattedDate from 'yti-common-ui/formatted-date';

export default function Documentation({ modelId }: { modelId: string }) {
  const { t, i18n } = useTranslation('admin');
  const ref = useRef<HTMLDivElement>(null);
  const textAreaRef = createRef<HTMLTextAreaElement>();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [value, setValue] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [realignCursor, setRealignCursor] = useState({
    still: false,
    align: 0,
  });
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const { data: modelData, refetch } = useGetModelQuery(modelId);
  const [postModel, result] = usePostModelMutation();

  const handleSubmit = () => {
    if (!modelData) {
      return;
    }

    const payload = generatePayload({
      contact: '',
      languages:
        modelData.languages.map((lang) => ({
          labelText: translateLanguage(lang, t),
          uniqueItemId: lang,
          title:
            Object.entries(modelData.label).find((t) => t[0] === lang)?.[1] ??
            '',
          description:
            Object.entries(modelData.description).find(
              (d) => d[0] === lang
            )?.[1] ?? '',
          selected: true,
        })) ?? [],
      organizations: getOrganizationsWithId(modelData, i18n.language) ?? [],
      prefix: modelData?.prefix ?? '',
      serviceCategories: getIsPartOfWithId(modelData, i18n.language) ?? [],
      status: modelData?.status ?? 'DRAFT',
      type: modelData?.type ?? 'PROFILE',
      terminologies: modelData.terminologies ?? [],
      externalNamespaces: modelData.externalNamespaces ?? [],
      internalNamespaces: modelData.internalNamespaces ?? [],
      codeLists: modelData.codeLists ?? [],
      documentation: {
        [i18n.language]: value,
      },
    });

    postModel({
      payload: payload,
      prefix: modelData.prefix,
    });
  };

  const handleButtonClick = (key: string) => {
    let elem = ['', ''];
    const rows: string[] = value.split('\n');
    const currRow = value.substring(0, selection.start).split('\n').length - 1;
    const addNewLine = rows[currRow] && rows[currRow].length > 0;

    switch (key) {
      case 'bold':
        elem = ['**', '**'];
        break;
      case 'italic':
        elem = ['*', '*'];
        break;
      case 'quote':
        elem = ['>', ''];
        break;
      case 'listBulleted':
        elem = [addNewLine ? '\n- ' : '- ', ''];
        break;
      case 'listNumbered':
        elem = [addNewLine ? '\n1. ' : '1. ', ''];
        break;
      case 'link':
        elem = ['[](http://)', ''];
        break;
      case 'image':
        elem = ['![]()', ''];
        break;
      default:
        return;
    }

    setValue(
      `${value.slice(0, selection.start)}${elem[0]}${value.slice(
        selection.start,
        selection.end
      )}${elem[1]}${value.slice(selection.end)}`
    );
  };

  const handleEnterClick = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const rows: string[] = target.value.split('\n');
    const currRow = target.value
      .substring(0, target.selectionStart)
      .split('\n').length;

    if (target.selectionStart === 0) {
      return;
    }

    if (rows[currRow - 1].match(/\n?- /)) {
      e.preventDefault();

      if (target.value[target.selectionStart - 1].match(/\n/)) {
        setValue(
          `${rows.slice(0, currRow - 1).join('\n')}\n\n${rows
            .slice(currRow - 1)
            .join('\n')}`
        );
        setRealignCursor({
          ...realignCursor,
          still: true,
        });
        return;
      }

      setValue(
        `${rows.slice(0, currRow).join('\n')}\n- ${
          currRow !== rows.length ? '\n' : ''
        }${rows.slice(currRow).join('\n')}`
      );
      setRealignCursor({
        ...realignCursor,
        align: 3,
      });
      return;
    }

    if (rows[currRow - 1].match(/\n?[0-9]+\. /)) {
      e.preventDefault();

      if (target.value[target.selectionStart - 1].match(/\n/)) {
        setValue(
          `${rows.slice(0, currRow - 1).join('\n')}\n\n${rows
            .slice(currRow - 1)
            .join('\n')}`
        );
        setRealignCursor({
          ...realignCursor,
          still: true,
        });
        return;
      }

      const lastValue =
        Math.max(parseInt(rows[currRow - 1].match(/\d/)?.[0] ?? '0')) + 1;
      setValue(
        `${rows.slice(0, currRow).join('\n')}\n${lastValue}. ${
          currRow !== rows.length ? '\n' : ''
        }${rows.slice(currRow).join('\n')}`
      );
      setRealignCursor({
        ...realignCursor,
        align: 3 + lastValue.toString()?.length ?? 0,
      });
      return;
    }
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (modelData && !isEdit) {
      setValue(modelData.documentation[i18n.language] ?? '');
    }
  }, [modelData, isEdit, i18n.language]);

  useEffect(() => {
    if (result.isSuccess) {
      setIsEdit(false);
      refetch();
    }
  }, [result, refetch]);

  useEffect(() => {
    if (!textAreaRef.current) {
      return;
    }

    if (realignCursor.still) {
      textAreaRef.current.setSelectionRange(selection.start, selection.start);
      setRealignCursor({ ...realignCursor, still: false });
    }

    if (realignCursor.align > 0) {
      const newPos = selection.start + realignCursor.align;
      textAreaRef.current.setSelectionRange(newPos, newPos);
      setRealignCursor({ ...realignCursor, align: 0 });
    }
  }, [realignCursor, selection.start, textAreaRef]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Text variant="bold">{t('documentation')}</Text>

          {isEdit ? (
            <div
              style={{
                display: 'flex',
                gap: '15px',
              }}
            >
              <Button onClick={() => handleSubmit()}>{t('save')}</Button>
              <Button variant="secondary" onClick={() => setIsEdit(false)}>
                {t('cancel-variant')}
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setIsEdit(true)}>
              {t('edit')}
            </Button>
          )}
        </div>
      </StaticHeader>

      {renderView()}
      {renderEdit()}
    </>
  );

  function renderView() {
    if (isEdit) {
      return <></>;
    }

    return (
      <DrawerContent height={headerHeight} spaced>
        <div>
          Päivitetty: <FormattedDate date={modelData?.modified} />
          {modelData?.modifier.name ? `, ${modelData.modifier.name}` : ''}
        </div>
        <div>
          <Text variant="bold">Otsikko</Text>
        </div>
        <div>
          <ReactMarkdown remarkPlugins={[remarkGfm]} unwrapDisallowed={false}>
            {getLanguageVersion({
              data: modelData?.documentation,
              lang: i18n.language,
            })}
          </ReactMarkdown>
        </div>
      </DrawerContent>
    );
  }

  function renderEdit() {
    if (!isEdit) {
      return <></>;
    }

    return (
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
              <ControlButton onClick={() => handleButtonClick('image')}>
                <Icon icon="image" />
              </ControlButton>
            </ControlsRow>

            <FullWidthTextarea
              ref={textAreaRef}
              labelText=""
              labelMode="hidden"
              value={value}
              onChange={(e) => setValue(e.target.value ?? '')}
              onKeyUp={(e) =>
                setSelection({
                  start: (e.target as HTMLTextAreaElement).selectionStart ?? 0,
                  end: (e.target as HTMLTextAreaElement).selectionEnd ?? 0,
                })
              }
              onClickCapture={(e) =>
                setSelection({
                  start: (e.target as HTMLTextAreaElement).selectionStart,
                  end: (e.target as HTMLTextAreaElement).selectionEnd,
                })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleEnterClick(e)}
            />
          </div>

          <div>
            <div>
              <Text variant="bold" smallScreen>
                {t('preview')}
              </Text>
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} unwrapDisallowed={false}>
              {value}
            </ReactMarkdown>
          </div>
        </ContentWrapper>
      </DrawerContent>
    );
  }
}
