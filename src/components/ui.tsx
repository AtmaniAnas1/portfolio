import { useEffect, useRef, type ReactNode } from 'react';
import { useI18n } from '../i18n';

const ICONS = {
  github:
    'M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z',
  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  mail: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.33L4 7.4ZM5.6 7 12 11.27 18.4 7H5.6Z',
  download: 'M11 3h2v9.17l3.59-3.58L18 10l-6 6-6-6 1.41-1.41L11 12.17V3ZM4 19h16v2H4v-2Z',
  external: 'M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  code: 'M8.7 16.3 4.4 12l4.3-4.3-1.4-1.4L1.6 12l5.7 5.7 1.4-1.4Zm6.6 0 4.3-4.3-4.3-4.3 1.4-1.4 5.7 5.7-5.7 5.7-1.4-1.4Z',
  arrow: 'M13.17 6.41 14.59 5l7 7-7 7-1.42-1.41L17.76 13H3v-2h14.76l-4.59-4.59Z',
  arrowUp: 'M11 20V7.83l-5.59 5.58L4 12l8-8 8 8-1.41 1.41L13 7.83V20h-2Z',
  zoom: 'M10 2a8 8 0 0 1 6.32 12.9l5.39 5.39-1.42 1.42-5.39-5.4A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm1 2v3h3v2h-3v3H9v-3H6V9h3V6h2Z',
  close: 'm12 10.59 5.3-5.3 1.41 1.42-5.3 5.29 5.3 5.3-1.41 1.41-5.3-5.3-5.29 5.3-1.42-1.41 5.3-5.3-5.3-5.29L6.71 5.3 12 10.59Z',
  menu: 'M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z',
  sun: 'M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM11 1h2v3h-2V1Zm0 19h2v3h-2v-3ZM3.51 4.93l1.42-1.42 2.12 2.12-1.41 1.42L3.5 4.93Zm13.43 13.43 1.41-1.41 2.12 2.12-1.41 1.41-2.12-2.12ZM1 11h3v2H1v-2Zm19 0h3v2h-3v-2ZM4.93 20.49l-1.42-1.42 2.12-2.12 1.42 1.41-2.12 2.13ZM18.36 7.05l-1.41-1.42 2.12-2.12 1.41 1.42-2.12 2.12Z',
  moon: 'M10 4.06A8 8 0 0 0 19.94 14 8 8 0 1 1 10 4.06ZM12 2a10 10 0 1 0 10 10c0-.46-.03-.92-.1-1.37A6 6 0 0 1 13.37 2.1 10.1 10.1 0 0 0 12 2Z',
  pin: 'M12 2a8 8 0 0 1 8 8c0 5.25-8 12-8 12S4 15.25 4 10a8 8 0 0 1 8-8Zm0 2a6 6 0 0 0-6 6c0 3.3 4.13 7.83 6 9.32 1.87-1.5 6-6.02 6-9.32a6 6 0 0 0-6-6Zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z',
  server: 'M4 3h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v4h14V5H5Zm-1 8h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Zm1 2v4h14v-4H5Zm2-9h2v2H7V6Zm0 10h2v2H7v-2Z',
  layout: 'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v3h14V5H5Zm0 5v9h4v-9H5Zm6 0v9h8v-9h-8Z',
  database: 'M12 2c4.97 0 9 1.79 9 4v12c0 2.21-4.03 4-9 4s-9-1.79-9-4V6c0-2.21 4.03-4 9-4Zm7 12.7c-1.6.83-4.13 1.3-7 1.3s-5.4-.47-7-1.3V18c.27.62 2.86 2 7 2s6.73-1.38 7-2v-3.3Zm0-6c-1.6.83-4.13 1.3-7 1.3s-5.4-.47-7-1.3V12c.27.62 2.86 2 7 2s6.73-1.38 7-2V8.7ZM12 4C7.86 4 5.27 5.38 5 6c.27.62 2.86 2 7 2s6.73-1.38 7-2c-.27-.62-2.86-2-7-2Z',
  shield: 'M12 1 21 5v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4Zm0 2.19L5 6.3V11c0 4.52 2.98 8.74 7 9.93 4.02-1.19 7-5.41 7-9.93V6.3l-7-3.11Zm-1.06 12.3-3.54-3.53 1.42-1.42 2.12 2.12 4.6-4.59 1.41 1.42-6.01 6Z',
  tools: 'm13.78 15.17 1.42-1.42 7.07 7.07-1.42 1.42-7.07-7.07ZM17.5 2a4.5 4.5 0 0 1 1.47 8.76l-1.53-1.54A2.5 2.5 0 1 0 14.78 6.6l-1.54-1.53A4.48 4.48 0 0 1 17.5 2ZM6.4 2.98l4.24 4.24-1.41 1.41L6.4 5.81 4.99 7.22l2.83 2.83-1.41 1.41-4.25-4.24L6.4 2.98Zm6.37 6.36 1.41 1.42-9.9 9.9-1.41-1.42 9.9-9.9Z',
  terminal: 'M3 4h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 2v12h16V6H4Zm2.3 2.3L10 12l-3.7 3.7-1.4-1.4L7.17 12 4.9 9.7l1.4-1.4ZM12 14h6v2h-6v-2Z',
  globe: 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-2.62 2.43A8 8 0 0 0 4.06 11h3.98c.13-2.4.6-4.67 1.34-6.57Zm5.24 0c.74 1.9 1.21 4.17 1.34 6.57h3.98a8 8 0 0 0-5.32-6.57ZM12 4.12c-.83 1.38-1.8 3.83-1.96 6.88h3.92C13.8 7.95 12.83 5.5 12 4.12ZM4.06 13a8 8 0 0 0 5.32 6.57c-.74-1.9-1.21-4.17-1.34-6.57H4.06Zm5.98 0c.16 3.05 1.13 5.5 1.96 6.88.83-1.38 1.8-3.83 1.96-6.88h-3.92Zm5.92 0c-.13 2.4-.6 4.67-1.34 6.57A8 8 0 0 0 19.94 13h-3.98Z',
  cap: 'M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm0 2.28L18.83 9 12 12.72 5.17 9 12 5.28ZM5 12.18v4.15C6.6 18.07 9.17 19 12 19s5.4-.93 7-2.67v-4.15l-2 1.09v2.2C15.83 16.4 14 17 12 17s-3.83-.6-5-1.53v-2.2l-2-1.09Z',
  badge: 'M12 1a7 7 0 0 1 4.95 11.95L18 22l-6-3-6 3 1.05-9.05A7 7 0 0 1 12 1Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm3.07 11.16A6.97 6.97 0 0 1 12 15c-1.1 0-2.15-.25-3.07-.7l-.5 4.33L12 16.76l3.57 1.87-.5-4.47Z',
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={ICONS[name]} fill="currentColor" />
    </svg>
  );
}

