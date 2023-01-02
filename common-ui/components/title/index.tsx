import { Heading } from 'suomifi-ui-components';
import { TitleWrapper, TitleWrapperNoBreadcrumb } from './title.styles';

interface TitleProps {
  title: string;
  extra?: React.ReactNode;
  noBreadcrumbs?: boolean;
}

export default function Title({
  title,
  extra,
  noBreadcrumbs = false,
}: TitleProps) {
  if (!title) {
    return <></>;
  }

  const renderContent = () => {
    return (
      <>
        <Heading variant="h1" id="page-title">
          {title}
        </Heading>
        {extra && extra}
      </>
    );
  };

  if (noBreadcrumbs) {
    return (
      <TitleWrapperNoBreadcrumb id="page-title-block">
        {renderContent()}
      </TitleWrapperNoBreadcrumb>
    );
  }

  return <TitleWrapper id="page-title-block">{renderContent()}</TitleWrapper>;
}
