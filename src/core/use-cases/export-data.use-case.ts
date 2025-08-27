import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { GoalGateway } from '../gateways/goal.gateway';

export class ExportDataUseCase {
  constructor(
    private readonly waterIntakeGateway: WaterIntakeGateway,
    private readonly goalGateway: GoalGateway
  ) {}

  async execute(): Promise<{ success: boolean; message?: string }> {
    const [logs, goal] = await Promise.all([
      this.waterIntakeGateway.getLogs(),
      this.goalGateway.getDailyGoal(),
    ]);

    if (!logs || logs.length === 0) {
      return { success: false, message: "No data to export." };
    }

    const exportData = {
      goal: goal,
      logs: logs,
    };

    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(exportData, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "aquatracker_data.json";
      link.click();
      return { success: true };
    } catch (error) {
      console.error("Export error:", error);
      return { success: false, message: "Failed to create export file." };
    }
  }
}
