import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { Log } from '../entities/water-intake';

export class GetLogsUseCase {
  private readonly waterIntakeGateway: WaterIntakeGateway;

  constructor(waterIntakeGateway: WaterIntakeGateway) {
    this.waterIntakeGateway = waterIntakeGateway;
  }

  async execute(): Promise<Log[]> {
    return this.waterIntakeGateway.getLogs();
  }
}
