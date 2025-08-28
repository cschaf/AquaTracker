// Gateways
import { LocalStorageWaterIntakeGateway } from '../infrastructure/storage/local-storage-water-intake.gateway';
import { LocalStorageGoalGateway } from '../infrastructure/storage/local-storage-goal.gateway';
import { LocalStorageAchievementGateway } from '../infrastructure/storage/local-storage-achievement.gateway';
import { LocalStorageQuickAddGateway } from '../infrastructure/storage/local-storage-quick-add.gateway';

// Use Cases
import { AddWaterIntakeUseCase } from '../core/use-cases/add-water-intake.use-case';
import { DeleteWaterIntakeUseCase } from '../core/use-cases/delete-water-intake.use-case';
import { UpdateWaterIntakeUseCase } from '../core/use-cases/update-water-intake.use-case';
import { GetDailySummaryUseCase } from '../core/use-cases/get-daily-summary.use-case';
import { GetDailyGoalUseCase } from '../core/use-cases/get-daily-goal.use-case';
import { SetDailyGoalUseCase } from '../core/use-cases/set-daily-goal.use-case';
import { GetQuickAddValuesUseCase } from '../core/use-cases/get-quick-add-values.use-case';
import { UpdateQuickAddValuesUseCase } from '../core/use-cases/update-quick-add-values.use-case';
import { GetLogsUseCase } from '../core/use-cases/get-logs.use-case';
import { GetAllAchievementsUseCase } from '../core/use-cases/get-all-achievements.use-case';
import { GetUnlockedAchievementsUseCase } from '../core/use-cases/get-unlocked-achievements.use-case';
import { RecalculateAchievementsUseCase } from '../core/use-cases/recalculate-achievements.use-case';
import { ExportDataUseCase } from '../core/use-cases/export-data.use-case';
import { ImportDataUseCase } from '../core/use-cases/import-data.use-case';

// Instantiate Gateways
const waterIntakeGateway = new LocalStorageWaterIntakeGateway();
const goalGateway = new LocalStorageGoalGateway();
const achievementGateway = new LocalStorageAchievementGateway();
const quickAddGateway = new LocalStorageQuickAddGateway();

// Instantiate Use Cases
const addWaterIntakeUseCase = new AddWaterIntakeUseCase(waterIntakeGateway);
const deleteWaterIntakeUseCase = new DeleteWaterIntakeUseCase(waterIntakeGateway);
const updateWaterIntakeUseCase = new UpdateWaterIntakeUseCase(waterIntakeGateway);
const getDailySummaryUseCase = new GetDailySummaryUseCase(waterIntakeGateway);
const getDailyGoalUseCase = new GetDailyGoalUseCase(goalGateway);
const setDailyGoalUseCase = new SetDailyGoalUseCase(goalGateway);
const getQuickAddValuesUseCase = new GetQuickAddValuesUseCase(quickAddGateway);
const updateQuickAddValuesUseCase = new UpdateQuickAddValuesUseCase(quickAddGateway);
const getLogsUseCase = new GetLogsUseCase(waterIntakeGateway);
const getAllAchievementsUseCase = new GetAllAchievementsUseCase();
const getUnlockedAchievementsUseCase = new GetUnlockedAchievementsUseCase(achievementGateway);
const recalculateAchievementsUseCase = new RecalculateAchievementsUseCase(waterIntakeGateway, goalGateway, achievementGateway);
const exportDataUseCase = new ExportDataUseCase(waterIntakeGateway, goalGateway);
const importDataUseCase = new ImportDataUseCase(waterIntakeGateway, goalGateway);

export const useCases = {
  addWaterIntake: addWaterIntakeUseCase,
  deleteWaterIntake: deleteWaterIntakeUseCase,
  updateWaterIntake: updateWaterIntakeUseCase,
  getDailySummary: getDailySummaryUseCase,
  getDailyGoal: getDailyGoalUseCase,
  setDailyGoal: setDailyGoalUseCase,
  getQuickAddValues: getQuickAddValuesUseCase,
  updateQuickAddValues: updateQuickAddValuesUseCase,
  getLogs: getLogsUseCase,
  getAllAchievements: getAllAchievementsUseCase,
  getUnlockedAchievements: getUnlockedAchievementsUseCase,
  checkForNewAchievements: recalculateAchievementsUseCase,
  exportData: exportDataUseCase,
  importData: importDataUseCase,
};

export type UseCases = typeof useCases;
