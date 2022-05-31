import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import InfoFile from './info-file';

describe('info-file', () => {
  it('should render component', () => {
    const mockSetFileData = jest.fn();
    const mockSetIsValid = jest.fn();

    render(
      <InfoFile setFileData={mockSetFileData} setIsValid={mockSetIsValid} />,
      {
        wrapper: themeProvider,
      }
    );

    expect(
      screen.getByText('tr-add-or-drag-a-new-file-here')
    ).toBeInTheDocument();
    expect(screen.getByText(/tr-allowed-file-formats/)).toBeInTheDocument();
  });
});
