import { TFunction } from "next-i18next";

export function translateStatus(status: string, t: TFunction) {
  switch (status) {
    case "DRAFT":
      return t("statuses.draft", { ns: "common" });
    case "INCOMPLETE":
      return t("statuses.incomplete", { ns: "common" });
    case "INVALID":
      return t("statuses.invalid", { ns: "common" });
    case "RETIRED":
      return t("statuses.retired", { ns: "common" });
    case "SUGGESTED":
      return t("statuses.suggested", { ns: "common" });
    case "SUPERSEDED":
      return t("statuses.superseded", { ns: "common" });
    case "VALID":
      return t("statuses.valid", { ns: "common" });
    default:
      return status;
  }
}
