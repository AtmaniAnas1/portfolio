import { asset, useI18n } from '../i18n';
import { ExternalLink, Icon } from './ui';

export function Hero() {
  const { t } = useI18n();
  const { hero, links } = t;
  return (
    <section className="hero" aria-labelledby="hero-name">
      <div className="hero-glow" aria-hidden="true" />
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
            <a className="btn btn-primary" href={asset(hero.cvFile)} download={hero.cvDownloadName} type="application/pdf">
              <Icon name="download" />
              {hero.cvLabel}
              <span className="btn-meta">{t.ui.pdf}</span>
            </a>
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
          </ul>
        </div>
        <div className="hero-visual">
          <div className="photo-ring">
            <img
              className="hero-photo"
              src={asset(hero.photo.srcLarge)}
              width="352"
              height="352"
              alt={hero.photo.alt}
              fetchPriority="high"
            />
          </div>
          <p className="floating-badge badge-java" aria-hidden="true">
            <Icon name="badge" size={16} />
            Oracle Java SE 17
          </p>
          <p className="floating-badge badge-stack" aria-hidden="true">
            <Icon name="code" size={16} />
            Spring Boot · React
          </p>
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
