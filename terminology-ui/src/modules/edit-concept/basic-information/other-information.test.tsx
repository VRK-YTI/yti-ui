import { fireEvent, screen } from '@testing-library/react';
import OtherInformation from './other-information';
import { renderWithProviders } from '@app/tests/test-utils';
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
    const mockFn = jest.fn();

    renderWithProviders(
      <OtherInformation infoKey="otherInfo" update={mockFn} />
    );

    expect(
      screen.getByText('tr-concept-other-information')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('tr-concept-other-information'));
    expect(screen.getByText('tr-concept-class')).toBeInTheDocument();
  });
});
