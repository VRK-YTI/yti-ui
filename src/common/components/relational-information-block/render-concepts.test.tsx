import { render, screen } from '@testing-library/react';
import RenderConcepts from './render-concepts';
import { getMockContext, themeProvider } from '@app/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@app/store';

describe('render-concepts', () => {
  it('should render component', () => {
    const store = makeStore(getMockContext());
    const mockFn = jest.fn();

    render(
      <Provider store={store}>
        <RenderConcepts
          concepts={concepts}
          chosen={[]}
          setChosen={mockFn}
          terminologyId="123-456-789"
        />
      </Provider>,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('label1')).toBeInTheDocument();
    expect(screen.getByText('label2')).toBeInTheDocument();
  });

  it('should call update when concept selected', () => {
    const store = makeStore(getMockContext());
    const mockFn = jest.fn();

    render(
      <Provider store={store}>
        <RenderConcepts
          concepts={concepts}
          chosen={[]}
          setChosen={mockFn}
          terminologyId="123-456-789"
        />
      </Provider>,
      { wrapper: themeProvider }
    );

    userEvent.click(screen.queryAllByRole('checkbox')[0]);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith([concepts[0]]);
  });
});

const concepts = [
  {
    id: '1',
    label: {
      fi: 'label1',
    },
    status: 'VALID',
    terminology: {
      id: '123-456-789',
      label: {
        fi: 'terminology1',
      },
      status: 'VALID',
      uri: '',
    },
    altLabel: {
      fi: '',
    },
    definition: {
      fi: '',
    },
    modified: '',
    uri: '',
  },
  {
    id: '2',
    label: {
      fi: 'label2',
    },
    status: 'VALID',
    terminology: {
      id: '123-456-789',
      label: {
        fi: 'terminology1',
      },
      status: 'VALID',
      uri: '',
    },
    altLabel: {
      fi: '',
    },
    definition: {
      fi: '',
    },
    modified: '',
    uri: '',
  },
];
