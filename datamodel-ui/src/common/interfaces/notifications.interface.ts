export type NotificationType = {
  success: {
    [key in NotificationKeys]?: boolean;
  };
};

export type NotificationKeys =
  | 'MODEL_EDIT'
  | 'LINK_EDIT'
  | 'CLASS_ADD'
  | 'CLASS_EDIT'
  | 'ASSOCIATION_ADD'
  | 'ASSOCIATION_EDIT'
  | 'ATTRIBUTE_ADD'
  | 'ATTRIBUTE_EDIT'
  | 'DOCUMENTATION_EDIT'
  | 'POSITION_SAVE';
