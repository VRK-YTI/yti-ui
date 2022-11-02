import { StyledHr } from './separator.styles';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../theme';

export interface SeparatorProps {
  isLarge?: boolean;
}

export default function Separator({ isLarge = false }: SeparatorProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <StyledHr $isLarge={isLarge} aria-hidden="true" />
    </ThemeProvider>
  );
}
