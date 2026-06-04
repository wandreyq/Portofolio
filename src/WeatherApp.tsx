import { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete (L.Icon.Default.prototype as any)._getIconUrl; // Resetează URL-urile implicite pentru iconițe
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png', // URL pentru iconița retina
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // URL pentru iconița normală
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // URL pentru umbra iconiței
});


const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => { //componentă pentru a schimba centrul și zoom-ul hărții
  const map = useMap(); //muta harta la coordonatele specificate
  map.setView(center, zoom);
  return null;
};


const PRESET_LOCATIONS = [
  { name: "Facultatea de Automatică (UPB)", lat: 44.4355, lon: 26.0473 },
  { name: "AFI Cotroceni", lat: 44.4300, lon: 26.0520 },
  { name: "Sediul Adobe (Tineretului)", lat: 44.4140, lon: 26.1040 }
];

export const WeatherApp = () => {
  const [city, setCity] = useState(''); //starea pt orasul introdus in input
  const [weather, setWeather] = useState<any>(null); //starea pentru datele meteo primite de la API
  const [coords, setCoords] = useState<[number, number]>([44.4268, 26.1025]); // Default: București 

  const API_KEY = "24f70ecc2741c42d5e334109ed602021"; 

//cautare dupa nume oras
  const fetchWeatherByCity = async () => {
    if (!city) return; // Nu face nimic daca inputul e gol
    try {
      const res = await axios.get( //axios pentru a face cererea catre API-ul de vreme
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data); //salveaza datele meteo in stare
      setCoords([res.data.coord.lat, res.data.coord.lon]); //actualizeaza coordonatele pentru a muta harta la locatia orasului cautat
    } catch (err) {
      alert("Orașul nu a fost găsit!");
    }
  };

//cautare dupa coordonate (click pe harta sau butoane presetate)
  const fetchWeatherByCoords = async (lat: number, lon: number) => { //Face acelasi lucru ca partea de sus, dar in loc de nume foloseste coordonatele
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setCoords([lat, lon]);
      setCity(''); // Resetează inputul când se caută după coordonate
    } catch (err) {
      console.error("Eroare la preluarea vremii pentru coordonate", err);
    }
  };


  const MapClickHandler = () => { //foloseste useMapEvents pentru a adauga un handler de click pe harta, care va prelua coordonatele click-ului si va apela functia de cautare dupa coordonate
    useMapEvents({ //asculta evenimentul de click pe harta
      click(e) { //cand se da click pe harta, preia coordonatele si cauta vremea pentru acele coordonate
        fetchWeatherByCoords(e.latlng.lat, e.latlng.lng);
      }
    });
    return null;
  };

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ color: '#ff1493', marginBottom: '1.5rem' }}>Map & Weather</h1>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
        <input 
          value={city} 
          onChange={(e) => setCity(e.target.value)} //input pentru a introduce numele orasului
          placeholder="Ex: București, Paris, Tokyo..."
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ff1493', background: '#1a000d', color: '#fff', width: '250px', outline: 'none' }}
        />
        <button 
          onClick={fetchWeatherByCity} //buton pentru a cauta vremea dupa nume oras
          style={{ padding: '12px 20px', cursor: 'pointer', background: '#ff1493', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}
        >
          Caută Oraș
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '1000px', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1 1 600px', background: '#120009', padding: '1.5rem', borderRadius: '20px', border: '1px solid #33001a' }}>
          
          {weather ? ( //daca avem date meteo, afiseaza-le, altfel afiseaza un mesaj de instructiuni
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 10px 0' }}>{weather.name || "Locație Selectată"}, {weather.sys.country}</h2>
              <p style={{ fontSize: '1.5rem', margin: '0 0 5px 0', color: '#ffb3d9', fontWeight: 'bold' }}>{weather.main.temp}°C</p>
              <p style={{ margin: '0', color: '#aaaaaa', textTransform: 'capitalize' }}>
                {weather.weather[0].description} • Umiditate: {weather.main.humidity}%
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#aaaaaa' }}>
              Apasa pe un buton sau oriunde pe hartă pentru a vedea vremea!
            </div>
          )}
          

          <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', cursor: 'crosshair' }}>
            <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%' }}> //componenta pentru a afisa harta, centrata pe coordonatele din stare
              <ChangeView center={coords} zoom={13} /> //componenta pentru a schimba centrul si zoom-ul hărții atunci când coordonatele se actualizează
              <MapClickHandler /> //componenta pentru a adauga un handler de click pe harta, care va prelua coordonatele click-ului si va apela functia de cautare dupa coordonate
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> //stratul de harta de la OpenStreetMap
              <Marker position={coords}> //marchează locația curentă pe hartă
                <Popup>{weather ? `${weather.main.temp}°C` : "Apasă oriunde pe hartă"}</Popup> //popup care arata temperatura curenta sau un mesaj de instructiuni
              </Marker>
            </MapContainer>
          </div>
        </div>


        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ background: '#120009', padding: '1.5rem', borderRadius: '20px', border: '1px solid #33001a', height: '100%' }}>
            <h3 style={{ color: '#ffb3d9', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #33001a', paddingBottom: '10px' }}>
              Locații Rapide
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PRESET_LOCATIONS.map((loc, index) => ( //butone pentru a cauta vremea la locatii presetate
                <button 
                  key={index} //cand se da click pe buton, cauta vremea pentru coordonatele locatiei respective
                  onClick={() => fetchWeatherByCoords(loc.lat, loc.lon)} //
                  style={{
                    padding: '12px',
                    backgroundColor: '#1a000d',
                    border: '1px solid #ff1493',
                    color: '#fff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff1493';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a000d';
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  📍 {loc.name}
                </button>
              ))}
            </div>
            
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '20px', textAlign: 'center' }}>
              💡 Hint: Poți da click direct pe hartă pentru a afla vremea în orice punct!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};