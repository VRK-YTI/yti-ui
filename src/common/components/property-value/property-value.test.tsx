import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyValue from '.';
import { useTranslation } from 'next-i18next';

jest.mock('next-i18next');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedUseTranslation = useTranslation as jest.MockedFunction<any>;

describe('PropertyValue', () => {
  test('should render unlocalized value even if primary language is set', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[{ lang: '', value: 'Value (no-lang)', regex: '' }]}
        fallbackLanguage="fi"
      />
    );

    expect(screen.queryByText('Value (no-lang)')).toBeTruthy();
  });

  test('should render localized value in primary language when found', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[
          { lang: 'en', value: 'Value (en)', regex: '' },
          { lang: 'fi', value: 'Value (fi)', regex: '' },
        ]}
        fallbackLanguage="fi"
      />
    );

    expect(screen.queryByText('Value (en)')).toBeTruthy();
    expect(screen.queryByText('Value (fi)')).toBeFalsy();
  });

  test('should render localized value in fallback language when found', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[
          { lang: 'fi', value: 'Value (fi)', regex: '' },
          { lang: 'sv', value: 'Value (sv)', regex: '' },
        ]}
        fallbackLanguage="fi"
      />
    );

    expect(screen.queryByText('Value (fi)')).toBeTruthy();
    expect(screen.queryByText('Value (sv)')).toBeFalsy();
  });

  test('should not render value in wrong language', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[{ lang: 'sv', value: 'Value (sv)', regex: '' }]}
        fallbackLanguage="fi"
      />
    );

    expect(screen.queryByText('Value (sv)')).toBeFalsy();
  });

  test('should join found values when delimiter is given', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[
          { lang: 'en', value: 'Value 1', regex: '' },
          { lang: 'en', value: 'Value 2', regex: '' },
        ]}
        delimiter=", "
      />
    );

    expect(screen.queryByText('Value 1, Value 2')).toBeTruthy();
  });

  test('should join found values when delimiter is empty string', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[
          { lang: 'en', value: 'Value 1', regex: '' },
          { lang: 'en', value: 'Value 2', regex: '' },
        ]}
        delimiter=""
      />
    );

    expect(screen.queryByText('Value 1Value 2')).toBeTruthy();
  });
});
