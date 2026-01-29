import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
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
      </div>
    </div>
  );
}

export default App;
