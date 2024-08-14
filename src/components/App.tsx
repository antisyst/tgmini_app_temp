import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
  useBackButton,
  useMainButton,
} from '@telegram-apps/sdk-react';
import { AppRoot, Spinner } from '@telegram-apps/telegram-ui';
import { routes } from '@/navigation/routes.tsx';
import MainLogo from '../assets/logo.svg';

export const App: React.FC = () => {
  const launchParams = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();
  const backButton = useBackButton();
  const mainButton = useMainButton();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    bindMiniAppCSSVars(miniApp, themeParams);
    bindThemeParamsCSSVars(themeParams);
    if (viewport) {
      bindViewportCSSVars(viewport);
    }

    const preloadImages = async () => {
      const images = [MainLogo]; // Include all the images you need to preload
      const promises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
        });
      });

      await Promise.all(promises);
      setIsReady(true);
    };

    preloadImages();
  }, [miniApp, themeParams, viewport]);

  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  useEffect(() => {
    mainButton.setText('Confirm'); // Set the text of the main button
    mainButton.show(); // Show the main button
    mainButton.on('click', () => {
      // Handle the main button click event
      console.log('Main button clicked!');
    });

    return () => {
      mainButton.hide(); // Hide the main button when the component is unmounted
    };
  }, [mainButton]);

  useEffect(() => {
    backButton.show();
    backButton.on('click', () => {
      navigator.back();
    });

    return () => {
      backButton.hide();
    };
  }, [backButton, navigator]);

  if (!launchParams || !miniApp || !themeParams || !isReady) {
    return (
      <AppRoot>
        <div className="loader-container">
          <Spinner size='l' />
        </div>
      </AppRoot>
    );
  }

  return (
    <AppRoot appearance={miniApp.isDark ? 'dark' : 'light'} platform={['macos', 'ios'].includes(launchParams.platform) ? 'ios' : 'base'}>
      <Router location={location} navigator={reactNavigator}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppRoot>
  );
};

export default App;
