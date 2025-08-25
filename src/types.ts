export interface Entry {
  amount: number;
  timestamp: number;
}

export interface Log {
  date: string;
  entries: Entry[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger: {
    type: string;
    [key: string]: any;
  };
}
