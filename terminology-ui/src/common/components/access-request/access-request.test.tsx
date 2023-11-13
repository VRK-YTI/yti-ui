import { fireEvent, screen } from '@testing-library/react';
import AccessRequest from '.';
import { initialState } from '../login/login.slice';
import { renderWithProviders } from '@app/tests/test-utils';
import { accessRequestApi } from './access-request.slice';

describe('access-request', () => {
  beforeEach(() => {
    const appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
  });

  const organizations = [
    {
      code: '',
      id: '123123-321321',
      properties: {
        prefLabel: {
          lang: 'fi',
          value: 'Test-org',
          regex: '',
        },
      },
      type: {
        graph: {
          id: '321321-321321',
        },
        id: 'Organization',
      },
      uri: '',
    },
  ];

  it('should render component', async () => {
    renderWithProviders(<AccessRequest organizations={organizations} />, [
      accessRequestApi,
    ]);

    fireEvent.click(screen.getByText('tr-access-request-access'));

    const el = await screen.findByText('tr-access-pick-org');
    expect(el).toBeInTheDocument();

    expect(screen.getByText(/tr-access-terminology/)).toBeInTheDocument();
    expect(screen.getByText(/tr-access-reference-data/)).toBeInTheDocument();
    expect(screen.getByText(/tr-access-data-vocabularies/)).toBeInTheDocument();
  });

  it('should mark checkboxes if user already has role', async () => {
    const loginInitialState = Object.assign({}, initialState);
    loginInitialState['rolesInOrganizations'] = {
      '123123-321321': ['TERMINOLOGY_EDITOR'],
    };

    renderWithProviders(
      <AccessRequest organizations={organizations} />,
      [accessRequestApi],
      {
        preloadedState: {
          login: loginInitialState,
        },
      }
    );

    fireEvent.click(screen.getByText('tr-access-request-access'));
    const el = await screen.findAllByText('tr-access-pick-org');
    fireEvent.click(el[0]);
    fireEvent.click(screen.getByText('Test-org'));
    fireEvent.click(screen.getByText('tr-access-terminology'));
    fireEvent.click(screen.getByText('tr-access-send-request'));
    expect(
      screen.getByText(/tr-access-request-already-sent/)
    ).toBeInTheDocument();
  });
});
