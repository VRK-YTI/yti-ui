import React from 'react';
import { render, screen } from '@testing-library/react';
import MultilingualDefinitionList from './multilingual-definition-list';
import { themeProvider } from '@app/tests/test-utils';

describe('multilingual-definition-list', () => {
  it('should render component', async () => {
    render(
      <MultilingualDefinitionList
        items={[
          { language: 'en', content: 'This is a test.' },
          { language: 'fi', content: 'Tämä on testi.' },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('This is a test.')).toBeInTheDocument();
    expect(screen.getByText('Tämä on testi.')).toBeInTheDocument();
  });
});
