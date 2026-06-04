import { useState } from 'react';
import styles from './ProjectsGrid.module.css';
import { WeatherApp } from './WeatherApp';
import { Achievements } from './CV';

interface Project { // tipul de date pentru proiecte
  id: number; // identificator unic pentru fiecare proiect
  title: string; // titlul proiectului
  techStack: string; // tehnologiile folosite in proiect
  shortDesc: string; // descriere scurta pentru card
  longDesc: string; // descriere lunga pentru modal
  imageUrl: string; // URL-ul imaginii pentru card (daca e gol, se va afisa un iframe cu preview-ul proiectului)
  previewUrl: string; // URL-ul pentru preview-ul proiectului)
}

const myProjects: Project[] = [ //array de proiecte
  {
    id: 1,
    title: "Wild Photography Portofolio",
    techStack: "HTML | CSS | JS", // tehnologiile folosite
    shortDesc: "Portofoliu de fotografie wildlife.", // descriere scurta pentru card
    longDesc: "Portofoliu propriu cu fotografii wildlife, inca in lucru, care prezinta pasiunea mea pentru fotografie si natura.",
    imageUrl: "", //  gol ca sa fortez afisarea mini-site-ului pe card
    previewUrl: "https://wandreyq.github.io/Photography-Portofolio/html/" 
  },
  {
    id: 2,
    title: "To-Do List",
    techStack: "HTML | CSS | JS",
    shortDesc: "Aplicație pentru task-uri.",
    longDesc: "Proiect simplu de To-Do List, pentru monitorizarea și organizarea sarcinilor zilnice.",
    imageUrl: "", 
    previewUrl: "https://wandreyq.github.io/Todo-list/" 
  },
  {
    id: 3,
    title: "Map & Weather",
    techStack: "React | API",
    shortDesc: "Hartă interactivă meteo.",
    longDesc: "Afișează condițiile meteo în timp real folosind OpenWeatherMap API.",
    imageUrl: "/meteo.png",
    previewUrl: "weather" 
  },
  {
    id: 4,
    title: "JWC Quiz App",
    techStack: "React Native",
    shortDesc: "Aplicație mobilă.",
    longDesc: "Aplicatie mobila pentru a invata speciile de pasari, insecte si herpeto. Aplicatia urmeaza a fi lansata la finalul lunii iunie in Play Store si App Store.",
    imageUrl: "/jwc_quiz.png",
    previewUrl: "https://snack.expo.dev/@wandreyq/jwc_quiz" 
  },
  {
    id: 5,
    title: "Realizări & CV",
    techStack: "Highlights | Experiență",
    shortDesc: "O selecție a realizărilor mele.",
    longDesc: "Descoperă cele mai importante reușite ale mele din ultima perioadă și descarcă CV-ul complet direct de aici.",
    imageUrl: "/cv_poza.png", 
    previewUrl: "achievements" 
  }
];

export const ProjectsGrid = () => {
  const [activePreview, setActivePreview] = useState<string | null>(null); //activePreview va stoca URL-ul proiectului care este vizualizat in modal, sau null daca niciun proiect nu este vizualizat

  const closePreview = () => setActivePreview(null); //functia pentru a inchide modalul

  return (
    <section id="projects-section" className={styles.projectsSection}>
      <h2 className={styles.sectionTitle}>Portofoliu Proiecte</h2>
      
      <div className={styles.gridContainer}>
        {myProjects.map((project) => ( //iteram prin array-ul de proiecte pentru a crea cate un card pentru fiecare proiect
          <div key={project.id} className={styles.biscuitCard}>
            
            <div className={styles.imageWrapper}>
              {project.id === 1 || project.id === 2 ? (
                <iframe 
                  src={project.previewUrl} 
                  title={project.title} 
                  className={styles.projectPreviewIframe}
                  scrolling="no" 
                />
              ) : (
                <img src={project.imageUrl} alt={project.title} className={styles.projectImage} />
              )}
              
              <div 
                className={styles.iframeOverlay} // div transparent peste iframe pentru a permite click-ul pe card
                onClick={() => setActivePreview(project.previewUrl)} 
              ></div>
            </div>
            
            <div className={styles.cardContent}>
              <h3>{project.title}</h3>
              <p className={styles.techStack}>{project.techStack}</p>
              <p className={styles.shortDesc}>{project.shortDesc}</p>
              
              <div className={styles.longDescWrapper}>
                <p className={styles.longDesc}>{project.longDesc}</p>
                {project.previewUrl && (
                  <button 
                    className={styles.previewButton}
                    onClick={() => setActivePreview(project.previewUrl)}
                  >
                    ▶ Live Preview
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activePreview && (
        <div className={styles.modalOverlay} onClick={closePreview}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closePreview}>✕ Închide</button>
            
            {activePreview === 'weather' ? ( // daca activePreview este "weather", afisam componenta WeatherApp
              <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                <WeatherApp />
              </div>
              ) : activePreview === 'achievements' ? ( // daca activePreview este "achievements", afisam componenta Achievements
              <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                <Achievements />
              </div>
            ) : ( // altfel, afisam un iframe cu URL-ul din activePreview
              <iframe src={activePreview} className={styles.previewIframe} />
            )}
            
          </div>
        </div>
      )}
    </section>
  );
};