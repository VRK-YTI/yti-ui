import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import FileDropArea from './';

describe('file-drop-area', () => {
  it('should render component', () => {
    const mockSetFileData = jest.fn();
    const mockSetIsValid = jest.fn();

    render(
      <FileDropArea
        setFileData={mockSetFileData}
        setIsValid={mockSetIsValid}
        validFileTypes={['xlsx']}
      />,
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
