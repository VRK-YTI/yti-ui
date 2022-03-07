import React, { useEffect, useState } from "react";
import { SearchInput } from "suomifi-ui-components";
import { useTranslation } from "react-i18next";
import IconButton from "../icon-button/icon-button";
import { useBreakpoints } from "../media-query/media-query-context";
import { CloseButton } from "./header-search.styles";
import { useRouter } from "next/router";
import useUrlState, { initialUrlState } from "../../utils/hooks/useUrlState";

export interface HeaderSearchProps {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderSearch({
  isSearchOpen,
  setIsSearchOpen,
}: HeaderSearchProps) {
  const { t } = useTranslation("common");
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const isSearchPage = router.route === "/";

  const { urlState, patchUrlState } = useUrlState();
  const q = urlState.q;
  const [searchInputValue, setSearchInputValue] = useState<string>(
    isSearchPage ? q : ""
  );
  useEffect(() => {
    if (isSearchPage) {
      setSearchInputValue(q);
    }
  }, [q, setSearchInputValue, isSearchPage]);

  if (isSmall && !isSearchOpen) {
    return (
      <IconButton
        icon="search"
        aria-label={t("terminology-search-open")}
        onClick={() => setIsSearchOpen(true)}
      />
    );
  }
  return (
    <>
      <SearchInput
        clearButtonLabel=""
        labelText=""
        value={searchInputValue ?? ""}
        labelMode="hidden"
        searchButtonLabel={t("terminology-search")}
        visualPlaceholder={t("terminology-search-placeholder")}
        wrapperProps={{ style: { flexGrow: isSmall ? 1 : 0 } }}
        onSearch={(value) => {
          if (typeof value === "string") search(value);
        }}
        onChange={(value) => {
          setSearchInputValue(String(value ?? ""));
          if (value === "") search();
        }}
      />
      {isSmall ? (
        <CloseButton
          onClick={() => setIsSearchOpen(false)}
          variant="secondaryNoBorder"
        >
          {t("close")}
        </CloseButton>
      ) : null}
    </>
  );

  function search(q?: string) {
    if (isSearchPage) {
      patchUrlState({
        q: q ?? "",
        page: initialUrlState.page,
      });
    } else {
      return router.push(
        {
          pathname: "/",
          query: q ? { q } : {},
        },
        undefined,
        { shallow: true }
      );
    }
  }
}
