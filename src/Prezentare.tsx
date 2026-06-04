import { useState, useEffect } from 'react';
import styles from './Prezentare.module.css';

export const Hero = () => {
  const [text, setText] = useState('');
  const fullText = "</Hello I'm Andreea>";


  useEffect(() => { //se executa o singura data
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) { //verif daca am terminat
        setText(fullText.slice(0, currentIndex)); //daca nu am terminat adaug urmatorul caracter
        currentIndex++;
      } else {
        clearInterval(typingInterval); //daca am terminat opresc cronometru
      }
    }, 120); //viteza cu care se scrie

    return () => clearInterval(typingInterval); //inchid cronometrul daca se iese de pe site
  }, []);

  const scrollToProjects = () => { //se da scroll la proiecte daca apas pe buton
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.heroSection}> 
      <div className={styles.heroImageContainer}> 

        <img src="./Public/Andreea.jpg" alt="Andreea" className={styles.profilePic} />
      </div>
      
      <div className={styles.heroText}> 
        <p className={styles.subtitle}>FRONTEND DEVELOPER</p> 
        <h1>
          <span className={styles.typewriterText}>{text}</span> 
          <span className={styles.cursor}>_</span> 
        </h1>
        

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}> 
                   


          <button 
            onClick={scrollToProjects} 
            className={styles.ctaButton}
            style={{ marginTop: 0 }} 
          >
            Vezi proiectele ↓
          </button>

        </div>
      </div>
    </section>
  );
};