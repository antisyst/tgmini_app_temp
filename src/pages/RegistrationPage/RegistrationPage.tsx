import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppRoot,
  FixedLayout,
  Section,
  Text,
  Input,
  Button,
  Caption,
  Headline,
  Spinner
} from '@telegram-apps/telegram-ui';
import { useHapticFeedback, useCloudStorage } from '@telegram-apps/sdk-react';
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
  const cloudStorage = useCloudStorage();

  useEffect(() => {
    const loadUserData = async () => {
      const savedData = await cloudStorage.get(['name', 'phone', 'email', 'inn']);
      setFormData((prevData) => ({
        ...prevData,
        ...savedData,
      }));
    };

    loadUserData();
  }, [cloudStorage]);

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

  const handleSubmit = async () => {
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

      await cloudStorage.set('name', formData.name);
      await cloudStorage.set('phone', formData.phone);
      await cloudStorage.set('email', formData.email);
      await cloudStorage.set('inn', formData.inn);

      setTimeout(() => {
        setLoading(false);
        navigate('/documents');
      }, 1000);
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
      <FixedLayout vertical="top" className="full-screen">
        <Section className='register-layout'>
          <Section className='register-content'>
            <Headline weight="3" Component={'h1'}>Регистрация</Headline>
          </Section>
          <Section className="form-body">
            <Section className="form-item">
              <Text weight="3" Component="span" className="input-label">
                Введите вашу Ф.И.О
              </Text>
              <Input
                placeholder="Иванов Иван Иванович"
                className={`form-input ${formErrors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={(e) => handleChange('name', e.currentTarget.value)}
                after={formData.name && getStatusIcon(formErrors.name)}
              />
            </Section>
            <Section className="form-item">
              <Text weight="3" Component="span" className="input-label">
                Введите ваш номер телефона
              </Text>
              <Input
                placeholder="+7 (000) 000 00 00"
                className={`form-input ${formErrors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.currentTarget.value)}
                after={formData.phone && getStatusIcon(formErrors.phone)}
              />
            </Section>
            <Section className="form-item">
              <Text weight="3" Component="span" className="input-label">
                Введите ваш e-mail
              </Text>
              <Input
                placeholder="e-mail"
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.currentTarget.value)}
                after={formData.email && getStatusIcon(formErrors.email)}
              />
            </Section>
            <Section className="form-item">
              <Text weight="3" Component="span" className="input-label">
                Введите ИНН
              </Text>
              <Input
                placeholder="ИНН"
                className={`form-input ${formErrors.inn ? 'error' : ''}`}
                value={formData.inn}
                onChange={(e) => handleChange('inn', e.currentTarget.value)}
                after={formData.inn && getStatusIcon(formErrors.inn)}
              />
              {formErrors.inn && (
                <Caption level="1" Component="p" style={{ color: 'red' }}>
                  Количество цифр должно быть ровно 12
                </Caption>
              )}
            </Section>
          </Section>
        </Section>
        <FixedLayout vertical="bottom" className="bottom-data">
          <Section className="agree-data">
            <Caption level="1" Component="p">
              Нажимая на кнопку “Продолжить” я даю согласие на
              <span style={{ color: '#3586FF', marginLeft: '5px' }}>
                обработку персональных данных
              </span>
            </Caption>
          </Section>
          <Button
            className="start-button"
            style={{ background: '#1375FA', height: '58px' }}
            onClick={handleSubmit}
          >
            {loading ? <Spinner size="m" /> : 'Начать'}
          </Button>
        </FixedLayout>
      </FixedLayout>
    </AppRoot>
  );
};

export default RegistrationPage;