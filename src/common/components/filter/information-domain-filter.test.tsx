import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { themeProvider } from '../../../tests/test-utils';
import InformationDomainFilter from './information-domain-filter';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('InformationDomainFilter', () => {
  test('should render component', () => {
    mockedUseRouter.mockReturnValue({
      query: { domain: 'd1' },
    } as any);

    render(
      <InformationDomainFilter
        title="InformationDomainFilter title"
        counts={{
          d1: 11,
          d2: 12,
        }}
        domains={[
          { id: 'd1', name: [{ value: 'Domain 1', lang: '', regex: '' }] },
          { id: 'd2', name: [{ value: 'Domain 2', lang: '', regex: '' }] },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText('InformationDomainFilter title')).toBeInTheDocument;

    expect(screen.getByLabelText(/Domain 1/)).toBeInTheDocument;
    expect(screen.getByLabelText(/Domain 1/)).toBeChecked();

    expect(screen.getByLabelText(/Domain 2/)).toBeInTheDocument;
    expect(screen.getByLabelText(/Domain 2/)).not.toBeChecked();
  });
});
