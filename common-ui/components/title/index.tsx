import { Heading } from 'suomifi-ui-components';
import {
  TitleRow,
  TitleWrapper,
  TitleWrapperNoBreadcrumb,
} from './title.styles';

interface TitleProps {
  title: string;
  editButton?: React.ReactNode;
  extra?: React.ReactNode;
  noBreadcrumbs?: boolean;
}

export default function Title({
  title,
  editButton,
  extra,
  noBreadcrumbs = false,
}: TitleProps) {
  if (!title) {
    return <></>;
  }

  const renderContent = () => {
    return (
      <>
        <TitleRow>
          <Heading variant="h1" id="page-title">
            {title}
          </Heading>
          {editButton && editButton}
        </TitleRow>
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
