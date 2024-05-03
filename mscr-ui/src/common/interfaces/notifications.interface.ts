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
  | 'CROSSWALK_DEPRECATE'
  | 'SCHEMA_DEPRECATE'
  | 'CROSSWALK_INVALIDATE'
  | 'SCHEMA_INVALIDATE'
  | 'CROSSWALK_DELETE'
  | 'SCHEMA_DELETE'
  | 'EDIT_MAPPINGS'
  | 'FINISH_EDITING_MAPPINGS';
  // ToDo: Add more notifications, like these below:
  // | 'MAPPING_ADD'
  // | 'MAPPING_EDIT'
  // | 'MAPPING_DELETE'
