import React, { useState, useEffect } from 'react';
import styles from './GithubCom.module.css';

const GITHUB_OWNER = 'wandreyq';

interface GitHubSearchCommit {
    sha: string; // ID-ul unic al commit-ului
    html_url: string; // URL-ul către commit pe GitHub
    repository: { // Informații despre repository-ul în care s-a făcut commit-ul
        name: string;
    };
    commit: { // Informații despre commit
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
}

const GithubCom: React.FC = () => {
    const [commits, setCommits] = useState<GitHubSearchCommit[]>([]); // Starea pentru a stoca commit-urile preluate
    const [loading, setLoading] = useState<boolean>(true);// Starea pentru a indica dacă datele sunt în curs de încărcare
    const [error, setError] = useState<string | null>(null); // Starea pentru a stoca eventualele erori apărute în timpul preluării datelor

    useEffect(() => {
        const fetchAllMyCommits = async () => { // Funcție asincronă pentru a prelua commit-urile de pe GitHub
            try {
                const response = await fetch(
                    `https://api.github.com/search/commits?q=author:${GITHUB_OWNER}&sort=committer-date&order=desc&per_page=30`, // Endpoint-ul API pentru a căuta commit-urile făcute de utilizatorul specificat, sortate după data comiterii în ordine descrescătoare și limitate la 30 de rezultate
                    {
                        headers: { 'Accept': 'application/vnd.github.v3+json' }, 
                        cache: 'no-store' // Dezactivează cache-ul pentru a obține cele mai recente date
                    }
                );

                if (!response.ok) {
                    throw new Error('Eroare la preluare. Verifică username-ul sau limitele API.');
                }

                const data = await response.json(); //transformă răspunsul în format JSON
                

                setCommits(data.items || []); //baga lista de commit-uri în starea componentului sau un array gol dacă nu există
            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError('A apărut o eroare necunoscută.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllMyCommits();
    }, []); //[] ca sa ruleze o singura data la deschiderea site-ului

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3> Activitate Recentă pe GitHub</h3>
                <a 
                    href={`https://github.com/${GITHUB_OWNER}?tab=repositories`} 
                    target="_blank"  
                    rel="noopener noreferrer" 
                    className={styles.viewAllLink}
                >
                    Profilul meu
                </a>
            </div>
            
            <ul className={styles.commitList}>
                {loading && <li className={styles.statusMessage}>Se extrag datele de pe GitHub...</li>} 
                {error && <li className={`${styles.statusMessage} ${styles.errorText}`}>{error}</li>}
                
                {!loading && !error && commits.length === 0 && (
                    <li className={styles.statusMessage}>Nu s-au găsit date publice.</li>
                )}
                
                {!loading && !error && commits.map((item) => { 
                    const repoName = item.repository.name;
                    const date = new Date(item.commit.author.date).toLocaleDateString('ro-RO', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    });
                    
                    const shortMessage = item.commit.message.split('\n')[0]; 

                    return (
                        <li key={item.sha} className={styles.commitItem}> 
                            <a 
                                href={item.html_url} 
                                target="_blank"  
                                rel="noopener noreferrer" 
                                className={styles.commitMessage}
                            >
                                {shortMessage} 
                            </a>

                            <div className={styles.commitMeta}> 
                                <span className={styles.repoBadge}>
                                    {repoName} 
                                </span>
                                {date} 
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default GithubCom; 