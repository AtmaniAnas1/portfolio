import { useEffect, useRef, useState } from 'react';
import { asset, fill, useI18n, type Content } from '../i18n';
import { ExternalLink, Icon, Section, Stack } from './ui';

export function Experience() {
  const { t } = useI18n();
  const { labels } = t.experience;
  return (
    <Section id="experience" title={t.experience.title}>
      <ol className="entries">
        {t.experience.items.map((job) => (
          <li key={job.role + job.period} className="entry">
            <div className="entry-head">
              <h3 className="entry-title">{job.role}</h3>
              <p className="entry-date">{job.period}</p>
            </div>
            <p className="entry-sub">
              {job.company} · {job.location}
            </p>
            <p className="entry-text">{job.project}</p>
            <Stack items={job.tools} label={labels.tools} />
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Skills() {
  const { t } = useI18n();
  return (
    <Section id="skills" title={t.skills.title}>
      <dl className="skills">
        {t.skills.groups.map((g) => (
          <div key={g.name} className="skill-row">
            <dt>{g.name}</dt>
            <dd>{g.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

type Cert = Content['certifications']['items'][number];

export function Certifications() {
  const { t } = useI18n();
  const { labels } = t.certifications;
  const [zoomed, setZoomed] = useState<Cert | null>(null);
  const groups = (['oracle', 'coursera'] as const).map((g) => ({
    id: g,
    title: labels[g],
    items: t.certifications.items.filter((c) => c.group === g),
  }));

  return (
    <Section id="certifications" title={t.certifications.title} intro={t.certifications.intro}>
      {groups.map((g) => (
        <div key={g.id} className="cert-group">
          <h3 className="group-title">{g.title}</h3>
          <ul className="certs">
            {g.items.map((c) => (
              <li key={c.name} className="cert">
                <button type="button" className="cert-thumb" onClick={() => setZoomed(c)} aria-label={fill(labels.enlarge, { name: c.name })}>
                  <img src={asset(c.image.src)} alt="" width="640" height="480" loading="lazy" decoding="async" />
                </button>
                <div className="cert-body">
                  <p className="cert-name">{c.name}</p>
                  <p className="meta">
                    {c.issuer} · {c.date}
                  </p>
                </div>
                <ExternalLink className="text-link cert-verify" href={c.verifyUrl} ariaLabel={fill(labels.verifyAria, { name: c.name })}>
                  {labels.verify}
                  <Icon name="external" size={13} />
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Lightbox cert={zoomed} onClose={() => setZoomed(null)} />
    </Section>
  );
}

function Lightbox({ cert, onClose }: { cert: Cert | null; onClose: () => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (cert && !d.open) d.showModal();
    if (!cert && d.open) d.close();
  }, [cert]);
  return (
    <dialog ref={ref} className="lightbox" aria-labelledby="lightbox-title" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      {cert && (
        <div className="lightbox-inner">
          <div className="lightbox-head">
            <div>
              <h3 id="lightbox-title" className="lightbox-title">
                {cert.name}
              </h3>
              <p className="meta">
                {cert.issuer} · {cert.date}
              </p>
            </div>
            <button type="button" className="close-btn" onClick={onClose} aria-label={t.ui.close} autoFocus>
              <Icon name="close" size={20} />
            </button>
          </div>
          <img src={asset(cert.image.srcLarge)} alt={cert.image.alt} />
          <ExternalLink className="text-link" href={cert.verifyUrl}>
            {t.certifications.labels.verify}
            <Icon name="external" size={13} />
          </ExternalLink>
        </div>
      )}
    </dialog>
  );
}

export function Education() {
  const { t } = useI18n();
  return (
    <Section id="education" title={t.education.title}>
      {t.education.items.map((e) => (
        <div key={e.school} className="edu">
          <span className="edu-logo">
            <img src={asset('images/emsi-logo.webp')} alt={t.hero.school.logoAlt} width="600" height="162" loading="lazy" />
          </span>
          <div className="edu-body">
            <div className="entry-head">
              <h3 className="entry-title">{e.school}</h3>
              <p className="entry-date">{e.period}</p>
            </div>
            <p className="entry-sub">{e.program}</p>
          </div>
        </div>
      ))}
    </Section>
  );
}

export function Contact() {
  const { t } = useI18n();
  const { contact, links } = t;
  return (
    <Section id="contact" title={contact.title} intro={contact.text}>
      <dl className="contact-list">
        <div className="contact-row">
          <dt>{contact.emailLabel}</dt>
          <dd>
            <a href={`mailto:${links.email}`}>{links.email}</a>
          </dd>
        </div>
        <div className="contact-row">
          <dt>{contact.phoneLabel}</dt>
          <dd>
            <a href={`tel:${links.phone}`}>{links.phoneDisplay}</a>
          </dd>
        </div>
        <div className="contact-row">
          <dt>{contact.linkedinLabel}</dt>
          <dd>
            <ExternalLink href={links.linkedin}>{links.linkedin.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')}</ExternalLink>
          </dd>
        </div>
        <div className="contact-row">
          <dt>{contact.githubLabel}</dt>
          <dd>
            <ExternalLink href={links.github}>{links.github.replace(/^https:\/\//, '')}</ExternalLink>
          </dd>
        </div>
      </dl>
    </Section>
  );
}
