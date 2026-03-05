export type NotificationAlerts = {
  jobMatch: boolean;
  autoApply: boolean;
  simulation: boolean;
};

export type NotificationsData = {
  alerts: NotificationAlerts;
};
