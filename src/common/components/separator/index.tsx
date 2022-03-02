import { StyledHr } from './separator.styles';

export interface SeparatorProps {
  isLarge?: boolean;
}

export default function Separator({ isLarge = false }: SeparatorProps) {
  return (
    <StyledHr isLarge={isLarge} aria-hidden="true" />
  );
}
