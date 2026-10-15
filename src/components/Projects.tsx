import { asset, fill, useI18n } from '../i18n';
import { ExternalLink, Icon, Reveal, Section, Tags, shown } from './ui';

export function Projects() {
  const { t } = useI18n();
  const { labels } = t.projects;
  return (
    <Section id="projects" index="01" title={t.projects.title} intro={t.projects.intro}>
      <ol className="projects">
        {t.projects.items.map((p, i) => (
          <Reveal as="li" key={p.id} className="project">
            <figure className="browser">
              <div className="browser-bar" aria-hidden="true">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="browser-url">{p.name}</span>
              </div>
              <img
                src={asset(p.image.src)}
                srcSet={`${asset(p.image.srcSmall)} 720w, ${asset(p.image.src)} 1440w`}
                sizes="(min-width: 960px) 600px, 100vw"
                alt={p.image.alt}
                width={p.image.width}
                height={p.image.height}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
            <div className="project-body">
              <p className="project-meta">
                <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                {shown(p.context, p.period).join(' · ')}
              </p>
              <h3 className="project-name">{p.name}</h3>
              <dl className="project-details">
                <div>
                  <dt>{labels.problem}</dt>
                  <dd>{p.problem}</dd>
                </div>
                <div>
                  <dt>{labels.contribution}</dt>
                  <dd>{p.contribution}</dd>
                </div>
              </dl>
              <Tags items={p.stack} label={labels.stack} />
              <div className="project-links">
                {p.links.code && (
                  <ExternalLink className="btn btn-sm" href={p.links.code} ariaLabel={fill(labels.codeAria, { name: p.name })}>
                    <Icon name="github" />
                    {labels.code}
                  </ExternalLink>
                )}
                {p.links.demo && (
                  <ExternalLink className="btn btn-sm btn-primary" href={p.links.demo} ariaLabel={fill(labels.demoAria, { name: p.name })}>
                    <Icon name="external" />
                    {labels.demo}
                  </ExternalLink>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
