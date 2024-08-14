import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLogo from '../../assets/logo.svg';
import { AppRoot, Button, FixedLayout, Spinner } from '@telegram-apps/telegram-ui';
import { useHapticFeedback } from '@telegram-apps/sdk-react';
import { motion } from 'framer-motion';
import './StartPage.scss';

const StartPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hapticFeedback = useHapticFeedback();

  const handleStart = () => {
    setLoading(true);
    hapticFeedback.impactOccurred('medium');
    setTimeout(() => {
      setLoading(false);
      navigate('/registration');
    }, 1000);
  };

  return (
    <AppRoot>
      <FixedLayout vertical="top" className="full-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='logo-container'
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <img src={MainLogo} alt="App Logo"/>
          </motion.div>
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