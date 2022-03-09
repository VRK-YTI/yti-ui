import React from 'react';
import { render, screen } from '@testing-library/react';
import MultilingualDefinitionList from './multilingual-definition-list';
import { themeProvider } from '../../../tests/test-utils';

describe('multilingual-definition-list', () => {
  test('should render component', async () => {
    render(
      <MultilingualDefinitionList items={[
        { language: 'en', content: 'This is a test.' },
        { language: 'fi', content: 'Tämä on testi.' },
      ]} />,
      { wrapper: themeProvider }
    );

    const test1 = await screen.findByText('This is a test.');
    const test2 = await screen.findByText('Tämä on testi.');

    expect(test1).toBeTruthy();
    expect(test2).toBeTruthy();
  });
});
