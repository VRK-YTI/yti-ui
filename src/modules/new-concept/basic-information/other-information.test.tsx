import { render, screen } from '@testing-library/react';
import OtherInformation from './other-information';
import { themeProvider } from '@app/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@app/store';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

describe('other-information', () => {
  const mockAdapter = new MockAdapter(axios);

  mockAdapter.onGet(/\/v1\/frontend\/v2\/groups\?language=fi/).reply(200, [
    {
      code: '123',
      properties: {
        prefLabel: {
          value: 'group1',
        },
      },
    },
    {
      code: '456',
      properties: {
        prefLabel: {
          value: 'group2',
        },
      },
    },
  ]);

  it('should render component and content', () => {
    const store = makeStore();
    const mockFn = jest.fn();

    render(
      <Provider store={store}>
        <OtherInformation infoKey="otherInfo" update={mockFn} />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText('tr-concept-other-information')
    ).toBeInTheDocument();
    userEvent.click(screen.getByText('tr-concept-other-information'));
    expect(screen.getByText('tr-concept-class')).toBeInTheDocument();
  });
});
