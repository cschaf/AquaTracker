import type { Log } from '../entities/water-intake';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';

export class DeleteWaterIntakeUseCase {
  private readonly waterIntakeGateway: WaterIntakeGateway;

  constructor(waterIntakeGateway: WaterIntakeGateway) {
    this.waterIntakeGateway = waterIntakeGateway;
  }

  async execute(entryId: string): Promise<void> {
    const logs = await this.waterIntakeGateway.getLogs();
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedLogs = logs
      .map(log => {
        if (log.date === todayStr) {
          const updatedEntries = log.entries.filter(entry => entry.id !== entryId);
          // If the log for today has no more entries, remove it
          if (updatedEntries.length === 0) {
            return null;
          }
          return { ...log, entries: updatedEntries };
        }
        return log;
      })
      .filter((log): log is Log => log !== null); // Type guard to filter out nulls

    await this.waterIntakeGateway.saveLogs(updatedLogs);
  }
}
