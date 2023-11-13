import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@app/tests/test-utils';
import RelationalInformationBlock from '.';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('relational-information-block', () => {
  let appRoot: HTMLDivElement | null = null;

  beforeEach(() => {
    appRoot = document.createElement('div');
    appRoot.setAttribute('id', '__next');
    document.body.appendChild(appRoot);
  });

  it('should render component', () => {
    const mockFn = jest.fn();
    mockRouter.setCurrentUrl(
      '/terminology/123-456-789/new-concept?terminologyId=123-456-789'
    );

    renderWithProviders(
      <RelationalInformationBlock
        infoKey="relationalInformation"
        title="title"
        buttonTitle="buttonTitle"
        description="description"
        chipLabel="chipLabel"
        data={{ empty: [] }}
        updateData={mockFn}
      />
    );

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('buttonTitle')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('should render selected concepts', () => {
    const mockFn = jest.fn();
    mockRouter.setCurrentUrl(
      '/terminology/123-456-789/new-concept?terminologyId=123-456-789'
    );

    renderWithProviders(
      <RelationalInformationBlock
        infoKey="relationalInformation"
        title="title"
        buttonTitle="buttonTitle"
        description="description"
        chipLabel="chipLabel"
        data={data}
        updateData={mockFn}
      />
    );

    expect(screen.getByText('label1')).toBeInTheDocument();
    expect(screen.getByText('label2')).toBeInTheDocument();
  });

  it('should update selected concepts', () => {
    const mockFn = jest.fn();
    mockRouter.setCurrentUrl(
      '/terminology/123-456-789/new-concept?terminologyId=123-456-789'
    );

    renderWithProviders(
      <RelationalInformationBlock
        infoKey="relationalInformation"
        title="title"
        buttonTitle="buttonTitle"
        description="description"
        chipLabel="chipLabel"
        data={data}
        updateData={mockFn}
      />
    );

    fireEvent.click(screen.getByText('label2'));
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('relationalInformation', [
      data.relationalInformation[0],
    ]);
    expect(screen.queryByText('label2')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('label1'));
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('relationalInformation', []);
    expect(screen.queryByText('label1')).not.toBeInTheDocument();
  });
});

const data = {
  relationalInformation: [
    {
      id: '123',
      label: { fi: 'label1' },
      terminologyId: '789',
      terminologyLabel: { fi: 'terminology' },
    },
    {
      id: '456',
      label: { fi: 'label2' },
      terminologyId: '789',
      terminologyLabel: { fi: 'terminology' },
    },
  ],
};
