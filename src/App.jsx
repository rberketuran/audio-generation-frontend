import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import MusicCreationPage from './pages/MusicCreationPage';
import VoiceConversionPage from './pages/VoiceConversionPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="container">
        <Navigation />
        <Routes>
          <Route path="/" element={<MusicCreationPage />} />
          <Route path="/voice-conversion" element={<VoiceConversionPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
