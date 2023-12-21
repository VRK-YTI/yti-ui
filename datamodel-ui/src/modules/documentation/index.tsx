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
  Tooltip,
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
  TipTooltipWrapper,
} from './documentation.styles';
import { useTranslation } from 'next-i18next';
import {
  selectDisplayGraphHasChanges,
  selectDisplayLang,
  selectGraphHasChanges,
  setDisplayGraphHasChanges,
  setHasChanges,
  useGetModelQuery,
  useUpdateModelMutation,
  useUpdateVersionedModelMutation,
} from '@app/common/components/model/model.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import generatePayloadUpdate, {
  generatePayloadVersionedUpdate,
} from '../model/generate-payload';
import {
  translateDocumentationTooltip,
  translateLanguage,
} from '@app/common/utils/translation-helpers';
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
import useConfirmBeforeLeavingPage from 'yti-common-ui/utils/hooks/use-confirm-before-leaving-page';
import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { TEXT_AREA_MAX } from 'yti-common-ui/utils/constants';
import { HeaderRow, StyledSpinner } from '@app/common/components/header';
import Image from 'next/image';
import { IconBold, IconItalics, IconQuotes } from 'suomifi-icons';
import HasPermission from '@app/common/utils/has-permission';
import UnsavedAlertModal from '../unsaved-alert-modal';
import { useBreakpoints } from 'yti-common-ui/media-query';

