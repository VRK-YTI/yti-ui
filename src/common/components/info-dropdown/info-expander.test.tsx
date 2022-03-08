/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoExpander from './info-expander';
import { themeProvider } from '../../../tests/test-utils';

describe('InfoExpander', () => {
  test('should render export button', () => {
    render(
      <InfoExpander
        data={
          {
            properties: {},
            references: {
              contributor: [{ properties: { prefLabel: [] } }],
              inGroup: [{ properties: { prefLabel: [] } }],
            },
          } as any
        }
      />,
      { wrapper: themeProvider }
    );

    expect(
      screen.queryAllByText('tr-vocabulary-info-vocabulary-export')
    ).toHaveLength(1);
  });
});
