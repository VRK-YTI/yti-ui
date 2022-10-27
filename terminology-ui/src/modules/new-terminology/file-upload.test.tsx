import { render, screen } from '@testing-library/react';
import FileUpload from './file-upload';
import { getMockContext, themeProvider } from '@app/tests/test-utils';
import { Provider } from 'react-redux';
import { makeStore } from '@app/store';

describe('file-upload', () => {
  it('should render component', () => {
    const store = makeStore(getMockContext());
    const mockClose = jest.fn();
    const mockPost = jest.fn();

    render(
      <Provider store={store}>
        <FileUpload
          handleClose={mockClose}
          handlePost={mockPost}
          importResponseStatus="success"
          importResponseData={{
            jobToken: '123-123-123',
            message: 'PROCESSING',
          }}
        />
      </Provider>,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText(/tr-percent-done/)).toBeInTheDocument();
  });

  it('should render try again', () => {
    const store = makeStore(getMockContext());
    const mockClose = jest.fn();
    const mockPost = jest.fn();

    render(
      <Provider store={store}>
        <FileUpload
          handleClose={mockClose}
          handlePost={mockPost}
          importResponseStatus="rejected"
          importResponseData={{
            jobToken: '',
            message: '',
          }}
        />
      </Provider>,
      {
        wrapper: themeProvider,
      }
    );

    expect(screen.getByText('tr-try-again')).toBeInTheDocument();
  });
});
