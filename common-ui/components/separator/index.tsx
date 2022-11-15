import { StyledHr } from "./separator.styles";
import CommonWrapper from "../wrapper";

export interface SeparatorProps {
  isLarge?: boolean;
}

function Separator({ isLarge = false }: SeparatorProps) {
  return <StyledHr $isLarge={isLarge} aria-hidden="true" />;
}

export default CommonWrapper(Separator);