/** Link that opens in a new tab and says so to screen readers. */
export function ExternalLink({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const { t } = useI18n();
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ? `${ariaLabel} ${t.ui.opensInNewTab}` : undefined}
    >
      {children}
      {!ariaLabel && <span className="sr-only"> {t.ui.opensInNewTab}</span>}
    </a>
  );
}

/** True for content still marked TODO: highlighted in development, hidden from the published site. */
export const isTodo = (s: string | null | undefined) => !!s && s.startsWith('TODO');

/** Only the values that should be shown on the page (drops empty values and, in production, TODOs). */
export const shown = (...values: (string | null | undefined)[]) =>
  values.filter((v): v is string => !!v && !(isTodo(v) && import.meta.env.PROD));

/** Renders content text; values still marked TODO are highlighted in development so they can't be missed. */
export function Text({ children }: { children: string }) {
  if (isTodo(children)) return import.meta.env.PROD ? null : <mark className="todo">{children}</mark>;
  return <>{children}</>;
}

/** Fades an element in the first time it scrolls into view (skipped when the user prefers reduced motion). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.add('reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

export function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  const head = useReveal<HTMLDivElement>();
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="section-head" ref={head}>
          <p className="section-index" aria-hidden="true">
            {index}
          </p>
          <h2 id={`${id}-title`} className="section-title">
            {title}
          </h2>
          {intro && <p className="section-intro">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export function Tags({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul className="tags" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="tag">
          {item}
        </li>
      ))}
    </ul>
  );
}
