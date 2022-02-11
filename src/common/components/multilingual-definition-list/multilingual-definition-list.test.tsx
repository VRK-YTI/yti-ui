import React from 'react';
import { render, screen } from '@testing-library/react';
import MultilingualDefinitionList from './multilingual-definition-list';
import { themeProvider } from '../../../tests/test-utils';

describe('multilingual-definition-list', () => {
  test('should render component', () => {
    render(
      <MultilingualDefinitionList items={[
        { language: 'en', content: 'This is a test.' },
        { language: 'fi', content: 'Tämä on testi.' },
      ]} />,
      { wrapper: themeProvider }
    );

    expect(screen.queryByText('This is a test.')).toBeTruthy();
    //expect(screen.queryByText('This is a test.')).toHaveAttribute('lang', 'en');

    expect(screen.queryByText('Tämä on testi.')).toBeTruthy();
    //expect(screen.queryByText('Tämä on testi.')).toHaveAttribute('lang', 'fi');
  });
});
