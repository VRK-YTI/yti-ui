import React from "react";
import { Link as SuomiLink } from "suomifi-ui-components";
import Image from "next/image";
import Link from "next/link";
import { LogoWrapper } from "./smart-header.styles";

export default function Logo() {
  return (
    <LogoWrapper>
      <Link href="/" passHref>
        <SuomiLink href="">
          <Image src="/logo.svg" width="186" height="32" alt="Logo" />
        </SuomiLink>
      </Link>
    </LogoWrapper>
  );
}
