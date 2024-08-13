import StartPage from '@/pages/StartPage/StartPage';
import RegistrationPage from '@/pages/RegistrationPage/RegistrationPage';
import DocumentPage from '@/pages/DocumentPage/DocumentPage';

export const routes = [
  { path: '/', Component: StartPage },
  { path: '/registration', Component: RegistrationPage },
  { path: '/documents', Component: DocumentPage },
];
