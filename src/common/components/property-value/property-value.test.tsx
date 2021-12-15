import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyValue from '.';
import { useTranslation } from 'next-i18next';

jest.mock('next-i18next');
const mockedUseTranslation = useTranslation as jest.MockedFunction<any>;

describe('PropertyValue', () => {
  test('should render unlocalized value even if locale is set', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' }});

    render(
      <PropertyValue property={[
        { lang: '', value: 'Value (no-lang)', regex: '' },
      ]} />
    );

    expect(screen.queryByText('Value (no-lang)')).toBeTruthy();
  });

  test('should render localized value in correct language', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' }});

    render(
      <PropertyValue property={[
        { lang: 'en', value: 'Value (en)', regex: '' },
        { lang: 'fi', value: 'Value (fi)', regex: '' },
      ]} />
    );

    expect(screen.queryByText('Value (en)')).toBeTruthy();
    expect(screen.queryByText('Value (fi)')).toBeFalsy();
  });

  test('should not render value in wrong language', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' }});

    render(
      <PropertyValue property={[
        { lang: 'fi', value: 'Value (fi)', regex: '' },
      ]} />
    );

    expect(screen.queryByText('Value (fi)')).toBeFalsy();
  });
});
