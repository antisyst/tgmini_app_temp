import React from 'react';
import MainLogo from '../../assets/logo.svg';
import { AppRoot, FixedLayout, Text, InlineButtons } from '@telegram-apps/telegram-ui';
import './DocumentPage.scss';
import IconInbox from '../../assets/icon_inbox.svg';
import IconOutBox from '../../assets/icon_outbox.svg';

const DocumentPage: React.FC = () => {
  return (
    <AppRoot>
      <FixedLayout vertical="top" className="full-document-screen">
        <div className="logo-container">
            <img src={MainLogo} alt="App Logo" className="document-logo" />
        </div>
        <div className="new-contract-section">
          <InlineButtons mode="plain" className='docs-buttons'>
            <InlineButtons.Item className='docs-button'>
              <img src={IconInbox} alt="Inbox Icon" />
              <Text weight='3'>Входящие</Text>
            </InlineButtons.Item>
            <InlineButtons.Item className='docs-button'>
              <img src={IconOutBox} alt="Outbox Icon" />
              <Text weight='3'>Исходящие</Text>
            </InlineButtons.Item>
          </InlineButtons>
        </div>
      </FixedLayout>
    </AppRoot>
  );
};

export default DocumentPage;