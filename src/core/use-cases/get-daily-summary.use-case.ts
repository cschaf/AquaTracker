import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { Log } from '../entities/water-intake';

export interface DailySummary {
  total: number;
  entries: Log['entries'];
}

export class GetDailySummaryUseCase {
  private readonly waterIntakeGateway: WaterIntakeGateway;

  constructor(waterIntakeGateway: WaterIntakeGateway) {
    this.waterIntakeGateway = waterIntakeGateway;
  }

  async execute(): Promise<DailySummary> {
    const logs = await this.waterIntakeGateway.getLogs();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(log => log.date === todayStr);

    if (!todayLog) {
      return { total: 0, entries: [] };
    }

    const dailyTotal = todayLog.entries.reduce((sum, entry) => sum + entry.amount, 0);

    return { total: dailyTotal, entries: todayLog.entries };
  }
}
