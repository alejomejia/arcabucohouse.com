import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Text } from "@/components/ui/text";
import { COMPANY } from "@/lib/constants/legal";

export function LegalContactEmail() {
  return (
    <UnderlineLink href={`mailto:${COMPANY.EMAIL}`}>
      <Text as="span" className="text-zinc-700">{COMPANY.EMAIL}</Text>
    </UnderlineLink>
  )
}