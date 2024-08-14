import React from 'react';
import MainLogo from '../../assets/logo.svg';
import { AppRoot, Section, Image, FixedLayout, Text, InlineButtons } from '@telegram-apps/telegram-ui';
import './DocumentPage.scss';
import IconInbox from '../../assets/icon_inbox.svg';
import IconOutBox from '../../assets/icon_outbox.svg';

const DocumentPage: React.FC = () => {
  return (
    <AppRoot>
      <FixedLayout vertical="top" className="full-document-screen">
        <Section className="logo-container">
            <img src={MainLogo} alt="App Logo" className="document-logo" />
        </Section>
        <Section className="new-contract-section">
          <InlineButtons mode="plain" className='docs-buttons'>
            <InlineButtons.Item className='docs-button'>
              <Image src={IconInbox} alt="Inbox Icon" />
              <Text weight='3'>Входящие</Text>
            </InlineButtons.Item>
            <InlineButtons.Item className='docs-button'>
              <Image src={IconOutBox} alt="Outbox Icon" />
              <Text weight='3'>Исходящие</Text>
            </InlineButtons.Item>
          </InlineButtons>
        </Section>
      </FixedLayout>
    </AppRoot>
  );
};

export default DocumentPage;