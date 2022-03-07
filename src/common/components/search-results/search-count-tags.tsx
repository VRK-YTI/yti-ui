import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  GroupSearchResult,
  OrganizationSearchResult,
} from "../../interfaces/terminology.interface";
import useUrlState, { initialUrlState } from "../../utils/hooks/useUrlState";
import { useBreakpoints } from "../media-query/media-query-context";
import {
  ChipWrapper,
  CountText,
  CountWrapper,
} from "./search-count-tags.styles";
import Tag from "./tag";

interface SearchCountTagsProps {
  title: ReactNode;
  organizations?: OrganizationSearchResult[];
  domains?: GroupSearchResult[];
  renderQBeforeStatus?: boolean;
}

export default function SearchCountTags({
  title,
  organizations = [],
  domains = [],
  renderQBeforeStatus = false,
}: SearchCountTagsProps) {
  const { t } = useTranslation("common");
  const { urlState, patchUrlState } = useUrlState();
  const { isSmall } = useBreakpoints();

  return (
    <CountWrapper isSmall={isSmall}>
      <CountText aria-live="polite">{title}</CountText>
      <ChipWrapper>
        {renderOrganizationTag()}
        {renderQBeforeStatus && renderQTag()}
        {renderStatusTags()}
        {!renderQBeforeStatus && renderQTag()}
        {renderDomainTags()}
      </ChipWrapper>
    </CountWrapper>
  );

  function renderOrganizationTag() {
    if (urlState.organization) {
      return (
        <Tag
          onRemove={() =>
            patchUrlState({ organization: initialUrlState.organization })
          }
        >
          {
            organizations.filter((o) => o.id === urlState.organization)[0]
              ?.properties.prefLabel.value
          }
        </Tag>
      );
    }
  }

  function renderQTag() {
    if (urlState.q) {
      return (
        <Tag onRemove={() => patchUrlState({ q: initialUrlState.q })}>
          {urlState.q}
        </Tag>
      );
    }
  }

  function renderStatusTags() {
    return ["valid", "draft", "retired", "superseded"]
      .map((status) => {
        if (urlState.status.includes(status)) {
          return (
            <Tag
              onRemove={() =>
                patchUrlState({
                  status: urlState.status.filter((s) => s !== status),
                })
              }
              key={status}
            >
              {t(status.toUpperCase())}
            </Tag>
          );
        }
      })
      .filter(Boolean);
  }

  function renderDomainTags() {
    return domains
      .map((domain) => {
        if (urlState.domain.includes(domain.id)) {
          return (
            <Tag
              onRemove={() =>
                patchUrlState({
                  domain: urlState.domain.filter((d) => d !== domain.id),
                })
              }
              key={domain.id}
            >
              {domain.properties.prefLabel.value}
            </Tag>
          );
        }
      })
      .filter(Boolean);
  }
}
