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

export default function LinkBlock({
  data,
  errors,
  setData,
}: {
  data: ModelFormType['links'];
  errors: {
    linksMissingInfo?: boolean;
    linksInvalidUri?: boolean;
  };
  setData: (data: ModelFormType['links']) => void;
}) {
  const { t } = useTranslation('admin');

  const addLink = () => {
    setData([
      ...data,
      {
        description: '',
        name: '',
        uri: '',
        id: v4().split('-')[0],
      },
    ]);
  };

  const removeLink = (id: string) => {
    setData(data.filter((link) => link.id !== id));
  };

  const handleUpdate = (id: string, key: string, value: string) => {
    setData(
      data.map((link) => {
        if (link.id !== id) {
          return link;
        }

        return {
          ...link,
          [key]: value,
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
                  <TextInput
                    labelText="Linkin nimi"
                    defaultValue={link.name}
                    onBlur={(e) =>
                      handleUpdate(link.id, 'name', e.target.value ?? '')
                    }
                    status={
                      errors.linksMissingInfo &&
                      (!link.name || link.name === '')
                        ? 'error'
                        : 'default'
                    }
                  />

                  <TextInput
                    labelText="Linkin verkko-osoite"
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
                  />

                  <Textarea
                    labelText="Kuvaus"
                    optionalText={t('optional')}
                    defaultValue={link.description}
                    onBlur={(e) =>
                      handleUpdate(link.id, 'description', e.target.value ?? '')
                    }
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
              Lisää linkki
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
