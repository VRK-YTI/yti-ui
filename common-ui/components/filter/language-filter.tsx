import useUrlState, { initialUrlState } from "../../utils/hooks/use-url-state";
import { useTranslation } from "next-i18next";
import { SingleSelect, SingleSelectData } from "suomifi-ui-components";
import { DropdownWrapper } from "./filter.styles";

interface LanguageFilterProps {
  labelText: string;
  languages?: SingleSelectData[];
}

export default function LanguageFilter({
  labelText,
  languages = [],
}: LanguageFilterProps) {
  const { t } = useTranslation("common");
  const { urlState, patchUrlState } = useUrlState();

  const currLang = languages.find(
    (lang) => lang.uniqueItemId === urlState.lang
  );

  return (
    <DropdownWrapper>
      <SingleSelect
        ariaOptionsAvailableText={t("languages-available")}
        clearButtonLabel={t("clear-language-filter")}
        items={languages}
        labelText={labelText}
        noItemsText={t("no-languages-available")}
        visualPlaceholder={t("choose-language")}
        selectedItem={currLang}
        onItemSelect={(lang) =>
          patchUrlState({
            lang: lang ? lang : "",
            page: initialUrlState.page,
          })
        }
        id="filter-language-selector"
      />
    </DropdownWrapper>
  );
}
