import { useState, useEffect } from 'react';
import styles from './CV.module.css';

const ACHIEVEMENTS_DATA = [
  { 
    name: "Lansare JWC Quiz App", 
    fact: "Pregătirea și lansarea unei aplicații mobile native pentru educație ecologică pe Google Play și App Store (urmează la finalul lunii Iunie)." 
  },
  { 
    name: "Dezvoltare Portofoliu", 
    fact: "Crearea de la zero a acestui portofoliu interactiv, integrând concepte avansate de React, API-uri externe și hărți dinamice." 
  },
  { 
    name: "Fotografie Wildlife",  
    fact: "Pasiune pentru natură concretizată într-un portofoliu web dedicat fotografiei wildlife, demonstrând atenție la detalii și răbdare." 
  }
];

export const Achievements = () => {
  const [index, setIndex] = useState(0);

//efectul de auto-schimbare a cardurilor la fiecare 5 secunde
  useEffect(() => {
    const schimbareCard = () => {
      let urmatorulIndex = (index + 1) % ACHIEVEMENTS_DATA.length; //daca indexul depaseste lungimea array-ului, se intoarce la 0
      setIndex(urmatorulIndex);
    };
    
    const timer = setTimeout(schimbareCard, 5000); //schimbare card la fiecare 5 secunde
    
//curat timerul daca se iese de pe componenta sau daca indexul se schimba manual
    return () => clearTimeout(timer);
  }, [index]);

  const inainte = () => { //functie pentru butonul de inainte
    let urmatorulIndex = (index + 1) % ACHIEVEMENTS_DATA.length;
    setIndex(urmatorulIndex);
  };

  const inapoi = () => { //functie pentru butonul de inapoi
    let indexAnterior;
    if (index === 0) {
      indexAnterior = ACHIEVEMENTS_DATA.length - 1;
    } else {
      indexAnterior = index - 1;
    }
    setIndex(indexAnterior);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Realizări & Experiență</h1>

      {/* Zona Caruselului */}
      <div className={styles.carusel}>
        <button onClick={inapoi} className={styles.sageata}>←</button>

        <div className={styles.cardRealizare}>
          <h2 className={styles.numeRealizare}>{ACHIEVEMENTS_DATA[index].name}</h2>
          <p className={styles.descriereRealizare}>{ACHIEVEMENTS_DATA[index].fact}</p>
          
          <div className={styles.puncteContainer}>
            {ACHIEVEMENTS_DATA.map((_, idx) => ( //puncte de sub card care indica realizarea curenta
              <span 
                key={idx} //punctul in sine
                className={`${styles.punct} ${index === idx ? styles.punctActiv : ''}`} //daca indexul punctului este egal cu indexul realizarii curente, se adauga clasa de punct activ (${} - nu afiseaza pe ecran, doar calculeaza valoarea)
              />
            ))}
          </div>
        </div>

        <button onClick={inainte} className={styles.sageata}>→</button>
      </div>

//parte pentru descarcat CV-ul
      <div className={styles.cvBox}>
        <p className={styles.cvText}>Vrei să vezi parcursul meu complet?</p>
        <a 
          href="/cv.pdf" 
          download="Andreea_CV.pdf" 
          className={styles.cvBtn}
        >
          📄 Descarcă CV-ul meu
        </a>
      </div>

    </div>
  );
};