import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Text, VisuallyHidden } from "suomifi-ui-components";
import {
  GroupSearchResult,
  OrganizationSearchResult,
} from "@app/common/interfaces/terminology.interface";
import useUrlState, { initialUrlState } from "../../utils/hooks/use-url-state";
import { useBreakpoints } from "../media-query";
import {
  ChipWrapper,
  CountText,
  CountWrapper,
} from "./search-count-tags.styles";
import Tag from "./tag";
// import { translateStatus } from '@app/common/utils/translation-helpers';
import { isEqual } from "lodash";

interface SearchCountTagsProps {
  title: ReactNode;
  organizations?: OrganizationSearchResult[];
  domains?: GroupSearchResult[];
  renderQBeforeStatus?: boolean;
  count: number;
}

export default function SearchCountTags({
  title,
  organizations = [],
  domains = [],
  renderQBeforeStatus = false,
  count = 0,
}: SearchCountTagsProps) {
  const { t } = useTranslation("common");
  const { urlState, patchUrlState } = useUrlState();
  const { isSmall } = useBreakpoints();

  return (
    <CountWrapper $isSmall={isSmall} id="result-counts">
      <CountText aria-live="polite" id="result-counts-text">
        <span aria-hidden={true}>{title}</span>
        <VisuallyHidden>
          {t("search-results-count", { count: count })}
        </VisuallyHidden>
      </CountText>
      <ChipWrapper id="result-counts-chips">
        {renderOrganizationTag()}
        {renderQBeforeStatus && renderQTag()}
        {renderLanguageTags()}
        {renderStatusTags()}
        {!renderQBeforeStatus && renderQTag()}
        {renderDomainTags()}
        {renderNoActiveFilters()}
      </ChipWrapper>
    </CountWrapper>
  );

  function renderNoActiveFilters() {
    // Ignoring type here on purpose
    if (isEqual({ ...urlState, type: "" }, { ...initialUrlState, type: "" })) {
      return (
        <Text style={{ fontSize: "16px", lineHeight: "0" }}>
          {t("no-filters")}
        </Text>
      );
    }
  }

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
              {translateStatus(status.toUpperCase(), t)}
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

  function renderLanguageTags() {
    if (urlState.lang) {
      return (
        <Tag
          onRemove={() =>
            patchUrlState({
              lang: "",
            })
          }
          key={urlState.lang}
        >
          {urlState.lang}
        </Tag>
      );
    }
  }
}
