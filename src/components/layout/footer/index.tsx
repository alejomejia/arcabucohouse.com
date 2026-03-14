import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/helpers";

import { FOOTER_COLUMN_HEADING_CLASSNAME, FOOTER_COLUMNS, START_YEAR } from "./const";
import { CurrentYear } from "./current-year";
import { FooterClient } from "./footer.client";

export async function Footer() {

  return (
    <FooterClient>
      <Container className="py-8 lg:py-16">
        <div className="grid grid-cols-12 gap-8 mb-12 lg:mb-24 font-serif">
          <div
            data-footer-col
            className="text-primary-200 col-span-12 md:col-span-6 lg:col-span-3 md:pr-8 lg:border-r border-primary-100/30"
          >
            <h4 className={FOOTER_COLUMN_HEADING_CLASSNAME}>About</h4>
            <p>
              Arcabuco is a creative collective amplifying Latin American artistic voices.
              Inspired by architecture and interior design, we curate handcrafted objects
              that blend cultural heritage with contemporary form.
            </p>
          </div>
          {FOOTER_COLUMNS.map(({ title, links }) => (
            <div
              key={title}
              data-footer-col
              className="text-primary-200 col-span-6 lg:col-span-3 md:pr-8 lg:border-r border-primary-100/30"
            >
              <h4 className={FOOTER_COLUMN_HEADING_CLASSNAME}>{title}</h4>
              <ul className="group/list w-fit flex flex-col gap-3">
                {links.map(({ id, label, href }) => (
                  <UnderlineLink
                    key={id}
                    href={href}
                    className={cn(
                      "opacity-100 group-hover/list:opacity-50 hover:opacity-100",
                      "leading-none transition-opacity duration-300 ease-in-out"
                    )}
                  >
                    {label}
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
            "text-xs uppercase font-medium tracking-wider",
            "border-t border-primary-100/30 pt-8 md:pt-4"
          )}
        >
          <span>Latin American interior art and objects</span>
          <span>Copyright &copy; {START_YEAR} - <CurrentYear /> Arcabuco</span>
        </div>
      </Container>
    </FooterClient>
  );
}
