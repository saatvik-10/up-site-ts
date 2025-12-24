export interface Alert {
  alert_id: string;
  website_id: string;
  user_id: string;
  alert_type: 'Up' | 'Down';
  triggered_at: Date;
}
