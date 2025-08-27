import type { Entry, Log } from '../entities/water-intake';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import { generateRandomId } from '../../shared/lib/idGenerator';

export class AddWaterIntakeUseCase {
  private readonly waterIntakeGateway: WaterIntakeGateway;

  constructor(waterIntakeGateway: WaterIntakeGateway) {
    this.waterIntakeGateway = waterIntakeGateway;
  }

  async execute(amount: number): Promise<void> {
    const logs = await this.waterIntakeGateway.getLogs();
    const todayStr = new Date().toISOString().split('T')[0];
    const now = Date.now();

    const newEntry: Entry = {
      id: `${now}-${generateRandomId()}`,
      amount,
      timestamp: now,
    };

    const todayLogIndex = logs.findIndex(log => log.date === todayStr);

    let updatedLogs: Log[];

    if (todayLogIndex > -1) {
      updatedLogs = logs.map((log, index) => {
        if (index === todayLogIndex) {
          return { ...log, entries: [...log.entries, newEntry] };
        }
        return log;
      });
    } else {
      const newLog: Log = { date: todayStr, entries: [newEntry] };
      updatedLogs = [...logs, newLog];
    }

    await this.waterIntakeGateway.saveLogs(updatedLogs);
  }
}
