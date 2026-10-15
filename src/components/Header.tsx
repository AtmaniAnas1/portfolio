import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { Icon } from './ui';

const SECTIONS = ['projects', 'experience', 'skills', 'certifications', 'education', 'contact'] as const;

/** Marks the nav link of the section currently in view. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header() {
  const { t, toggle } = useI18n();
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header${open ? ' is-open' : ''}`}>
      <div className="container header-inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          {t.hero.name}
        </a>
        <nav aria-label={t.ui.primaryNav} className="nav" id="primary-nav">
          <ul>
            {SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}>
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" className="lang-toggle" onClick={toggle} title={t.ui.languageSwitch}>
          <span className="sr-only">{t.ui.languageSwitch}</span>
          <span aria-hidden="true">{t.ui.languageSwitchShort}</span>
        </button>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? t.ui.closeMenu : t.ui.menu}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} size={20} />
        </button>
      </div>
    </header>
  );
}
