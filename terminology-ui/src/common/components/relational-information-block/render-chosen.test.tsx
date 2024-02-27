import { renderWithProviders } from '@app/tests/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import RenderChosen from './render-chosen';

describe('render-chosen', () => {
  it('should render component', () => {
    const setChosenMock = jest.fn();
    const setShowChosenMock = jest.fn();

    renderWithProviders(
      <RenderChosen
        chosen={chosen}
        setChosen={setChosenMock}
        setShowChosen={setShowChosenMock}
        chipLabel={'chipLabel'}
      />
    );

    expect(screen.getByText('chosen1')).toBeInTheDocument();
    expect(screen.getByText('chosen2')).toBeInTheDocument();
  });

  it('should call setChosen() when chip is clicked', () => {
    const setChosenMock = jest.fn();
    const setShowChosenMock = jest.fn();

    renderWithProviders(
      <RenderChosen
        chosen={chosen}
        setChosen={setChosenMock}
        setShowChosen={setShowChosenMock}
        chipLabel={'chipLabel'}
      />
    );

    expect(screen.getByText('chosen1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('chosen1'));

    expect(setChosenMock).toHaveBeenCalledTimes(1);
    expect(setChosenMock).toHaveBeenCalledWith([chosen[1]]);
  });

  it('should call setShowChosen when last chip is removed', () => {
    const setChosenMock = jest.fn();
    const setShowChosenMock = jest.fn();

    renderWithProviders(
      <RenderChosen
        chosen={[chosen[0]]}
        setChosen={setChosenMock}
        setShowChosen={setShowChosenMock}
        chipLabel={'chipLabel'}
      />
    );

    expect(screen.getByText('chosen1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('chosen1'));

    expect(setChosenMock).toHaveBeenCalledTimes(1);
    expect(setShowChosenMock).toHaveBeenCalledTimes(1);
  });
});

const chosen = [
  {
    altLabel: {},
    definition: {},
    id: '1',
    label: {
      fi: 'chosen1',
    },
    modified: '',
    status: '',
    terminology: {
      id: '',
      label: {},
      status: 'VALID',
      uri: '',
    },
    uri: '',
  },
  {
    altLabel: {},
    definition: {},
    id: '2',
    label: {
      fi: 'chosen2',
    },
    modified: '',
    status: '',
    terminology: {
      id: '',
      label: {},
      status: 'VALID',
      uri: '',
    },
    uri: '',
  },
];
