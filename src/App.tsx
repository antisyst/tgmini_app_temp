import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator, useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { AppRoot, Spinner } from '@telegram-apps/telegram-ui';
import { routes } from '@/navigation/routes.tsx';
import * as TelegramUI from '@telegram-apps/telegram-ui';


export const App: React.FC = () => {
  const launchParams = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  // Bind CSS variables for theming and viewport
  useEffect(() => {
    bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    if (viewport) {
      bindViewportCSSVars(viewport);
    }
  }, [viewport]);

  // Initialize navigator
  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  // Attach navigator for controlling history and back button state
  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  // Loading state management (if required)
  if (!launchParams || !miniApp || !themeParams) {
    return (
      <AppRoot>
        <Spinner size='l' />
      </AppRoot>
    );
  }

  console.log(TelegramUI);


  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(launchParams.platform) ? 'ios' : 'base'}
    >
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