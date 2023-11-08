import { fireEvent, screen } from '@testing-library/react';
import OrganizationalInformation from './organizational-information';
import { renderWithProviders } from '@app/tests/test-utils';
import { EmptyFormError } from '../validate-form';

describe('organizational-information', () => {
  it('should render component', () => {
    const mockFn = jest.fn();

    renderWithProviders(
      <OrganizationalInformation
        infoKey="orgInfo"
        update={mockFn}
        errors={EmptyFormError}
      />
    );

    expect(
      screen.getByText('tr-organizational-information')
    ).toBeInTheDocument();
  });

  it('should call update when values are changed', async () => {
    const mockFn = jest.fn();

    renderWithProviders(
      <OrganizationalInformation
        infoKey="orgInfo"
        update={mockFn}
        errors={EmptyFormError}
      />
    );

    const changeHistory = screen.getByPlaceholderText(
      'tr-change-history-placeholder'
    );
    const changeEtymology = screen.getByPlaceholderText(
      'tr-etymology-placeholder'
    );

    fireEvent.click(changeHistory);
    fireEvent.change(changeHistory, {
      target: { value: 'new history information' },
    });
    fireEvent.focusOut(changeHistory);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      key: 'orgInfo',
      value: {
        changeHistory: 'new history information',
        editorialNote: [],
        etymology: '',
      },
    });

    fireEvent.click(changeEtymology);
    fireEvent.change(changeEtymology, {
      target: { value: 'new etymology information' },
    });
    fireEvent.focusOut(changeEtymology);

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
