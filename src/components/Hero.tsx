import { useEffect, useRef, useState } from 'react';
import { asset, useI18n } from '../i18n';
import { HeroBackground } from './HeroBackground';
import { ExternalLink, Icon } from './ui';

/** "Download CV" button with a menu of the four versions (designed / ATS, English / French). */
function CvMenu() {
  const { t } = useI18n();
  const { hero } = t;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => root.current && !root.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="cv-menu" ref={root}>
      <button type="button" className="btn btn-primary" aria-expanded={open} aria-controls="cv-list" onClick={() => setOpen((v) => !v)}>
        {hero.cvLabel}
        <span className={`chev${open ? ' is-open' : ''}`}>
          <Icon name="chevron" size={18} />
        </span>
      </button>
      <div className="cv-popover" id="cv-list" hidden={!open}>
        <p className="cv-popover-title">{hero.cvMenuTitle}</p>
        <ul>
          {hero.cvs.map((cv) => (
            <li key={cv.file}>
              <a className="cv-option" href={asset(cv.file)} download={cv.downloadName} type="application/pdf" onClick={() => setOpen(false)}>
                <span className="cv-label">{cv.label}</span>
                <span className="cv-note">{cv.note} · PDF</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();
  const { hero, links } = t;
  return (
    <section className="hero" aria-labelledby="hero-name">
      <HeroBackground />
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="eyebrow">
            {hero.school.label}, {hero.school.name}
          </p>
          <h1 id="hero-name" className="hero-name">
            {hero.name}
          </h1>
          <p className="hero-title">{hero.title}</p>
          <p className="hero-summary">{hero.summary}</p>
          <p className="hero-tagline">{hero.tagline}</p>
          <div className="actions">
            <CvMenu />
            <a className="btn" href="#contact">
              {t.nav.contact}
            </a>
          </div>
          <ul className="hero-links">
            <li>
              <a href={`mailto:${links.email}`}>
                <Icon name="mail" size={17} />
                {links.email}
              </a>
            </li>
            <li>
              <a href={`tel:${links.phone}`}>
                <Icon name="phone" size={17} />
                {links.phoneDisplay}
              </a>
            </li>
            <li>
              <ExternalLink href={links.linkedin}>
                <Icon name="linkedin" size={16} />
                {hero.linkedinLabel}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={links.github}>
                <Icon name="github" size={17} />
                {hero.githubLabel}
              </ExternalLink>
            </li>
          </ul>
        </div>
        <figure className="hero-photo">
          <span className="photo-frame" aria-hidden="true" />
          <img src={asset(hero.photo.srcLarge)} width="352" height="352" alt={hero.photo.alt} fetchPriority="high" />
        </figure>
      </div>
    </section>
  );
}
