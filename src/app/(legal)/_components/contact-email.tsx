import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { COMPANY } from "@/lib/constants/legal";

export function ContactEmail() {
  return (
    <UnderlineLink href={`mailto:${COMPANY.EMAIL}`}>{COMPANY.EMAIL}</UnderlineLink>
  )
}