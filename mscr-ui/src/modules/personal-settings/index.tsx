import {useTranslation} from 'next-i18next';
import {Heading, Paragraph} from 'suomifi-ui-components';

// This is a mock module for the settings. Please replace with the real one.

export default function PersonalSettings() {
  const { t } = useTranslation('common');
  return (
    <main id="main">
      <Heading variant="h1">Personal Settings</Heading>
      <Paragraph>This is a placeholder for the eventual settings page</Paragraph>
    </main>
  );
}
