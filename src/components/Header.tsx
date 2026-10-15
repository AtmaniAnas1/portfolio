import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { Icon } from './ui';

const SECTIONS = ['projects', 'experience', 'skills', 'certifications', 'education', 'contact'] as const;
type Theme = 'light' | 'dark';
const THEME_KEY = 'portfolio-theme';

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Highlights the nav link of the section currently in view. */
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
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const switchTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage unavailable: the choice just isn't remembered.
    }
    setTheme(next);
  };

  const themeLabel = theme === 'dark' ? t.ui.themeToLight : t.ui.themeToDark;

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container header-inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            AA
          </span>
          <span className="brand-name">{t.hero.name}</span>
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
        <div className="header-actions">
          <button type="button" className="icon-btn" onClick={switchTheme} title={themeLabel} aria-label={themeLabel}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <button type="button" className="lang-toggle" onClick={toggle} title={t.ui.languageSwitch}>
            <span className="sr-only">{t.ui.languageSwitch}</span>
            <span aria-hidden="true">
              <span className="lang-current">{t.ui.currentLanguage}</span>
              <span className="lang-sep">/</span>
              <span>{t.ui.languageSwitchShort}</span>
            </span>
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={open ? t.ui.closeMenu : t.ui.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
