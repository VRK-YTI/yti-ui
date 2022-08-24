import '@app/tests/matchMedia.mock';
import { render, screen } from '@testing-library/react';
import OrganizationalInformation from './organizational-information';
import { themeProvider } from '@app/tests/test-utils';
import userEvent from '@testing-library/user-event';

describe('organizational-information', () => {
  it('should render component', () => {
    const mockFn = jest.fn();

    render(<OrganizationalInformation infoKey="orgInfo" update={mockFn} />, {
      wrapper: themeProvider,
    });

    expect(
      screen.getByText('tr-organizational-information')
    ).toBeInTheDocument();
  });

  it('should call update when values are changed', () => {
    const mockFn = jest.fn();

    render(<OrganizationalInformation infoKey="orgInfo" update={mockFn} />, {
      wrapper: themeProvider,
    });

    userEvent.click(
      screen.getByPlaceholderText('tr-change-history-placeholder')
    );
    userEvent.keyboard('new history information');

    userEvent.click(screen.getByPlaceholderText('tr-etymology-placeholder'));

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      key: 'orgInfo',
      value: {
        changeHistory: 'new history information',
        editorialNote: [],
        etymology: '',
      },
    });

    userEvent.keyboard('new etymology information');
    userEvent.click(
      screen.getByPlaceholderText('tr-change-history-placeholder')
    );

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith({
      key: 'orgInfo',
      value: {
        changeHistory: 'new history information',
        editorialNote: [],
        etymology: 'new etymology information',
      },
    });
  });
});
