export type NotificationType = {
  success: {
    [key in NotificationKeys]?: boolean;
  };
};

export type NotificationKeys =
  | 'MODEL_ADD'
  | 'MODEL_EDIT'
  | 'LINK_EDIT'
  | 'CLASS_ADD'
  | 'CLASS_EDIT'
  | 'ASSOCIATION_ADD'
  | 'ASSOCIATION_EDIT'
  | 'ATTRIBUTE_ADD'
  | 'ATTRIBUTE_EDIT'
  | 'DOCUMENTATION_EDIT'
  | 'POSITION_SAVE'
  | 'SUBSCRIPTION_ADD'
  | 'SUBSCRIPTION_DELETE'
  | 'REQUEST_ADD'
  | 'CODE_LIST_ADDED'
  | 'CODE_LIST_REMOVED';
