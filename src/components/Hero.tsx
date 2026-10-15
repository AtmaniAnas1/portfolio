import { useEffect, useRef, useState } from 'react';
import { asset, useI18n } from '../i18n';
import { ExternalLink, Icon } from './ui';

/** "Download CV" button that opens a menu with the four versions (design / ATS, English / French). */
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
        <Icon name="download" />
        {hero.cvLabel}
        <span className="btn-meta">{t.ui.pdf}</span>
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
                <span className="cv-icon" aria-hidden="true">
                  <Icon name="file" size={20} />
                  <span className="cv-lang">{cv.lang}</span>
                </span>
                <span className="cv-text">
                  <span className="cv-label">{cv.label}</span>
                  <span className="cv-note">{cv.note}</span>
                </span>
                <Icon name="download" size={16} />
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
      <div className="hero-glow" aria-hidden="true" />
      <p className="hero-watermark" aria-hidden="true">
        EMSI
      </p>
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="availability">
            <span className="pulse" aria-hidden="true" />
            {hero.availability}
          </p>
          <p className="hero-greeting">{hero.greeting}</p>
          <h1 id="hero-name" className="hero-name">
            {hero.name}
          </h1>
          <p className="hero-title">{hero.title}</p>
          <p className="hero-tagline">
            <Icon name="pin" size={16} />
            {hero.tagline}
          </p>
          <p className="hero-summary">{hero.summary}</p>
          <div className="actions">
            <CvMenu />
            <a className="btn" href="#projects">
              {hero.projectsLabel}
              <Icon name="arrow" />
            </a>
          </div>
          <ul className="socials">
            <li>
              <ExternalLink className="icon-btn" href={links.github} ariaLabel={hero.githubLabel}>
                <Icon name="github" size={20} />
              </ExternalLink>
            </li>
            <li>
              <ExternalLink className="icon-btn" href={links.linkedin} ariaLabel={hero.linkedinLabel}>
                <Icon name="linkedin" size={20} />
              </ExternalLink>
            </li>
            <li>
              <a className="icon-btn" href={`mailto:${links.email}`} aria-label={hero.emailLabel}>
                <Icon name="mail" size={20} />
              </a>
            </li>
            <li>
              <a className="phone-link" href={`tel:${links.phone}`} aria-label={`${hero.phoneLabel} ${links.phoneDisplay}`}>
                <Icon name="phone" size={18} />
                {links.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
        <div className="hero-visual">
          <div className="photo-ring">
            <img className="hero-photo" src={asset(hero.photo.srcLarge)} width="352" height="352" alt={hero.photo.alt} fetchPriority="high" />
          </div>
          <p className="floating-badge badge-java" aria-hidden="true">
            <Icon name="badge" size={16} />
            Oracle Java SE 17
          </p>
          <p className="floating-badge badge-stack" aria-hidden="true">
            <Icon name="code" size={16} />
            Spring Boot · React
          </p>
          <div className="school-card">
            <span className="school-logo">
              <img src={asset('images/emsi-logo.webp')} alt={hero.school.logoAlt} width="600" height="162" />
            </span>
            <span className="school-text">
              <span className="school-label">
                {hero.school.label} · <strong>{hero.school.name}</strong>
              </span>
              <span className="school-detail">{hero.school.detail}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="container">
        <dl className="stats">
          {hero.stats.map((s) => (
            <div key={s.label} className="stat">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
