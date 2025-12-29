export interface Website {
  id: string;
  url: string;
  time_added: string;
  ticks?: WebsiteTick[];
  alerts?: Alert[];
}

export interface WebsiteTick {
  id: string;
  response_time_ms: number;
  status: 'Up' | 'Down' | 'Unknown';
  created_at: string;
}

export interface Alert {
  id: string;
  status: 'Up' | 'Down' | 'Unknown';
  time_added: string;
}