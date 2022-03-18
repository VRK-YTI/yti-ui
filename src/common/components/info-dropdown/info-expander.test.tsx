import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoExpander from './info-expander';
import { themeProvider } from '../../../tests/test-utils';

describe('infoExpander', () => {
  it('should render export button', () => {
    render(
      <InfoExpander
        data={
          {
            properties: {},
            references: {
              contributor: [{ properties: { prefLabel: [] } }],
              inGroup: [{ properties: { prefLabel: [] } }],
            },
          } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }
      />,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText('tr-vocabulary-info-vocabulary-export')
    ).toBeInTheDocument();
  });
});
