import { useTranslation } from "next-i18next";
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from "suomifi-ui-components";
import { PropertyBlock } from "../../common/components/block";
import { getPropertyValue } from "../../common/components/property-value/get-property-value";
import { Concept } from "../../common/interfaces/concept.interface";

export function hasOtherDetails(concept?: Concept, language?: string) {
  const rest = { language, fallbackLanguage: "fi" };

  if (
    getPropertyValue({ property: concept?.properties.conceptClass, ...rest })
  ) {
    return true;
  }

  if (getPropertyValue({ property: concept?.properties.wordClass, ...rest })) {
    return true;
  }

  return false;
}

export interface OtherDetailsExpanderProps {
  concept?: Concept;
}

export default function OtherDetailsExpander({
  concept,
}: OtherDetailsExpanderProps) {
  const { t, i18n } = useTranslation("concept");

  if (!hasOtherDetails(concept, i18n.language)) {
    return null;
  }

  return (
    <Expander>
      <ExpanderTitleButton>{t("section-other-details")}</ExpanderTitleButton>
      <ExpanderContent>
        {/* <MultilingualPropertyBlock
          title="Aihealue"
          data={concept?.properties.something}
        /> */}
        <PropertyBlock
          title={t("field-concept-class")}
          property={concept?.properties.conceptClass}
        />
        <PropertyBlock
          title={t("field-word-class")}
          property={concept?.properties.wordClass}
        />
      </ExpanderContent>
    </Expander>
  );
}
