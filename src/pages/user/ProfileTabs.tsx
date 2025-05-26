import { Customer } from '@commercetools/platform-sdk';
import { TabProvider, TabList, Tab, TabPanel } from '@gravity-ui/uikit';
import { useState } from 'react';
import { AddressesContent } from './AddressesContent';
import { UserContent } from './UserContent';

export function ProfileTabs({ userInfo }: { userInfo: Customer }) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <TabProvider value={activeTab} onUpdate={setActiveTab}>
      <TabList>
        <Tab value="profile">Profile</Tab>
        <Tab value="addresses">Addresses</Tab>
      </TabList>
      <div>
        <TabPanel value="profile">
          <UserContent userInfo={userInfo} />
        </TabPanel>
        <TabPanel value="addresses">
          <AddressesContent userInfo={userInfo} />
        </TabPanel>
      </div>
    </TabProvider>
  );
}
