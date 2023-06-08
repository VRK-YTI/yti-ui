import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import AccessRequest from '.';
import { makeStore } from '../../../store';
import { getMockContext, themeProvider } from '../../../tests/test-utils';
import { setLogin, initialState } from '../login/login.slice';

describe('access-request', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
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
    const store = makeStore(getMockContext());

    render(
      <Provider store={store}>
        <AccessRequest organizations={organizations} />
      </Provider>,
      { wrapper: themeProvider }
    );

    userEvent.click(screen.getByText('tr-access-request-access'));
    const el = await screen.findByText('tr-access-pick-org');
    expect(el).toBeInTheDocument();
    expect(screen.getByText(/tr-access-terminology/)).toBeInTheDocument();
    expect(screen.getByText(/tr-access-reference-data/)).toBeInTheDocument();
    expect(screen.getByText(/tr-access-data-vocabularies/)).toBeInTheDocument();
  });

  it('should mark checkboxes if user already has role', async () => {
    const store = makeStore(getMockContext());
    const loginInitialState = Object.assign({}, initialState);
    loginInitialState['rolesInOrganizations'] = {
      '123123-321321': ['TERMINOLOGY_EDITOR'],
    };
    store.dispatch(setLogin(loginInitialState));

    render(
      <Provider store={store}>
        <AccessRequest organizations={organizations} />
      </Provider>,
      { wrapper: themeProvider }
    );

    userEvent.click(screen.getByText('tr-access-request-access'));
    const el = await screen.findAllByText('tr-access-pick-org');
    userEvent.click(el[0]);
    userEvent.click(screen.getByText('Test-org'));
    userEvent.click(screen.getByText('tr-access-terminology'));
    userEvent.click(screen.getByText('tr-access-send-request'));
    expect(
      screen.getByText(/tr-access-request-already-sent/)
    ).toBeInTheDocument();
  });
});
