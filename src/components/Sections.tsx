import { useEffect, useRef, useState } from 'react';
import { asset, fill, useI18n, type Content } from '../i18n';
import { ExternalLink, Icon, Reveal, Section, Tags, type IconName } from './ui';

export function Experience() {
  const { t } = useI18n();
  const { labels } = t.experience;
  return (
    <Section id="experience" index="02" title={t.experience.title}>
      <ol className="timeline">
        {t.experience.items.map((job) => (
          <Reveal as="li" key={job.role + job.period} className="timeline-item">
            <span className="timeline-dot" aria-hidden="true" />
            <div className="card job">
              <div className="job-head">
                <h3 className="job-role">{job.role}</h3>
                <p className="period">{job.period}</p>
              </div>
              <p className="job-company">
                {job.company} <span className="meta">· {job.location}</span>
              </p>
              <p className="job-project">
                <strong>{labels.project}</strong> {job.project}
              </p>
              <Tags items={job.tools} label={labels.tools} />
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

// One icon per skill group, in the order of skills.groups in the content files.
const SKILL_ICONS: IconName[] = ['server', 'layout', 'database', 'shield', 'tools', 'terminal', 'globe'];

export function Skills() {
  const { t } = useI18n();
  return (
    <Section id="skills" index="03" title={t.skills.title}>
      <div className="skills">
        {t.skills.groups.map((g, i) => (
          <Reveal key={g.name} className="card skill-group">
            <h3 className="skill-name">
              <span className="skill-icon" aria-hidden="true">
                <Icon name={SKILL_ICONS[i] ?? 'code'} size={20} />
              </span>
              {g.name}
            </h3>
            <Tags items={g.items} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

type Cert = Content['certifications']['items'][number];
type Filter = 'all' | 'oracle' | 'coursera';

export function Certifications() {
  const { t } = useI18n();
  const { labels } = t.certifications;
  const [filter, setFilter] = useState<Filter>('all');
  const [zoomed, setZoomed] = useState<Cert | null>(null);
  const items = t.certifications.items.filter((c) => filter === 'all' || c.group === filter);
  const count = (f: Filter) => t.certifications.items.filter((c) => f === 'all' || c.group === f).length;

  return (
    <Section id="certifications" index="04" title={t.certifications.title} intro={t.certifications.intro}>
      <div className="filters" role="group" aria-label={labels.filterAria}>
        {(['all', 'oracle', 'coursera'] as const).map((f) => (
          <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {labels[f]}
            <span className="chip-count">{count(f)}</span>
          </button>
        ))}
      </div>
      <ul className="certs">
        {items.map((c) => (
          <li key={c.name} className={`card cert cert-${c.group}`}>
            <button type="button" className="cert-thumb" onClick={() => setZoomed(c)} aria-label={fill(labels.enlarge, { name: c.name })}>
              <img src={asset(c.image.src)} alt={c.image.alt} width="640" height="480" loading="lazy" decoding="async" />
              <span className="cert-zoom" aria-hidden="true">
                <Icon name="zoom" size={20} />
              </span>
            </button>
            <div className="cert-body">
              <p className="cert-issuer">{c.issuer}</p>
              <h3 className="cert-name">{c.name}</h3>
              <div className="cert-foot">
                <span className="meta">{c.date}</span>
                <ExternalLink className="link-btn" href={c.verifyUrl} ariaLabel={fill(labels.verifyAria, { name: c.name })}>
                  {labels.verify}
                  <Icon name="external" size={16} />
                </ExternalLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
    <dialog
      ref={ref}
      className="lightbox"
      aria-labelledby="lightbox-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {cert && (
        <div className="lightbox-inner">
          <div className="lightbox-head">
            <div>
              <p className="cert-issuer">
                {cert.issuer} · {cert.date}
              </p>
              <h3 id="lightbox-title" className="lightbox-title">
                {cert.name}
              </h3>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label={t.ui.close} autoFocus>
              <Icon name="close" />
            </button>
          </div>
          <img src={asset(cert.image.srcLarge)} alt={cert.image.alt} />
          <ExternalLink className="btn btn-primary btn-sm" href={cert.verifyUrl}>
            {t.certifications.labels.verify}
            <Icon name="external" size={16} />
          </ExternalLink>
        </div>
      )}
    </dialog>
  );
}

export function Education() {
  const { t } = useI18n();
  return (
    <Section id="education" index="05" title={t.education.title}>
      {t.education.items.map((e) => (
        <Reveal key={e.school} className="card edu">
          <span className="edu-icon" aria-hidden="true">
            <Icon name="cap" size={26} />
          </span>
          <div>
            <div className="job-head">
              <h3 className="job-role">{e.school}</h3>
              <p className="period">{e.period}</p>
            </div>
            <p className="edu-program">{e.program}</p>
          </div>
        </Reveal>
      ))}
    </Section>
  );
}

export function Contact() {
  const { t } = useI18n();
  const { contact, links } = t;
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="contact-panel">
          <p className="section-index" aria-hidden="true">
            06
          </p>
          <h2 id="contact-title" className="contact-title">
            {contact.title}
          </h2>
          <p className="contact-text">{contact.text}</p>
          <a className="btn btn-primary btn-lg" href={`mailto:${links.email}`}>
            <Icon name="mail" />
            {links.email}
          </a>
          <ul className="contact-list">
            <li>
              <ExternalLink className="contact-item" href={links.linkedin}>
                <Icon name="linkedin" />
                {contact.linkedinLabel}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink className="contact-item" href={links.github}>
                <Icon name="github" />
                {contact.githubLabel}
              </ExternalLink>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
