import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyValue from '.';
import { useTranslation } from 'next-i18next';

jest.mock('next-i18next');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedUseTranslation = useTranslation as jest.MockedFunction<any>;

describe('propertyValue', () => {
  it('should render unlocalized value even if primary language is set', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[{ lang: '', value: 'Value (no-lang)', regex: '' }]}
      />
    );

    expect(screen.getByText('Value (no-lang)')).toBeInTheDocument();
  });

  it('should render localized value in primary language when found', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[
          { lang: 'en', value: 'Value (en)', regex: '' },
          { lang: 'fi', value: 'Value (fi)', regex: '' },
        ]}
      />
    );

    expect(screen.getByText('Value (en)')).toBeInTheDocument();
    expect(screen.queryByText('Value (fi)')).not.toBeInTheDocument();
  });

  it('should render localized value in fallback language order (fi, en, sv) when found', () => {
    mockedUseTranslation.mockReturnValue({ i18n: { language: 'en' } });

    render(
      <PropertyValue
        property={[
          { lang: 'fi', value: 'Value (fi)', regex: '' },
          { lang: 'sv', value: 'Value (sv)', regex: '' },
        ]}
      />
    );

    expect(screen.getByText('Value (fi)')).toBeInTheDocument();
    expect(screen.queryByText('Value (sv)')).not.toBeInTheDocument();
  });

  it('should join found values when delimiter is given', () => {
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

    expect(screen.getByText('Value 1, Value 2')).toBeInTheDocument();
  });

  it('should join found values when delimiter is empty string', () => {
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

    expect(screen.getByText('Value 1Value 2')).toBeInTheDocument();
  });
});
