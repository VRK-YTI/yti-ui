import { useTranslation } from "react-i18next";
import { Heading } from "suomifi-ui-components";
import {
  Description,
  StatusChip,
  TitleDescriptionWrapper,
  TitleType,
  TitleTypeAndStatusWrapper,
  TitleWrapper,
  TitleWrapperNoBreadcrumb,
} from "./title.styles";
import { useBreakpoints } from "../media-query";

interface TitleProps {
  title: string;
  description: string;
  noExpander?: boolean;
}

export default function Title({ title, description, noExpander }: TitleProps) {
  const { t, i18n } = useTranslation("common");
  const { isSmall } = useBreakpoints();
  // const dispatch = useStoreDispatch();
  // const title = getTitle(info);

  // useEffect(() => {
  //   dispatch(setTitle(title));
  // }, [dispatch, title]);

  if (!title) {
    return <></>;
  }

  return (
    <TitleWrapperNoBreadcrumb id="page-title-block">
      <Heading variant="h1" id="page-title">
        {title}
      </Heading>
      <TitleDescriptionWrapper $isSmall={isSmall}>
        <Description id="page-description">{description}</Description>
      </TitleDescriptionWrapper>
    </TitleWrapperNoBreadcrumb>
  );

  // TODO: Check if can be used in some way
  // else {
  //   const status = info.properties.status?.[0].value ?? 'DRAFT';
  //   const terminologyType =
  //     info.properties.terminologyType?.[0].value ?? 'TERMINOLOGICAL_VOCABULARY';

  //   return (
  //     <TitleWrapper id="page-title-block">
  //       <Heading variant="h1" tabIndex={-1} id="page-title">
  //         {title}
  //       </Heading>

  //       <TitleTypeAndStatusWrapper>
  //         <TitleType>{translateTerminologyType(terminologyType, t)}</TitleType>{' '}
  //         &middot;
  //         <StatusChip
  //           valid={status === 'VALID' ? 'true' : undefined}
  //           id="status-chip"
  //         >
  //           {translateStatus(status, t)}
  //         </StatusChip>
  //       </TitleTypeAndStatusWrapper>

  //       {!noExpander && <InfoExpander data={info} />}
  //     </TitleWrapper>
  //   );
  // }
}
