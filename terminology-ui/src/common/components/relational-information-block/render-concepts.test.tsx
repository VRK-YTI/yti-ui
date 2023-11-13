import { fireEvent, screen } from '@testing-library/react';
import RenderConcepts from './render-concepts';
import { renderWithProviders } from '@app/tests/test-utils';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('render-concepts', () => {
  it('should render component', () => {
    const mockFn = jest.fn();

    mockRouter.setCurrentUrl(
      'terminology/123-456-789/concept/123-123-123/edit'
    );

    renderWithProviders(
      <RenderConcepts concepts={concepts} chosen={[]} setChosen={mockFn} />
    );

    expect(screen.getByText('label1')).toBeInTheDocument();
    expect(screen.getByText('label2')).toBeInTheDocument();
  });

  it('should call update when concept selected', () => {
    const mockFn = jest.fn();

    mockRouter.setCurrentUrl(
      'terminology/123-456-789/concept/123-123-123/edit'
    );

    renderWithProviders(
      <RenderConcepts concepts={concepts} chosen={[]} setChosen={mockFn} />
    );

    fireEvent.click(screen.queryAllByRole('checkbox')[0]);
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
