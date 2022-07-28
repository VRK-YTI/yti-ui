import { themeProvider } from '@app/tests/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConceptInfoBlock from './concept-info-block';

describe('concept-info-block', () => {
  it('should add new block', () => {
    const mockFunction = jest.fn();
    render(
      <ConceptInfoBlock
        infoKey="example"
        update={mockFunction}
        addNewText="Add new Example"
        inputLabel="Example Label"
        inputPlaceholder="Example Placeholder"
      />,
      {
        wrapper: themeProvider,
      }
    );

    userEvent.click(screen.getByText('Add new Example'));

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockFunction).toHaveBeenCalledWith({
      key: 'example',
      value: [
        {
          id: 0,
          lang: 'fi',
          value: '',
        },
      ],
    });
    expect(screen.getByText('tr-remove')).toBeInTheDocument();
  });

  it('should remove block', () => {
    const mockFunction = jest.fn();
    render(
      <ConceptInfoBlock
        infoKey="example"
        update={mockFunction}
        addNewText="Add new Example"
        inputLabel="Example Label"
        inputPlaceholder="Example Placeholder"
      />,
      {
        wrapper: themeProvider,
      }
    );

    userEvent.click(screen.getByText('Add new Example'));
    userEvent.click(screen.getByText('Add new Example'));
    userEvent.click(screen.getByText('Add new Example'));

    expect(screen.getAllByText(/tr-remove/)).toHaveLength(3);

    userEvent.click(screen.getAllByText(/tr-remove/)[0]);

    expect(screen.getAllByText(/tr-remove/)).toHaveLength(2);
  });

  it('should update information', async () => {
    const mockFunction = jest.fn();
    render(
      <ConceptInfoBlock
        infoKey="example"
        update={mockFunction}
        addNewText="Add new Example"
        inputLabel="Example Label"
        inputPlaceholder="Example Placeholder"
      />,
      {
        wrapper: themeProvider,
      }
    );

    userEvent.click(screen.getByText('Add new Example'));
    userEvent.click(screen.getByPlaceholderText('Example Placeholder'));
    userEvent.keyboard('some text');
    userEvent.click(screen.getByText('Example Label'));

    expect(mockFunction).toHaveBeenCalledTimes(2);
    expect(mockFunction).toHaveBeenCalledWith({
      key: 'example',
      value: [
        {
          id: 0,
          lang: 'fi',
          value: 'some text',
        },
      ],
    });
  });
});
