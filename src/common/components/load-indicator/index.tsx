import { LoadIcon, LoadWrapper } from './load-indicator.style';

export default function LoadIndicator() {
  return (
    <LoadWrapper>
      <LoadIcon icon='swapRounded' ariaLabel='Loading' />
    </LoadWrapper>
  );
}
