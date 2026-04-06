import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/helpers";

import { Text } from "@/components/ui/text";
import { FOOTER_COLUMN_HEADING_CLASSNAME, FOOTER_COLUMNS, START_YEAR } from "./const";
import { CurrentYear } from "./current-year";
import { FooterClient } from "./footer.client";

export async function Footer() {
  return (
    <FooterClient>
      <Container className="py-8 lg:py-16">
        <div className="grid grid-cols-12 gap-8 mb-12 lg:mb-24">
          <div
            data-footer-col
            className="text-zinc-300 col-span-12 md:col-span-6 lg:col-span-3 md:pr-8 lg:border-r border-zinc-700"
          >
            <Text as="h4" className={FOOTER_COLUMN_HEADING_CLASSNAME}>
              About
            </Text>
            <Text preset="small" className="text-zinc-400">
              Arcabuco is a creative collective amplifying Latin American artistic voices.
              Inspired by architecture and interior design, we curate handcrafted objects
              that blend cultural heritage with contemporary form.
            </Text>
          </div>
          {FOOTER_COLUMNS.map(({ title, links }) => (
            <div
              key={title}
              data-footer-col
              className="text-zinc-300 col-span-6 lg:col-span-3 md:pr-8 lg:not-last:border-r border-zinc-700"
            >
              <h4 className={FOOTER_COLUMN_HEADING_CLASSNAME}>{title}</h4>
              <ul className="group/list w-fit flex flex-col gap-2">
                {links.map(({ id, label, href }) => (
                  <UnderlineLink
                    key={id}
                    href={href}
                    className={cn(
                      "opacity-100 group-hover/list:opacity-50 hover:opacity-100",
                      "leading-none transition-opacity duration-300 ease-in-out"
                    )}
                  >
                    <Text preset="small">{label}</Text>
                  </UnderlineLink>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          data-footer-bottom
          className={cn(
            "flex flex-col md:flex-row md:justify-between md:items-center gap-4",
            "text-xs uppercase text-zinc-300 tracking-widest",
            "border-t border-zinc-700 pt-8 md:pt-4"
          )}
        >
          <Text as="span">Latin American interior art and objects</Text>
          <Text as="span">Copyright &copy; {START_YEAR} - <CurrentYear /> Arcabuco</Text>
        </div>
      </Container>
    </FooterClient>
  );
}
