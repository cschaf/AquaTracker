import type { Log } from '../entities/water-intake';

export interface WaterIntakeGateway {
  getLogs(): Promise<Log[]>;
  saveLogs(logs: Log[]): Promise<void>;
}
