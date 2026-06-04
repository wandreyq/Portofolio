import { Hero } from './Prezentare';
import { ProjectsGrid } from './ProjectsGrid';
import GithubCom from './GithubCom';

function App() {
  return (
    <div className="portfolio-container">
      <main>
        <Hero />
        <ProjectsGrid />
        
        <section style={{ marginTop: '0px', paddingBottom: '60px', padding: '0 20px' }}>
          <GithubCom />
        </section>
        
      </main>
    </div>
  );
}

export default App;