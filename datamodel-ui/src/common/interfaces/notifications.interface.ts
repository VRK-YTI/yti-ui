export type NotificationType = {
  success: {
    [key in NotificationKeys]?: boolean;
  };
};

export type NotificationKeys =
  | 'MODEL_ADD'
  | 'POSITION_SAVE'
  | 'VERSION_RELEASED';
