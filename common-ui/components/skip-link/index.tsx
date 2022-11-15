import React from "react";
import { Link as SuomiLink } from "suomifi-ui-components";
import { SkipLinkWrapper } from "./skip-link.styles";
import CommonWrapper from "../wrapper";

export interface SkipLinkProps {
  children: string;
  href: string;
}

function SkipLink({ children, href }: SkipLinkProps) {
  // Note. Don't use next/link here. It moves focus back to the beginning.
  return (
    <SkipLinkWrapper>
      <SuomiLink href={href}>{children}</SuomiLink>
    </SkipLinkWrapper>
  );
}

export default CommonWrapper(SkipLink);
