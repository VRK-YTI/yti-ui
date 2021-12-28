import { BasicBlockHeader, BasicBlockWrapper } from './block.styles';

export interface BasicBlockProps {
  title?: React.ReactNode;
  data?: React.ReactNode;
  extra?: React.ReactNode;
  largeGap?: boolean;
}

export default function BasicBlock({ title, data, extra, largeGap }: BasicBlockProps) {
  if (!data) {
    return null;
  }

  return (
    <BasicBlockWrapper largeGap={largeGap}>
      {title && <BasicBlockHeader>{title}</BasicBlockHeader>}
      {data}
      {extra}
    </BasicBlockWrapper>
  );
}
