import { asset, fill, useI18n } from '../i18n';
import { ExternalLink, Icon, Section, Stack, shown } from './ui';

export function Projects() {
  const { t } = useI18n();
  const { labels } = t.projects;
  return (
    <Section id="projects" title={t.projects.title} intro={t.projects.intro}>
      <ol className="projects">
        {t.projects.items.map((p, i) => (
          <li key={p.id} className="project">
            <div className="project-media">
              <img
                src={asset(p.image.src)}
                srcSet={`${asset(p.image.srcSmall)} 720w, ${asset(p.image.src)} 1440w`}
                sizes="(min-width: 1100px) 780px, 100vw"
                alt={p.image.alt}
                width={p.image.width}
                height={p.image.height}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
            <div className="project-body">
              <h3 className="project-name">{p.name}</h3>
              <p className="meta">{shown(p.context, p.period).join(' · ')}</p>
              <p className="project-text">{p.problem}</p>
              <p className="project-text">{p.contribution}</p>
              <Stack items={p.stack} label={labels.stack} />
              <p className="project-links">
                {p.links.code && (
                  <ExternalLink className="text-link" href={p.links.code} ariaLabel={fill(labels.codeAria, { name: p.name })}>
                    {labels.code}
                    <Icon name="external" size={13} />
                  </ExternalLink>
                )}
                {p.links.demo && (
                  <ExternalLink className="text-link" href={p.links.demo} ariaLabel={fill(labels.demoAria, { name: p.name })}>
                    {labels.demo}
                    <Icon name="external" size={13} />
                  </ExternalLink>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
