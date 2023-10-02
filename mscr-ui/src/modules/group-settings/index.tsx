import {useTranslation} from 'next-i18next';
import {Heading, Paragraph} from 'suomifi-ui-components';

// This is a mock module for the settings. Please replace with the real one.

interface GroupProps {
  groupId: string;
}

export default function GroupSettings({ groupId }: GroupProps) {
  const { t } = useTranslation('common');

  return (
    <>
      <Heading variant="h1">Settings for group ID: {groupId}</Heading>
      <Paragraph>This is a placeholder for the eventual settings page</Paragraph>
    </>
  );
}
