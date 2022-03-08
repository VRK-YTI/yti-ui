import Head from 'next/head';

export interface TitleProps {
  parts?: (string | undefined)[];
}

export default function Title({ parts }: TitleProps) {
  return (
    <Head>
      <title>{parts?.filter(Boolean).join(' | ')}</title>
    </Head>
  );
}
