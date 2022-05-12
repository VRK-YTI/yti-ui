import { render, screen } from '@testing-library/react';
import { themeProvider } from '@app/tests/test-utils';
import RelationalInformationBlock from '.';
import mockRouter from 'next-router-mock';
import userEvent from '@testing-library/user-event';

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

    render(
      <RelationalInformationBlock
        infoKey="relationalInformation"
        title="title"
        buttonTitle="buttonTitle"
        description="description"
        chipLabel="chipLabel"
        data={{ empty: [] }}
        updateData={mockFn}
      />,
      { wrapper: themeProvider }
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

    render(
      <RelationalInformationBlock
        infoKey="relationalInformation"
        title="title"
        buttonTitle="buttonTitle"
        description="description"
        chipLabel="chipLabel"
        data={data}
        updateData={mockFn}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('label1')).toBeInTheDocument();
    expect(screen.getByText('label2')).toBeInTheDocument();
  });

  it('should update selected concepts', () => {
    const mockFn = jest.fn();
    mockRouter.setCurrentUrl(
      '/terminology/123-456-789/new-concept?terminologyId=123-456-789'
    );

    render(
      <RelationalInformationBlock
        infoKey="relationalInformation"
        title="title"
        buttonTitle="buttonTitle"
        description="description"
        chipLabel="chipLabel"
        data={data}
        updateData={mockFn}
      />,
      { wrapper: themeProvider }
    );

    userEvent.click(screen.getByText('label2'));
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('relationalInformation', [
      data.relationalInformation[0],
    ]);
    expect(screen.queryByText('label2')).not.toBeInTheDocument();

    userEvent.click(screen.getByText('label1'));
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('relationalInformation', []);
    expect(screen.queryByText('label1')).not.toBeInTheDocument();
  });
});

const data = {
  relationalInformation: [
    {
      altLabel: { fi: 'altLabel1' },
      definition: { fi: 'definition1' },
      id: '123',
      label: {
        fi: 'label1',
      },
      modified: '',
      status: 'VALID',
      terminology: {
        id: '',
        label: { fi: 'terminology' },
        status: 'VALID',
        uri: '',
      },
      uri: '',
    },
    {
      altLabel: { fi: 'altLabel2' },
      definition: { fi: 'definition2' },
      id: '456',
      label: {
        fi: 'label2',
      },
      modified: '',
      status: 'VALID',
      terminology: {
        id: '',
        label: { fi: 'terminology' },
        status: 'VALID',
        uri: '',
      },
      uri: '',
    },
  ],
};
