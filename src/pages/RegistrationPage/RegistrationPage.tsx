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

const validateName = (name: string) => {
  const wordCount = name.trim().split(/\s+/).length;
  return (wordCount === 2 || wordCount === 3) && /^[A-ZА-ЯЁ][a-zа-яё]+(\s[A-ZА-ЯЁ][a-zа-яё]+)+$/.test(name);
};

const validatePhoneNumber = (number: string) => /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(number); // Format as +7 (XXX) XXX-XX-XX
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
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const hapticFeedback = useHapticFeedback();
  const containerRef = useRef<HTMLDivElement>(null);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(1); // Remove non-digits and +7
    let formatted = '+7';

    if (digits.length > 0) {
      formatted += ' (' + digits.slice(0, 3);
    }
    if (digits.length >= 4) {
      formatted += ') ' + digits.slice(3, 6);
    }
    if (digits.length >= 7) {
      formatted += '-' + digits.slice(6, 8);
    }
    if (digits.length >= 9) {
      formatted += '-' + digits.slice(8, 10);
    }

    return formatted;
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    } else if (field === 'inn') {
      // Limit the INN field to a maximum of 12 digits
      if (value.length > 12 || !/^\d*$/.test(value)) {
        return;
      }
    }

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

  const handleFocus = (field: string) => {
    if (field === 'phone' && !formData.phone.startsWith('+7')) {
      setFormData((prevData) => ({
        ...prevData,
        phone: '+7',
      }));
    }
  };

  const handleBlur = (field: string) => {
    if (field === 'phone' && formData.phone === '+7') {
      setFormData((prevData) => ({
        ...prevData,
        phone: '',
      }));
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
    if (hasErrors) {
      hapticFeedback.notificationOccurred('error');
      if (errors.inn) {
        setGeneralError('Количество цифр должно быть ровно 12');
      } else {
        setGeneralError('Ошибка');
      }
    } else {
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

  const getStatusIcon = (hasError: boolean, value: string, field: string) => {
    if (field === 'phone' && (value === '+7' || value === '')) {
      return null;
    }

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
                  after={formData.name && getStatusIcon(formErrors.name, formData.name, 'name')}
                />
              </div>
              {formErrors.name && (
                <Caption level="1" Component="p" style={{ color: 'red' }}>
                  Ф.И.О должно состоять из 2 или 3 слов
                </Caption>
              )}
            </div>
            <div className="form-item">
              <Caption weight="3" Component="span" className="input-label">
                Введите ваш номер телефона
              </Caption>
              <div className="form-input-wrapper">
                <Input
                  placeholder="+7 (000) 000-00-00"
                  className={`form-input ${formErrors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.currentTarget.value)}
                  onFocus={() => handleFocus('phone')}
                  onBlur={() => handleBlur('phone')}
                  after={getStatusIcon(formErrors.phone, formData.phone, 'phone')}
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
                  after={formData.email && getStatusIcon(formErrors.email, formData.email, 'email')}
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
                  after={formData.inn && getStatusIcon(formErrors.inn, formData.inn, 'inn')}
                />
              </div>
              {formErrors.inn && (
                <Caption level="1" Component="p" style={{ color: 'red' }}>
                  Количество цифр должно быть ровно 12
                </Caption>
              )}
            </div>
            {generalError && (
              <div className="general-error">
                <Caption level="1" Component="p" style={{ color: 'red' }}>
                  {generalError}
                </Caption>
              </div>
            )}
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