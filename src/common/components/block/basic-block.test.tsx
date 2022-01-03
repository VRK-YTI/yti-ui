import { render, screen } from '@testing-library/react';
import { BasicBlock } from '.';

describe('BasicBlock', () => {
  test('should render children', () => {
    render(
      <BasicBlock>Children</BasicBlock>
    );

    expect(screen.getByText(/Children/)).toBeInTheDocument;
  });

  test('should render title', () => {
    render(
      <BasicBlock title="Title">Children</BasicBlock>
    );

    expect(screen.getByText(/Title/)).toBeInTheDocument;
  });

  test('should render extra', () => {
    render(
      <BasicBlock extra="Extra">Children</BasicBlock>
    );

    expect(screen.getByText(/Extra/)).toBeInTheDocument;
  });

  test('should render all params', () => {
    render(
      <BasicBlock title="Title" extra="Extra">Children</BasicBlock>
    );

    expect(screen.getByText(/Title/)).toBeInTheDocument;
    expect(screen.getByText(/Extra/)).toBeInTheDocument;
    expect(screen.getByText(/Children/)).toBeInTheDocument;
  });
});
