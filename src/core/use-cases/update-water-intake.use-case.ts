import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';

export class UpdateWaterIntakeUseCase {
  private readonly waterIntakeGateway: WaterIntakeGateway;

  constructor(waterIntakeGateway: WaterIntakeGateway) {
    this.waterIntakeGateway = waterIntakeGateway;
  }

  async execute(entryId: string, newAmount: number): Promise<void> {
    const logs = await this.waterIntakeGateway.getLogs();
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedLogs = logs.map(log => {
      if (log.date === todayStr) {
        return {
          ...log,
          entries: log.entries.map(entry =>
            entry.id === entryId ? { ...entry, amount: newAmount } : entry
          ),
        };
      }
      return log;
    });

    await this.waterIntakeGateway.saveLogs(updatedLogs);
  }
}
