import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLogo from '../../assets/logo.svg';
import { AppRoot, Section, Image, Button, FixedLayout, Spinner } from '@telegram-apps/telegram-ui';
import './StartPage.scss';

const StartPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/registration');
    }, 1000);
  };

  return (
    <AppRoot>
      <FixedLayout vertical="top" className="full-screen">
        <Section className="logo-container">
          <Image src={MainLogo} alt="App Logo"/>
        </Section>
        <FixedLayout vertical="bottom" className="button-layout">
          <Button className="start-button" onClick={handleStart} style={{ background: '#1375FA', height: '58px' }}>
            {loading ? <Spinner size="m" className='spinner'/> : 'Начать'}
          </Button>
        </FixedLayout>
      </FixedLayout>
    </AppRoot>
  );
};

export default StartPage;
