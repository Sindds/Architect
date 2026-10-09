import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { COPY } from "@/content/copy";
import { SITE } from "@/content/site";
import type { VariantKey } from "@/content/types";
import { LeadForm } from "../forms/LeadForm";

export function FinalCta({ variant }: { variant: VariantKey }) {
  const copy = COPY.sections.contacts;
  const contacts = [
    {
      icon: Phone,
      node: (
        <a
          href={SITE.phoneHref}
          className="link num inline-flex min-h-11 items-center"
        >
          {SITE.phoneDisplay}
        </a>
      ),
    },
    {
      icon: Mail,
      node: (
        <a
          href={`mailto:${SITE.email}`}
          className="link inline-flex min-h-11 items-center"
        >
          {SITE.email}
        </a>
      ),
    },
    { icon: MapPin, node: <span>{SITE.address}</span> },
    { icon: Clock, node: <span>{SITE.hours}</span> },
  ];
  return (
    <section
      id="contacts"
      aria-labelledby="contacts-title"
      className="mx-auto w-full max-w-[100rem] px-2 pt-8 sm:px-4 md:px-6"
    >
      <div className="on-dark grid gap-12 rounded-[24px] border border-white/10 bg-inverse p-6 text-on-inverse shadow-2xl sm:rounded-[36px] sm:p-10 lg:grid-cols-12 lg:p-14">
        <div className="lg:col-span-7">
          <p data-testid="section-label" className="label text-[#9fc0de]">
            {copy.label}
          </p>
          <h2
            id="contacts-title"
            className="display mt-4 text-[1.75rem] leading-[1.1] font-normal sm:text-4xl lg:text-[2.9rem]"
          >
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-on-inverse-muted sm:text-lg">
            {copy.lead}
          </p>
          <div className="mt-8 max-w-2xl">
            <LeadForm
              source="final_cta"
              variant={variant}
              tone="dark"
              submitLabel="Перезвоните мне"
            />
          </div>
        </div>
        <div className="grid content-start gap-6 lg:col-span-5">
          <ul className="grid gap-2 text-lg">
            {contacts.map(({ icon: Icon, node }, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-2"
              >
                <Icon
                  aria-hidden
                  className="size-5 shrink-0 text-[#9fc0de]"
                  strokeWidth={1.6}
                />
                {node}
              </li>
            ))}
          </ul>
          <p className="text-sm text-on-inverse-muted">
            Карта с отметкой офиса — внизу страницы.
          </p>
        </div>
      </div>
    </section>
  );
}
