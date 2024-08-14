import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppRoot,
  FixedLayout,
  Input,
  Button,
  Caption,
  Headline,
  Text,
  Spinner
} from '@telegram-apps/telegram-ui';
import { useHapticFeedback } from '@telegram-apps/sdk-react';
import checkIcon from '../../assets/checked.svg';
import errorIcon from '../../assets/wrong.svg';
import './RegistrationPage.scss';

const validateName = (name: string) => /^[A-ZА-ЯЁ][a-zа-яё]+\s[A-ZА-ЯЁ][a-zа-яё]+$/.test(name);
const validatePhoneNumber = (number: string) => /^(\+7|7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(number);
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateINN = (inn: string) => /^\d{12}$/.test(inn);

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inn: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    phone: false,
    email: false,
    inn: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hapticFeedback = useHapticFeedback();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    switch (field) {
      case 'name':
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          name: !validateName(value),
        }));
        break;
      case 'phone':
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          phone: !validatePhoneNumber(value),
        }));
        break;
      case 'email':
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: !validateEmail(value),
        }));
        break;
      case 'inn':
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          inn: !validateINN(value),
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const errors = {
      name: !validateName(formData.name),
      phone: !validatePhoneNumber(formData.phone),
      email: !validateEmail(formData.email),
      inn: !validateINN(formData.inn),
    };
    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error);
    if (!hasErrors) {
      setLoading(true);
      hapticFeedback.impactOccurred('medium');
      setTimeout(() => {
        setLoading(false);
        navigate('/documents');
      }, 1000);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Close the keyboard if the user clicks outside of the input fields
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
    }
  };

  const getStatusIcon = (hasError: boolean) => {
    return (
      <motion.img
        src={hasError ? errorIcon : checkIcon}
        alt={hasError ? 'Error' : 'Checked'}
        className="status-icon"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    );
  };

  return (
    <AppRoot>
      <FixedLayout vertical="top" className="full-screen" onClick={handleContainerClick}>
        <div className='register-layout' ref={containerRef}>
          <div className='register-content'>
            <Headline weight="3" Component={'h1'}>Регистрация</Headline>
          </div>
          <div className="form-body">
            <div className="form-item">
              <Caption weight="3" Component="span" className="input-label">
                Введите вашу Ф.И.О
              </Caption>
              <div className="form-input-wrapper">
                <Input
                  placeholder="Иванов Иван Иванович"
                  className={`form-input ${formErrors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.currentTarget.value)}
                  after={formData.name && getStatusIcon(formErrors.name)}
                />
              </div>
            </div>
            <div className="form-item">
              <Caption weight="3" Component="span" className="input-label">
                Введите ваш номер телефона
              </Caption>
              <div className="form-input-wrapper">
                <Input
                  placeholder="+7 (000) 000 00 00"
                  className={`form-input ${formErrors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.currentTarget.value)}
                  after={formData.phone && getStatusIcon(formErrors.phone)}
                />
              </div>
            </div>
            <div className="form-item">
              <Caption weight="3" Component="span" className="input-label">
                Введите ваш e-mail
              </Caption>
              <div className="form-input-wrapper">
                <Input
                  placeholder="e-mail"
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.currentTarget.value)}
                  after={formData.email && getStatusIcon(formErrors.email)}
                />
              </div>
            </div>
            <div className="form-item">
              <Caption weight="3" Component="span" className="input-label">
                Введите ИНН
              </Caption>
              <div className="form-input-wrapper">
                <Input
                  placeholder="ИНН"
                  className={`form-input ${formErrors.inn ? 'error' : ''}`}
                  value={formData.inn}
                  onChange={(e) => handleChange('inn', e.currentTarget.value)}
                  after={formData.inn && getStatusIcon(formErrors.inn)}
                />
              </div>
              {formErrors.inn && (
                <Caption level="1" Component="p" style={{ color: 'red' }}>
                  Количество цифр должно быть ровно 12
                </Caption>
              )}
            </div>
          </div>
        </div>
        <FixedLayout vertical="bottom" className="bottom-data">
          <div className="agree-data">
            <Text Component="p" className='agree-content'>
              Нажимая на кнопку “Продолжить” я даю согласие на  <span>  обработку персональных данных </span>
            </Text>
          </div>
          <Button
            className="start-button"
            style={{ background: '#1375FA', height: '58px' }}
            onClick={handleSubmit}
          >
            {loading ? <Spinner size="m" className='spinner' /> : 'Начать'}
          </Button>
        </FixedLayout>
      </FixedLayout>
    </AppRoot>
  );
};

export default RegistrationPage;
