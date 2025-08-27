import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { GoalGateway } from '../gateways/goal.gateway';
import type { Log } from '../entities/water-intake';
import type { DailyGoal } from '../entities/goal';

interface ImportedData {
  goal: DailyGoal;
  logs: Log[];
}

export class ImportDataUseCase {
  private readonly waterIntakeGateway: WaterIntakeGateway;
  private readonly goalGateway: GoalGateway;

  constructor(
    waterIntakeGateway: WaterIntakeGateway,
    goalGateway: GoalGateway
  ) {
    this.waterIntakeGateway = waterIntakeGateway;
    this.goalGateway = goalGateway;
  }

  async execute(file: File): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const importedData = JSON.parse(event.target!.result as string) as ImportedData;

          if (importedData && typeof importedData.goal === 'number' && Array.isArray(importedData.logs)) {
            await this.goalGateway.saveDailyGoal(importedData.goal);
            await this.waterIntakeGateway.saveLogs(importedData.logs);
            resolve({ success: true, message: "Data imported successfully! The page will now reload to apply the changes." });
            // The reload itself will be handled by the UI layer after it receives the success message.
          } else {
            resolve({ success: false, message: "Invalid data format. Please import a valid JSON file exported from AquaTracker." });
          }
        } catch (error) {
          console.error("Import error:", error);
          resolve({ success: false, message: "Error reading or parsing the file. Please ensure it's a valid JSON file." });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, message: "Error reading the file." });
      };
      reader.readAsText(file);
    });
  }
}
