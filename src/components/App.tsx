import React, { useEffect, useMemo } from 'react';
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
  useHapticFeedback,
} from '@telegram-apps/sdk-react';
import { AppRoot, Progress } from '@telegram-apps/telegram-ui';
import { routes } from '@/navigation/routes.tsx';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import MainLogo from '../assets/logo.svg';

export const App: React.FC = () => {
  const launchParams = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();
  const hapticFeedback = useHapticFeedback();

  const { progress, loaded } = usePreloadImages([MainLogo]);

  useEffect(() => {
    bindMiniAppCSSVars(miniApp, themeParams);
    bindThemeParamsCSSVars(themeParams);
    if (viewport) {
      bindViewportCSSVars(viewport);
    }

    // Trigger haptic feedback on initial load
    hapticFeedback.impactOccurred('medium');
  }, [miniApp, themeParams, viewport, hapticFeedback]);

  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  if (!launchParams || !miniApp || !themeParams || !loaded) {
    return (
      <AppRoot>
        <Progress value={progress} />
      </AppRoot>
    );
  }

  return (
    <AppRoot appearance={miniApp.isDark ? 'dark' : 'light'} platform={['macos', 'ios'].includes(launchParams.platform) ? 'ios' : 'base'} className='screen-layout'>
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