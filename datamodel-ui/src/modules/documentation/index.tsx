import { KeyboardEvent, createRef, useEffect, useRef, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Button,
  HintText,
  IconListBulleted,
  IconListNumbered,
  IconAttachment,
  IconImage,
  Text,
} from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import {
  ContentWrapper,
  ControlButton,
  ControlsRow,
  FullWidthTextarea,
  LanguageSelectorBtn,
  LanguageSelectorWrapper,
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
import { compareLocales } from '@app/common/utils/compare-locals';
import {
  getAddNewLine,
  getCurrentRowNumber,
  getLastValue,
  getRows,
  getSpecialCharacters,
  injectNewLine,
  injectNewListRow,
  injectSpecialCharacters,
  previousCharIsNewLine,
} from './utils';

export default function Documentation({ modelId }: { modelId: string }) {
  const { t, i18n } = useTranslation('admin');
  const ref = useRef<HTMLDivElement>(null);
  const textAreaRef = createRef<HTMLTextAreaElement>();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [value, setValue] = useState<{ [key: string]: string }>({});
  const [isEdit, setIsEdit] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
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
      documentation: value,
    });

    postModel({
      payload: payload,
      prefix: modelData.prefix,
    });
  };

  const handleButtonClick = (key: string) => {
    const addNewLine = getAddNewLine(value[currentLanguage], selection.start);
    const elem = getSpecialCharacters(key, addNewLine);

    setValue({
      ...value,
      [currentLanguage]: injectSpecialCharacters(
        value[currentLanguage],
        selection,
        elem
      ),
    });
  };

  const handleEnterClick = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const rows: string[] = getRows(target.value);
    const currRowNmb = getCurrentRowNumber(target.value, target.selectionStart);

    if (target.selectionStart === 0) {
      // If cursor is at the beginning of the text area allow normal enter key behaviour
      return;
    }

    if (
      rows[currRowNmb - 1].match(/\n?- /) ||
      rows[currRowNmb - 1].match(/\n?[0-9]+\. /)
    ) {
      e.preventDefault();

      if (previousCharIsNewLine(target.value, target.selectionStart)) {
        setValue({
          ...value,
          [currentLanguage]: injectNewLine(rows, currRowNmb),
        });

        setRealignCursor({
          ...realignCursor,
          still: true,
        });

        return;
      }

      const listStart = rows[currRowNmb - 1].match(/\n?- /)
        ? '-'
        : `${getLastValue(rows[currRowNmb - 1])}.`;

      setValue({
        ...value,
        [currentLanguage]: injectNewListRow(rows, currRowNmb, listStart),
      });
      setRealignCursor({
        ...realignCursor,
        align:
          listStart === '-'
            ? 3
            : 3 + getLastValue(rows[currRowNmb - 1]).toString()?.length ?? 0,
      });
    }
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (modelData && !isEdit) {
      setValue(modelData.documentation ?? '');
    }

    if (modelData && Object.keys(value).length === 0) {
      setValue(modelData.documentation);
      setCurrentLanguage(
        modelData.languages.includes(i18n.language)
          ? i18n.language
          : [...modelData.languages].sort((a, b) => compareLocales(a, b))[0] ??
              'fi'
      );
    }
  }, [modelData, isEdit, i18n.language, value]);

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
          {t('updated')}: <FormattedDate date={modelData?.modified} />
          {modelData?.modifier.name ? `, ${modelData.modifier.name}` : ''}
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
        <LanguageSelectorWrapper>
          {modelData &&
            [...modelData.languages]
              .sort((a, b) => compareLocales(a, b))
              .map((lang) => (
                <LanguageSelectorBtn
                  key={lang}
                  variant="secondaryNoBorder"
                  $active={currentLanguage === lang}
                  onClick={() => setCurrentLanguage(lang)}
                >
                  {translateLanguage(lang, t)}
                </LanguageSelectorBtn>
              ))}
        </LanguageSelectorWrapper>

        <ContentWrapper>
          <div>
            {/* First 3 buttons use chars instead of Icons because they aren't available yet */}
            <ControlsRow>
              <div>
                <ControlButton onClick={() => handleButtonClick('bold')}>
                  B
                </ControlButton>
                <ControlButton onClick={() => handleButtonClick('italic')}>
                  I
                </ControlButton>
                <ControlButton onClick={() => handleButtonClick('quote')}>
                  ``
                </ControlButton>
                <ControlButton
                  onClick={() => handleButtonClick('listBulleted')}
                >
                  <IconListBulleted />
                </ControlButton>
                <ControlButton
                  onClick={() => handleButtonClick('listNumbered')}
                >
                  <IconListNumbered />
                </ControlButton>
                <ControlButton onClick={() => handleButtonClick('link')}>
                  <IconAttachment />
                </ControlButton>
                <ControlButton onClick={() => handleButtonClick('image')}>
                  <IconImage />
                </ControlButton>
              </div>

              <HintText>
                {value[currentLanguage].length} / 5000 {t('characters')}
              </HintText>
            </ControlsRow>

            <FullWidthTextarea
              ref={textAreaRef}
              labelText=""
              labelMode="hidden"
              value={value[currentLanguage] ?? ''}
              onChange={(e) =>
                setValue({
                  ...value,
                  [currentLanguage]: e.target.value ?? '',
                })
              }
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
              {value[currentLanguage]}
            </ReactMarkdown>
          </div>
        </ContentWrapper>
      </DrawerContent>
    );
  }
}