export default function Documentation({
  modelId,
  version,
  languages,
  organizationIds,
}: {
  modelId: string;
  version?: string;
  languages: string[];
  organizationIds?: string[];
}) {
  const { t, i18n } = useTranslation('admin');
  const { breakpoint } = useBreakpoints();
  const hasPermission = HasPermission({
    actions: 'EDIT_DATA_MODEL',
    targetOrganization: organizationIds,
  });
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useStoreDispatch();
  const textAreaRef = createRef<HTMLTextAreaElement>();
  const displayLang = useSelector(selectDisplayLang());
  const displayGraphHasChanges = useSelector(selectDisplayGraphHasChanges());
  const graphHasChanges = useSelector(selectGraphHasChanges());
  const [headerHeight, setHeaderHeight] = useState(hasPermission ? 57 : 42);
  const [value, setValue] = useState<{ [key: string]: string }>({});
  const [isEdit, setIsEdit] = useState(false);
  const [updateSelectionPosition, setUpdateSelectionPosition] = useState<{
    update: boolean;
    startOffset: number;
    endOffset: number;
  }>({
    update: false,
    startOffset: 0,
    endOffset: 0,
  });
  const [hoverRef, setHoverRef] = useState<HTMLButtonElement | null>(null);
  const [showHover, setShowHover] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    languages.sort((a, b) => compareLocales(a, b))[0]
  );
  const [realignCursor, setRealignCursor] = useState({
    still: false,
    align: 0,
  });
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const { data: modelData } = useGetModelQuery({
    modelId: modelId,
    version: version,
  });
  const [updateModel, result] = useUpdateModelMutation();
  const [updateVersionedModel, versionedResult] =
    useUpdateVersionedModelMutation();

  const validImgUrl = (url: string): boolean => {
    const regex = /^http(s)?:\/\/.*\.(jpg|jpeg|png|gif)$/g;
    return regex.test(url);
  };

  const imgProps = (props: { src?: string; alt?: string }) => {
    if (!props.src || !validImgUrl(props.src)) {
      return <></>;
    }

    const src = props.src.replace('http://', 'https://');
    const height = props.alt
      ?.match(/height:[0-9]+px/g)?.[0]
      ?.split(':')?.[1]
      ?.replace('px', '');
    const width = props.alt
      ?.match(/width:[0-9]+px/g)?.[0]
      ?.split(':')?.[1]
      ?.replace('px', '');
    const altText = props.alt
      ? props.alt.replaceAll(/(width|height):[0-9]*px/g, '').trim()
      : 'Image alt text';

    return (
      <Image
        src={src.startsWith('https://') ? src : ''}
        alt={altText}
        width={width ? parseInt(width) : 350}
        height={height ? parseInt(height) : 190}
      />
    );
  };

  const handleSubmit = () => {
    disableConfirmation();
    dispatch(setHasChanges(false));

    if (!modelData) {
      return;
    }

    if (!version) {
      const payload = generatePayloadUpdate({
        ...modelData,
        documentation: value,
      });

      updateModel({
        payload: payload,
        prefix: modelData.prefix,
        isApplicationProfile: modelData.type === 'PROFILE',
      });
    } else {
      const payload = generatePayloadVersionedUpdate({
        ...modelData,
        documentation: value,
      });

      updateVersionedModel({
        payload: payload,
        modelId: modelId,
        version: version,
      });
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setValue(
      modelData?.documentation
        ? Object.keys(modelData.documentation).length > 0
          ? modelData.documentation
          : modelData.languages.reduce(
              (acc, lang) => ({ ...acc, [lang]: '' }),
              {}
            )
        : {}
    );
    dispatch(setHasChanges(false));
    disableConfirmation();
  };

  const handleUpdate = (data: { [key: string]: string }) => {
    enableConfirmation();
    dispatch(setHasChanges(true));
    setValue(data);
  };

  const handleButtonClick = (key: string) => {
    const addNewLine = getAddNewLine(value[currentLanguage], selection.start);
    const selectionData =
      ['link', 'image'].includes(key) && selection.start !== selection.end
        ? value[currentLanguage].substring(selection.start, selection.end)
        : undefined;
    const elem = getSpecialCharacters(key, addNewLine, t, selectionData);

    handleUpdate({
      ...value,
      [currentLanguage]: injectSpecialCharacters(
        value[currentLanguage],
        selection,
        elem,
        selectionData ? true : false
      ),
    });

    textAreaRef.current?.focus();

    let startOffset = 0;
    let endOffset = 0;

    switch (key) {
      case 'italic':
      case 'link':
        startOffset = 1;
        endOffset = 1;
        break;
      case 'bold':
      case 'listBulleted':
      case 'quote':
      case 'image':
        startOffset = 2;
        endOffset = 2;
        break;
      case 'listNumbered':
        startOffset = 3;
        endOffset = 3;
        break;
      default:
        break;
    }

    setUpdateSelectionPosition({
      update: true,
      startOffset: startOffset,
      endOffset: endOffset,
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
        handleUpdate({
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

      handleUpdate({
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

  const handleIsEdit = () => {
    if (graphHasChanges) {
      dispatch(setDisplayGraphHasChanges(true));
      return;
    }

    setIsEdit(true);
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (modelData) {
      if (Object.keys(modelData.documentation).length < 1) {
        setValue(
          modelData.languages.reduce(
            (acc, lang) => ({ ...acc, [lang]: '' }),
            {}
          )
        );
      } else {
        setValue(modelData.documentation);
      }

      setCurrentLanguage(
        modelData.languages.includes(i18n.language)
          ? i18n.language
          : [...modelData.languages].sort((a, b) => compareLocales(a, b))[0] ??
              'fi'
      );
    }
  }, [modelData, i18n.language]);

  useEffect(() => {
    if (result.isSuccess || versionedResult.isSuccess) {
      setIsEdit(false);
      disableConfirmation();
      dispatch(setNotification('DOCUMENTATION_EDIT'));
    }
  }, [result, versionedResult, disableConfirmation, dispatch]);

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

  useEffect(() => {
    if (updateSelectionPosition.update && textAreaRef.current) {
      textAreaRef.current.setSelectionRange(
        selection.start + updateSelectionPosition.startOffset,
        selection.end + updateSelectionPosition.endOffset
      );
      setUpdateSelectionPosition({
        update: false,
        startOffset: 0,
        endOffset: 0,
      });
    }
  }, [updateSelectionPosition, textAreaRef, selection.start, selection.end]);

  useEffect(() => {
    if (hoverRef) {
      const timer = setTimeout(() => {
        setShowHover(true);
      }, 750);

      return () => clearTimeout(timer);
    }

    if (!hoverRef) {
      setShowHover(false);
    }
  }, [hoverRef]);

  return (
    <>
      <StaticHeader ref={ref}>
        <HeaderRow>
          <Text variant="bold">
            {!isEdit ? t('documentation') : t('edit-documentation')}
          </Text>

          {hasPermission &&
            (isEdit ? (
              <div
                style={{
                  display: 'flex',
                  gap: '15px',
                }}
              >
                <Button
                  onClick={() => handleSubmit()}
                  id={
                    result.isLoading || versionedResult.isLoading
                      ? 'submit-button_submitted'
                      : 'submit-button'
                  }
                >
                  {result.isLoading || versionedResult.isLoading ? (
                    <div role="alert">
                      <StyledSpinner
                        variant="small"
                        text={t('saving')}
                        textAlign="right"
                      />
                    </div>
                  ) : (
                    <>{t('save')}</>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleCancel()}
                  id="cancel-button"
                >
                  {t('cancel-variant')}
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => handleIsEdit()}
                id="edit-button"
              >
                {t('edit')}
              </Button>
            ))}
        </HeaderRow>
      </StaticHeader>

      <UnsavedAlertModal
        visible={displayGraphHasChanges}
        handleFollowUp={() => setIsEdit(true)}
      />
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
        {modelData?.modified !== modelData?.created ? (
          <div>
            {t('updated')}: <FormattedDate date={modelData?.modified} />
            {modelData?.modifier.name ? `, ${modelData.modifier.name}` : ''}
          </div>
        ) : (
          <></>
        )}

        <div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            unwrapDisallowed={false}
            components={{
              img: (props) => imgProps(props),
            }}
          >
            {getLanguageVersion({
              data: modelData?.documentation,
              lang: displayLang ?? i18n.language,
            }) !== ''
              ? getLanguageVersion({
                  data: modelData?.documentation,
                  lang: displayLang ?? i18n.language,
                  appendLocale: true,
                })
              : ''}
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
                  id="language-selector-button"
                >
                  {translateLanguage(lang, t)}
                </LanguageSelectorBtn>
              ))}
        </LanguageSelectorWrapper>

        <ContentWrapper>
          <div>
            <ControlsRow>
              <div>
                <ControlButton
                  variant="secondary"
                  onClick={() => handleButtonClick('bold')}
                  id="bold-button"
                  icon={<IconBold />}
                  onMouseEnter={(ref) => setHoverRef(ref.currentTarget)}
                  onMouseLeave={() => setHoverRef(null)}
                />
                <ControlButton
                  variant="secondary"
                  onClick={() => handleButtonClick('italic')}
                  id="italic-button"
                  icon={<IconItalics />}
                  onMouseEnter={(ref) => setHoverRef(ref.currentTarget)}
                  onMouseLeave={() => setHoverRef(null)}
                />
                <ControlButton
                  variant="secondary"
                  onClick={() => handleButtonClick('quote')}
                  id="quote-button"
                  icon={<IconQuotes />}
                  onMouseEnter={(ref) => setHoverRef(ref.currentTarget)}
                  onMouseLeave={() => setHoverRef(null)}
                />
                <ControlButton
                  variant="secondary"
                  onClick={() => handleButtonClick('listBulleted')}
                  id="list-bulleted-button"
                  icon={<IconListBulleted />}
                  onMouseEnter={(ref) => setHoverRef(ref.currentTarget)}
                  onMouseLeave={() => setHoverRef(null)}
                />
                <ControlButton
                  variant="secondary"
                  onClick={() => handleButtonClick('listNumbered')}
                  id="list-numbered-button"
                  icon={<IconListNumbered />}
                  onMouseEnter={(ref) => setHoverRef(ref.currentTarget)}
                  onMouseLeave={() => setHoverRef(null)}
                />
                <ControlButton
                  variant="secondary"
                  onClick={() => handleButtonClick('link')}
                  id="link-button"
                  icon={<IconAttachment />}
                  onMouseEnter={(ref) => setHoverRef(ref.currentTarget)}
                  onMouseLeave={() => setHoverRef(null)}
                />
                <ControlButton
                  variant="secondary"
                  onClick={() => handleButtonClick('image')}
                  id="image-button"
                  icon={<IconImage />}
                  onMouseEnter={(ref) => setHoverRef(ref.currentTarget)}
                  onMouseLeave={() => setHoverRef(null)}
                />
              </div>
              <HintText>
                {value[currentLanguage]?.length ?? 0} / 50000 {t('characters')}
              </HintText>
            </ControlsRow>

            {hoverRef && (
              <TipTooltipWrapper
                $x={hoverRef && hoverRef.getBoundingClientRect().x}
                $y={hoverRef && hoverRef.getBoundingClientRect().y}
                breakpoint$={breakpoint}
              >
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                  anchorElement={hoverRef}
                  open={showHover}
                >
                  {translateDocumentationTooltip(hoverRef.id, t)}
                </Tooltip>
              </TipTooltipWrapper>
            )}

            <FullWidthTextarea
              ref={textAreaRef}
              labelText=""
              labelMode="hidden"
              value={value[currentLanguage] ?? ''}
              onChange={(e) =>
                handleUpdate({
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
              id="documentation-textarea"
              maxLength={TEXT_AREA_MAX}
            />
          </div>

          <div>
            <div>
              <Text variant="bold" smallScreen>
                {t('preview')}
              </Text>
            </div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              unwrapDisallowed={false}
              components={{
                img: (props) => imgProps(props),
              }}
            >
              {value[currentLanguage]}
            </ReactMarkdown>
          </div>
        </ContentWrapper>
      </DrawerContent>
    );
  }
}
