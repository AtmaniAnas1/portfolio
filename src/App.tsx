import { useI18n } from './i18n';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Certifications, Contact, Education, Experience, Skills } from './components/Sections';
import { Icon } from './components/ui';

export default function App() {
  const { t } = useI18n();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.ui.skipToContent}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <span id="top" />
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>
            {t.footer.text} · {t.footer.school}
          </span>
          <a className="link-btn" href="#top">
            {t.ui.backToTop}
            <Icon name="arrowUp" size={16} />
          </a>
        </div>
      </footer>
    </>
  );
}
