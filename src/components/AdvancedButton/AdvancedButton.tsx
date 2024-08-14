import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { motion } from 'framer-motion';
import { useHapticFeedback } from '@telegram-apps/sdk-react';

interface AdvancedButtonProps {
  onClick: () => void;
  loading?: boolean;
  text: string;
}

const AdvancedButton: React.FC<AdvancedButtonProps> = ({ onClick, loading = false, text }) => {
  const hapticFeedback = useHapticFeedback();

  const handleClick = () => {
    hapticFeedback.impactOccurred('heavy');
    onClick();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <Button
        className="advanced-button"
        onClick={handleClick}
        style={{
          background: '#1375FA',
          height: '58px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {loading ? 'Loading...' : text}
      </Button>
    </motion.div>
  );
};

export default AdvancedButton;
