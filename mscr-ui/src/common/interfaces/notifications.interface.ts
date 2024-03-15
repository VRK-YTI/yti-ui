export type NotificationType = {
  success: {
    [key in NotificationKeys]?: boolean;
  };
};

export type NotificationKeys =
  | 'CROSSWALK_SAVE'
  | 'SCHEMA_SAVE'
  | 'CROSSWALK_PUBLISH'
  | 'SCHEMA_PUBLISH'
  | 'CROSSWALK_DELETE'
  | 'SCHEMA_DELETE';
  // ToDo: Add more notifications, like these below:
  // | 'MAPPING_ADD'
  // | 'MAPPING_EDIT'
  // | 'CROSSWALK_DELETE'
  // | 'SCHEMA_DELETE'
  // | 'MAPPING_DELETE'
