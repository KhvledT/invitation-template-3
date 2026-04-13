import { useState, useCallback } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AudioProvider } from '@/contexts/AudioContext';
import AudioToggle from '@/components/AudioToggle';
import LoadingScreen from '@/components/LoadingScreen';
import PageTransition from '@/components/PageTransition';
import IntroPage from '@/pages/IntroPage';
import InvitationPage from '@/pages/InvitationPage';
import MemoriesPage from '@/pages/MemoriesPage';
import NotFound from '@/pages/NotFound';

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <AudioProvider>
      {!loaded && <LoadingScreen onComplete={handleLoaded} />}
      <div className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <BrowserRouter>
          <PageTransition>
            <Routes>
              <Route path="/" element={<IntroPage />} />
              <Route path="/invitation" element={<InvitationPage />} />
              <Route path="/memories" element={<MemoriesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </BrowserRouter>
        <AudioToggle />
      </div>
    </AudioProvider>
  );
};

export default App;
