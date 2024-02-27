import { screen } from '@testing-library/react';
import FileUpload from './file-upload';
import { renderWithProviders } from '@app/tests/test-utils';

describe('file-upload', () => {
  it('should render component', () => {
    const mockClose = jest.fn();
    const mockPost = jest.fn();

    renderWithProviders(
      <FileUpload
        handleClose={mockClose}
        handlePost={mockPost}
        importResponseStatus="success"
        importResponseData={{
          jobToken: '123-123-123',
          message: 'PROCESSING',
        }}
      />
    );

    expect(screen.getByText(/tr-percent-done/)).toBeInTheDocument();
  });

  it('should render try again', () => {
    const mockClose = jest.fn();
    const mockPost = jest.fn();

    renderWithProviders(
      <FileUpload
        handleClose={mockClose}
        handlePost={mockPost}
        importResponseStatus="rejected"
        importResponseData={{
          jobToken: '',
          message: '',
        }}
      />
    );

    expect(screen.getByText('tr-try-again')).toBeInTheDocument();
  });
});
