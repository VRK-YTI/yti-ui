import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import {
  Button,
  IconPlus,
  IconRemove,
  TextInput,
  Textarea,
} from 'suomifi-ui-components';
import { v4 } from 'uuid';
import isURL from 'validator/lib/isURL';
import { BasicBlock } from 'yti-common-ui/block';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';

export default function LinkBlock({
  data,
  errors,
  setData,
  languages,
}: {
  data: ModelFormType['links'];
  errors: {
    linksMissingInfo?: boolean;
    linksInvalidUri?: boolean;
  };
  setData: (data: ModelFormType['links']) => void;
  languages: LanguageBlockType[];
}) {
  const { t } = useTranslation('admin');

  const addLink = () => {
    const defaultValue = languages.reduce(
      (def, lang) => Object.assign(def, { [lang.uniqueItemId]: '' }),
      {}
    );

    setData([
      ...data,
      {
        description: defaultValue,
        name: defaultValue,
        uri: '',
        id: v4().split('-')[0],
      },
    ]);
  };

  const removeLink = (id: string) => {
    setData(data.filter((link) => link.id !== id));
  };

  const handleUpdate = (
    id: string,
    key: string,
    value: { [key: string]: string } | string
  ) => {
    setData(
      data.map((link) => {
        if (link.id !== id) {
          return link;
        }
        const newValue =
          typeof value === 'object'
            ? { ...link[key as 'name' | 'description'], ...value }
            : value;

        return {
          ...link,
          [key]: newValue,
        };
      })
    );
  };

  return (
    <LinkBlockWrapper>
      <BasicBlock
        title="Linkit lisätietoihin"
        extra={
          <>
            {data.map((link) => (
              <div key={`link-wrapper-${link.id}`} className="link-wrapper">
                <div className="text-fields">
                  {languages.map((lang) => (
                    <span key={`link-text-fields-${lang.uniqueItemId}`}>
                      <TextInput
                        key={`link-name-${lang.uniqueItemId}`}
                        labelText={`${t('link-name')}, ${lang.uniqueItemId}`}
                        defaultValue={link.name[lang.uniqueItemId]}
                        onBlur={(e) =>
                          handleUpdate(link.id, 'name', {
                            [lang.uniqueItemId]: e.target.value ?? '',
                          })
                        }
                        status={
                          errors.linksMissingInfo &&
                          (!link.name || link.name[lang.uniqueItemId] === '')
                            ? 'error'
                            : 'default'
                        }
                        maxLength={TEXT_INPUT_MAX}
                      />
                      <Textarea
                        key={`link-description-${lang.uniqueItemId}`}
                        labelText={`${t('description', { ns: 'common' })}, ${
                          lang.uniqueItemId
                        }`}
                        optionalText={t('optional')}
                        defaultValue={link.description[lang.uniqueItemId]}
                        onBlur={(e) =>
                          handleUpdate(link.id, 'description', {
                            [lang.uniqueItemId]: e.target.value ?? '',
                          })
                        }
                        maxLength={TEXT_AREA_MAX}
                      />
                    </span>
                  ))}

                  <TextInput
                    labelText={t('link-url')}
                    defaultValue={link.uri}
                    onBlur={(e) =>
                      handleUpdate(link.id, 'uri', e.target.value ?? '')
                    }
                    status={
                      errors.linksInvalidUri &&
                      (!link.uri || link.uri === '' || !isURL(link.uri))
                        ? 'error'
                        : 'default'
                    }
                    maxLength={TEXT_AREA_MAX}
                  />
                </div>
                <div>
                  <Button
                    variant="secondaryNoBorder"
                    icon={<IconRemove />}
                    id={`remove-link-${link.id}`}
                    onClick={() => removeLink(link.id)}
                  >
                    {t('remove')}
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="secondary"
              icon={<IconPlus />}
              className="add-link"
              onClick={() => addLink()}
            >
              {t('add-link', { ns: 'admin' })}
            </Button>
          </>
        }
      />
    </LinkBlockWrapper>
  );
}

const LinkBlockWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.s};

  .add-link {
    margin-top: ${(props) => props.theme.suomifi.spacing.xxs};
    width: max-content;
  }

  .link-wrapper {
    background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
    border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};

    padding: ${(props) => props.theme.suomifi.spacing.m};
    display: flex;
    gap: ${(props) => props.theme.suomifi.spacing.s};
    width: parent;
  }

  .text-fields {
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.suomifi.spacing.m};
    flex-grow: 1;
  }

  .fi-text-input {
    width: 100%;
  }

  .fi-textarea {
    width: 100%;
  }
`;
