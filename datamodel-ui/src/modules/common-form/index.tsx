import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  Text,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import ConceptBlock from '../class-form/concept-block';
import { LanguageVersionedWrapper } from '../class-form/class-form.styles';
import { statusList } from 'yti-common-ui/utils/status-list';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { FormWrapper } from './common-form.styles';
import InlineListBlock from '@app/common/components/inline-list-block';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';

interface AttributeFormProps {
  handleReturn: () => void;
}

export default function CommonForm({ handleReturn }: AttributeFormProps) {
  const { t } = useTranslation('admin');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [languages] = useState(['fi']);
  const [data, setData] = useState({});
  const statuses = statusList;

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Button
            variant="secondaryNoBorder"
            icon="arrowLeft"
            style={{ textTransform: 'uppercase' }}
            onClick={() => handleReturn()}
          >
            {t('back', { ns: 'common' })}
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text variant="bold">Attribuutin nimi</Text>

          <div>
            <Button style={{ marginRight: '15px' }}>{t('save')}</Button>
            <Button variant="secondary" onClick={() => handleReturn()}>
              {t('cancel-variant')}
            </Button>
          </div>
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        <FormWrapper>
          <ConceptBlock setConcept={() => null} />

          <LanguageVersionedWrapper>
            {languages.map((lang) => (
              <TextInput
                key={`label-${lang}`}
                className="wide-text"
                labelText={`Attribuutin nimi, ${lang}`}
                value={''}
                onChange={(e) => setData({})}
              />
            ))}
          </LanguageVersionedWrapper>

          <TextInput labelText={'Attribuutin yksilöivä tunnus'} />

          <InlineListBlock
            label="Yläattribuutit"
            items={[
              { id: '1', label: 'testi1' },
              { id: '2', label: 'testi2' },
            ]}
            button={
              <Button variant="secondary" icon="plus">
                Lisää yläattribuutti
              </Button>
            }
          />

          <InlineListBlock
            label="Vastaavat attribuutit"
            items={[]}
            button={
              <Button variant="secondary">Lisää vastaava attribuutti</Button>
            }
          />

          <div>
            <Dropdown labelText="Tila" defaultValue="DRAFT">
              {statuses.map((status) => (
                <DropdownItem key={`status-${status}`} value={status}>
                  {translateStatus(status, t)}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          <LanguageVersionedWrapper>
            {languages.map((lang) => (
              <Textarea
                key={`label-${lang}`}
                labelText={`Attribuutin lisätiedot, ${lang}`}
                value={''}
                onChange={(e) => setData({})}
                optionalText={t('optional')}
                className="wide-text"
              />
            ))}
          </LanguageVersionedWrapper>

          <Textarea
            labelText={'Muokkaajan kommentti'}
            optionalText={t('optional')}
            className="wide-text"
          />
        </FormWrapper>
      </DrawerContent>
    </>
  );
}
