export interface Entry {
  id: string;
  amount: number;
  timestamp: number;
}

export interface Log {
  date: string;
  entries: Entry[];
}
