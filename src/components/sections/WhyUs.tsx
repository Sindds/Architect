import {
  ArrowUpRight,
  Banknote,
  ClipboardCheck,
  FileSignature,
  Calculator,
} from "lucide-react";
import { COPY } from "@/content/copy";
import { WHY_US } from "@/content/process";
import { SectionHead } from "../ui/SectionHead";
import { DeliveredList } from "./DeliveredList";

const ICONS = [FileSignature, ClipboardCheck, Banknote, Calculator];

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="shell py-16 sm:py-24">
      <SectionHead id="why-title" copy={COPY.sections.why} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14">
        {WHY_US.map((item, i) => {
          const Icon = ICONS[i] ?? FileSignature;
          return (
            <li key={item.title} className="reveal">
              <article className="card card-hover flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-center gap-3 text-accent">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft">
                    <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="label num">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-snug sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-muted">{item.fact}</p>
                {item.proof.href === "#delivered" ? (
                  <DeliveredList />
                ) : (
                  <a
                    href={item.proof.href}
                    {...(item.proof.href.endsWith(".pdf")
                      ? { target: "_blank", rel: "noopener" }
                      : {})}
                    className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-5 text-sm font-semibold text-accent hover:underline"
                  >
                    {item.proof.label}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
