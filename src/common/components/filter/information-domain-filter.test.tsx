import { render, screen } from '@testing-library/react';
import { themeProvider } from '@app/tests/test-utils';
import InformationDomainFilter from './information-domain-filter';
import mockRouter from 'next-router-mock';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('informationDomainFilter', () => {
  it('should render component', () => {
    mockRouter.setCurrentUrl('/?domain=d1');

    render(
      <InformationDomainFilter
        title="InformationDomainFilter title"
        counts={{
          d1: 11,
          d2: 12,
        }}
        domains={[
          { id: 'd1', name: { value: 'Domain 1', lang: '', regex: '' } },
          { id: 'd2', name: { value: 'Domain 2', lang: '', regex: '' } },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText('InformationDomainFilter title')
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Domain 1/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Domain 1/)).toBeChecked();

    expect(screen.getByLabelText(/Domain 2/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Domain 2/)).not.toBeChecked();
  });
});
