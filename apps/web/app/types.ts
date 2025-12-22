export interface Website {
  id: string;
  url: string;
  time_added: string;
  ticks?: WebsiteTick[];
}

export interface WebsiteTick {
  id: string;
  response_time_ms: number;
  status: 'Up' | 'Down' | 'Unknown';
  created_at: string;
}