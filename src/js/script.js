// Initialize app
const WARNING_THRESHOLD = 8000; // 8 liters in ml
const CRITICAL_THRESHOLD = 10000; // 10 liters in ml

const INTAKE_STATUS = {
    OK: 'OK',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL'
};

let allAchievements = [];

function checkWaterIntake(dailyIntake) {
    if (dailyIntake >= CRITICAL_THRESHOLD) {
        return {
            status: INTAKE_STATUS.CRITICAL,
            message: "CRITICAL WARNING: Your water intake has reached a potentially dangerous level. Stop drinking water immediately and seek medical advice if you feel unwell (e.g., headache, nausea).",
            threshold: CRITICAL_THRESHOLD
        };
    } else if (dailyIntake >= WARNING_THRESHOLD) {
        return {
            status: INTAKE_STATUS.WARNING,
            message: "Warning: Your daily water intake is high. Exceeding 10 liters can be dangerous. Please be mindful.",
            threshold: WARNING_THRESHOLD
        };
    } else {
        return {
            status: INTAKE_STATUS.OK,
            message: "",
            threshold: null
        };
    }
}

async function loadAchievements() {
    try {
        const response = await fetch('src/js/achievements.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allAchievements = await response.json();
    } catch (error) {
        console.error("Could not load achievements:", error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadAchievements();
    // Set current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);

    // Load data from localStorage
    let logs = JSON.parse(localStorage.getItem('waterTrackerData')) || [];
    let dailyGoal = parseInt(localStorage.getItem('waterTrackerGoal')) || 2000;
    document.getElementById('daily-goal').value = dailyGoal;

    // Get today's date string
    const todayStr = now.toISOString().split('T')[0];

    // Modal elements
    const achievementModal = document.getElementById('achievement-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalIcon = document.getElementById('modal-icon').querySelector('i');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    // Warning UI Elements
    const intakeWarningBanner = document.getElementById('intake-warning-banner');
    const intakeWarningMessage = document.getElementById('intake-warning-message');
    const criticalWarningModal = document.getElementById('critical-warning-modal');
    const criticalWarningMessage = document.getElementById('critical-warning-message');
    const criticalModalCloseBtn = document.getElementById('critical-modal-close-btn');

    // Add water controls
    const quickAddButtons = document.querySelectorAll('.quick-add');
    const customAmountInput = document.getElementById('custom-amount');
    const addCustomButton = document.getElementById('add-custom');


    // Get today's log
    let todayLog = logs.find(log => log.date === todayStr);

    // Update UI with today's data
    updateUI();

    // Quick add buttons
    document.querySelectorAll('.quick-add').forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseInt(this.getAttribute('data-amount'));
            addWaterEntry(amount);
        });
    });

    // Custom add button
    document.getElementById('add-custom').addEventListener('click', function() {
        const amount = parseInt(document.getElementById('custom-amount').value);
        if (amount && amount > 0) {
            addWaterEntry(amount);
            document.getElementById('custom-amount').value = '';
        }
    });

    // Custom amount input on Enter key
    document.getElementById('custom-amount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('add-custom').click();
        }
    });

    // Daily goal input change
    document.getElementById('daily-goal').addEventListener('change', function() {
        dailyGoal = parseInt(this.value) || 2000;
        localStorage.setItem('waterTrackerGoal', dailyGoal);
        updateUI();
    });

    // Export data button
    document.getElementById('export-data').addEventListener('click', function() {
        exportDataToJson(logs, dailyGoal);
    });

    // Enable/disable import button based on file selection
    const importFileInput = document.getElementById('import-file');
    const importDataButton = document.getElementById('import-data');

    importFileInput.addEventListener('change', function() {
        importDataButton.disabled = this.files.length === 0;
    });

    // Import data button
    document.getElementById('import-data').addEventListener('click', function() {
        const importFile = document.getElementById('import-file').files[0];
        if (importFile) {
            importData(importFile);
        } else {
            alert("Please select a file to import.");
        }
    });

    // Function to add water entry
    function addWaterEntry(amount) {
        const timestamp = Date.now();
        const entry = { amount, timestamp };

        // Ensure today's log object exists and get a fresh reference.
        let logForToday = logs.find(log => log.date === todayStr);
        if (!logForToday) {
            logForToday = { date: todayStr, entries: [] };
            logs.push(logForToday);
        }
        todayLog = logForToday; // Keep the global reference up to date.

        // Add the new entry to the log object from the array.
        logForToday.entries.push(entry);

        // Save to localStorage and update the UI
        localStorage.setItem('waterTrackerData', JSON.stringify(logs));
        updateUI();
    }

    // ----------------------------------------------------------------------------------
    // Achievement Calculation Logic
    // ----------------------------------------------------------------------------------

    function calculateAndStoreAchievements() {
        let newlyUnlocked = [];
        const previouslyUnlocked = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];

        const dailyTotals = new Map();
        logs.forEach(log => {
            const total = log.entries.reduce((sum, entry) => sum + entry.amount, 0);
            dailyTotals.set(log.date, total);
        });

        const currentUnlocked = allAchievements.filter(achievement => {
            let earned = false;
            const trigger = achievement.trigger;

            switch (trigger.type) {
                case 'log_count':
                    earned = dailyTotals.size >= trigger.days;
                    break;
                case 'consecutive_goals':
                    earned = checkConsecutiveGoals(dailyTotals, dailyGoal, trigger.days);
                    break;
                case 'total_volume':
                    const totalVolume = logs.reduce((sum, log) => sum + log.entries.reduce((s, e) => s + e.amount, 0), 0);
                    earned = totalVolume >= trigger.amount;
                    break;
                case 'goal_met':
                    const goalsMetCount = [...dailyTotals.values()].filter(total => total >= dailyGoal).length;
                    earned = goalsMetCount >= trigger.times;
                    break;
                case 'goals_in_week':
                    earned = checkGoalsInWeek(dailyTotals, dailyGoal, trigger.count);
                    break;
                case 'exceed_goal_by':
                    earned = [...dailyTotals.values()].some(total => total >= dailyGoal * (trigger.percentage / 100));
                    break;
                case 'log_before_time':
                    earned = logs.some(log => log.entries.some(e => new Date(e.timestamp).getHours() < trigger.hour));
                    break;
                case 'log_after_time':
                    earned = logs.some(log => log.entries.some(e => new Date(e.timestamp).getHours() >= trigger.hour));
                    break;
                case 'logs_per_day_for_days':
                    earned = checkLogsPerDayForDays(logs, trigger.logs, trigger.days);
                    break;
                case 'log_on_date':
                    earned = logs.some(log => {
                        const logDate = new Date(log.date);
                        return logDate.getUTCMonth() + 1 === trigger.month && logDate.getUTCDate() === trigger.day;
                    });
                    break;
                case 'log_date_range':
                    earned = checkLogDateRange(dailyTotals, dailyGoal, trigger.start, trigger.end);
                    break;
                case 'log_after_break':
                    earned = checkLogAfterBreak(dailyTotals, trigger.days);
                    break;
                case 'log_streak':
                    earned = checkLogStreak(dailyTotals, trigger.days);
                    break;
                case 'log_at_time_for_days':
                    earned = checkLogAtTimeForDays(logs, trigger.hour, trigger.days);
                    break;
                case 'single_log_amount':
                    earned = logs.some(log => log.entries.some(e => e.amount >= trigger.amount));
                    break;
                case 'weekend_goal':
                    earned = checkWeekendGoal(dailyTotals, dailyGoal, trigger.weeks);
                    break;
            }
            return earned;
        }).map(a => a.id);

        newlyUnlocked = currentUnlocked.filter(id => !previouslyUnlocked.includes(id));
        localStorage.setItem('unlockedAchievements', JSON.stringify(currentUnlocked));

        return newlyUnlocked;
    }

    function handleNewAchievements(newlyUnlocked) {
        if (newlyUnlocked.length > 0) {
            newlyUnlocked.forEach(achievementId => {
                const achievement = allAchievements.find(a => a.id === achievementId);
                if (achievement) {
                    // Slight delay to allow the main UI to update first
                    setTimeout(() => {
                        openAchievementModal(achievement, true);
                    }, 500);
                }
            });
        }
    }

    function checkConsecutiveGoals(dailyTotals, goal, days) {
        const sortedDates = [...dailyTotals.keys()].sort();
        if (sortedDates.length < days) return false;
        let consecutiveCount = 0;
        let lastDate = null;

        for (const dateStr of sortedDates) {
            const currentDate = new Date(dateStr);
            if (lastDate && (currentDate - lastDate) / (1000 * 60 * 60 * 24) === 1) {
                if (dailyTotals.get(dateStr) >= goal) {
                    consecutiveCount++;
                } else {
                    consecutiveCount = 0;
                }
            } else {
                 if (dailyTotals.get(dateStr) >= goal) {
                    consecutiveCount = 1;
                } else {
                    consecutiveCount = 0;
                }
            }
            if (consecutiveCount >= days) return true;
            lastDate = currentDate;
        }
        return false;
    }

    function checkGoalsInWeek(dailyTotals, goal, count) {
        const weeks = {};
        for (const [dateStr, total] of dailyTotals.entries()) {
            if (total >= goal) {
                const date = new Date(dateStr);
                const year = date.getUTCFullYear();
                const week = getWeekNumber(date);
                const weekId = `${year}-${week}`;
                if (!weeks[weekId]) weeks[weekId] = 0;
                weeks[weekId]++;
                if (weeks[weekId] >= count) return true;
            }
        }
        return false;
    }

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    }

    function checkLogsPerDayForDays(logs, logCount, numDays) {
        const dailyLogCounts = new Map();
        logs.forEach(log => {
            dailyLogCounts.set(log.date, log.entries.length);
        });

        const sortedDates = [...dailyLogCounts.keys()].sort();
        if(sortedDates.length < numDays) return false;

        let consecutiveDays = 0;
        let lastDate = null;

        for(const dateStr of sortedDates){
            const currentDate = new Date(dateStr);
            if (lastDate && (currentDate - lastDate) / (1000 * 60 * 60 * 24) === 1) {
                if(dailyLogCounts.get(dateStr) >= logCount){
                    consecutiveDays++;
                } else {
                    consecutiveDays = 0;
                }
            } else {
                if(dailyLogCounts.get(dateStr) >= logCount){
                    consecutiveDays = 1;
                } else {
                    consecutiveDays = 0;
                }
            }
            if(consecutiveDays >= numDays) return true;
            lastDate = currentDate;
        }
        return false;
    }

    function checkLogDateRange(dailyTotals, goal, start, end) {
        const [startMonth, startDay] = start.split('-').map(Number);
        const [endMonth, endDay] = end.split('-').map(Number);

        const years = new Set([...dailyTotals.keys()].map(d => new Date(d).getFullYear()));

        for(const year of years) {
            let allDaysMet = true;
            const startDate = new Date(year, startMonth - 1, startDay);
            const endDate = new Date(year, endMonth - 1, endDay);

            for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                if (!dailyTotals.has(dateStr) || dailyTotals.get(dateStr) < goal) {
                    allDaysMet = false;
                    break;
                }
            }
            if(allDaysMet) return true;
        }
        return false;
    }

    function checkLogAfterBreak(dailyTotals, breakDays) {
        const sortedDates = [...dailyTotals.keys()].sort();
        if (sortedDates.length < 2) return false;

        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i-1]);
            const currDate = new Date(sortedDates[i]);
            const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
            if (diffDays > breakDays) {
                return true;
            }
        }
        return false;
    }

    function checkLogStreak(dailyTotals, days){
         const sortedDates = [...dailyTotals.keys()].sort();
        if (sortedDates.length < days) return false;
        let consecutiveCount = 0;
        let lastDate = null;

        for (const dateStr of sortedDates) {
            const currentDate = new Date(dateStr);
            if (lastDate && (currentDate - lastDate) / (1000 * 60 * 60 * 24) === 1) {
                consecutiveCount++;
            } else {
                consecutiveCount = 1;
            }
            if (consecutiveCount >= days) return true;
            lastDate = currentDate;
        }
        return false;
    }

    function checkLogAtTimeForDays(logs, hour, numDays) {
        const datesWithSpecificLog = new Set();
        logs.forEach(log => {
            if (log.entries.some(e => new Date(e.timestamp).getHours() === hour)) {
                datesWithSpecificLog.add(log.date);
            }
        });

        const sortedDates = [...datesWithSpecificLog].sort();
        if(sortedDates.length < numDays) return false;

        let consecutiveCount = 0;
        let lastDate = null;

        for(const dateStr of sortedDates) {
            const currentDate = new Date(dateStr);
             if (lastDate && (currentDate - lastDate) / (1000 * 60 * 60 * 24) === 1) {
                consecutiveCount++;
            } else {
                consecutiveCount = 1;
            }
            if (consecutiveCount >= numDays) return true;
            lastDate = currentDate;
        }
        return false;
    }

    function checkWeekendGoal(dailyTotals, goal, weeks) {
        const weekendGoalsMet = new Set();
        for (const [dateStr, total] of dailyTotals.entries()) {
            if (total >= goal) {
                const date = new Date(dateStr);
                const dayOfWeek = date.getUTCDay();
                if (dayOfWeek === 6 || dayOfWeek === 0) { // Saturday or Sunday
                    const year = date.getUTCFullYear();
                    const week = getWeekNumber(date);
                    weekendGoalsMet.add(`${year}-${week}-${dayOfWeek}`);
                }
            }
        }

        // Count weeks with both Saturday and Sunday goals met
        const weekCounts = {};
        for(const item of weekendGoalsMet){
            const [year, week, day] = item.split('-');
            const weekId = `${year}-${week}`;
            if(!weekCounts[weekId]) weekCounts[weekId] = new Set();
            weekCounts[weekId].add(day);
        }

        let completeWeekendCount = 0;
        for(const weekId in weekCounts){
            if(weekCounts[weekId].has('0') && weekCounts[weekId].has('6')){
                completeWeekendCount++;
            }
        }

        return completeWeekendCount >= weeks;
    }


    criticalModalCloseBtn.addEventListener('click', () => {
        criticalWarningModal.classList.add('hidden');
    });

    // Function to update UI
    function updateUI() {
        // Calculate daily total
        const dailyTotal = todayLog ? todayLog.entries.reduce((sum, entry) => sum + entry.amount, 0) : 0;
        document.getElementById('daily-total').textContent = dailyTotal;

        // Check water intake status
        const intakeStatus = checkWaterIntake(dailyTotal);

        // Handle UI updates based on intake status
        // Hide both warnings by default
        intakeWarningBanner.classList.add('hidden');
        criticalWarningModal.classList.add('hidden');

        if (intakeStatus.status === INTAKE_STATUS.WARNING) {
            intakeWarningMessage.textContent = intakeStatus.message;
            intakeWarningBanner.classList.remove('hidden');
        } else if (intakeStatus.status === INTAKE_STATUS.CRITICAL) {
            criticalWarningMessage.textContent = intakeStatus.message;
            criticalWarningModal.classList.remove('hidden');
        }

        // Disable controls if critical limit is reached
        const isCritical = intakeStatus.status === INTAKE_STATUS.CRITICAL;
        quickAddButtons.forEach(button => {
            button.disabled = isCritical;
            button.classList.toggle('opacity-50', isCritical);
            button.classList.toggle('cursor-not-allowed', isCritical);
            button.classList.toggle('hover:bg-blue-200', !isCritical);
            button.classList.toggle('hover:scale-105', !isCritical);

        });
        customAmountInput.disabled = isCritical;
        customAmountInput.classList.toggle('bg-gray-200', isCritical);

        addCustomButton.disabled = isCritical;
        addCustomButton.classList.toggle('opacity-50', isCritical);
        addCustomButton.classList.toggle('cursor-not-allowed', isCritical);
        addCustomButton.classList.toggle('hover:bg-green-600', !isCritical);
        addCustomButton.classList.toggle('hover:scale-105', !isCritical);


        // Update progress bar
        const percentage = dailyGoal > 0 ? Math.min((dailyTotal / dailyGoal) * 100, 100) : 0;
        document.getElementById('water-level').style.width = `${percentage}%`;
        document.getElementById('progress-percentage').textContent = `${Math.round(percentage)}%`;

        // Update weekly chart
        updateWeeklyChart();

        // Update stats overview, which includes weekly total, best streak, and current streak.
        updateStatsOverview();

        // Calculate and display achievements
        const newlyUnlocked = calculateAndStoreAchievements();
        displayAchievements();
        handleNewAchievements(newlyUnlocked);

        // Update entries list
        const entriesContainer = document.getElementById('entries-container');
        if (!todayLog || todayLog.entries.length === 0) {
            entriesContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-glass-water text-4xl mb-3 text-blue-300"></i>
                    <p>No entries yet. Add your first water intake!</p>
                </div>
            `;
        } else {
            // Sort entries by timestamp (newest first)
            const sortedEntries = [...todayLog.entries].sort((a, b) => b.timestamp - a.timestamp);

            entriesContainer.innerHTML = sortedEntries.map(entry => {
                const entryDate = new Date(entry.timestamp);
                const timeString = entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return `
                    <div class="entry-item bg-blue-50 p-4 rounded-xl flex items-center justify-between" data-timestamp="${entry.timestamp}">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                <i class="fas fa-tint text-white"></i>
                            </div>
                            <div>
                                <p class="font-bold text-gray-800">${entry.amount} ml</p>
                                <p class="text-sm text-gray-500">${timeString}</p>
                            </div>
                        </div>
                        <div>
                            <button class="edit-entry text-blue-500 hover:text-blue-700 mr-2">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="delete-entry text-red-500 hover:text-red-700" data-timestamp="${entry.timestamp}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            // Add event listeners
            document.querySelectorAll('.delete-entry').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const timestamp = parseInt(this.getAttribute('data-timestamp'));
                    deleteEntry(timestamp);
                });
            });

            document.querySelectorAll('.edit-entry').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const entryItem = this.closest('.entry-item');
                    const timestamp = parseInt(entryItem.getAttribute('data-timestamp'));
                    const entry = todayLog.entries.find(e => e.timestamp === timestamp);

                    entryItem.innerHTML = `
                        <div class="flex items-center flex-grow">
                            <input type="number" value="${entry.amount}" class="w-full p-2 border-2 border-blue-300 rounded-lg">
                        </div>
                        <div class="flex">
                            <button class="save-entry text-green-500 hover:text-green-700 mr-2">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="cancel-edit text-red-500 hover:text-red-700">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;

                    entryItem.querySelector('.save-entry').addEventListener('click', () => {
                        const newAmount = parseInt(entryItem.querySelector('input').value);
                        if (newAmount && newAmount > 0) {
                            updateEntry(timestamp, newAmount);
                        }
                    });

                    entryItem.querySelector('.cancel-edit').addEventListener('click', () => {
                        updateUI();
                    });
                });
            });
        }
    }

    // Function to delete entry
    function deleteEntry(timestamp) {
        // Get a fresh reference to today's log.
        let logForToday = logs.find(log => log.date === todayStr);
        if (!logForToday) return; // Should not happen if delete button is visible.

        // Remove the entry from the log.
        logForToday.entries = logForToday.entries.filter(entry => entry.timestamp !== timestamp);

        // If the last entry is gone, remove the entire log for today and update todayLog.
        if (logForToday.entries.length === 0) {
            logs = logs.filter(log => log.date !== todayStr);
            todayLog = undefined; // Crucial: update the global reference
        } else {
            todayLog = logForToday; // Keep the global reference up to date.
        }

        // Save to localStorage and update the UI.
        localStorage.setItem('waterTrackerData', JSON.stringify(logs));
        updateUI();
    }

    function updateEntry(timestamp, newAmount) {
        let logForToday = logs.find(log => log.date === todayStr);
        if (!logForToday) return;

        const entry = logForToday.entries.find(e => e.timestamp === timestamp);
        if (entry) {
            entry.amount = newAmount;
        }

        localStorage.setItem('waterTrackerData', JSON.stringify(logs));
        updateUI();
    }

    // Function to export data
    function exportDataToJson(logs, goal) {
        if (!logs || logs.length === 0) {
            alert("No data to export.");
            return;
        }

        const exportData = {
            goal: goal,
            logs: logs
        };

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(exportData, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "water_consumption_data.json";
        link.click();
    }

    // Function to import data from a JSON file
    function importData(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importedData = JSON.parse(event.target.result);

                // New format validation
                if (importedData && typeof importedData.goal === 'number' && Array.isArray(importedData.logs)) {
                    localStorage.setItem('waterTrackerGoal', importedData.goal);
                    localStorage.setItem('waterTrackerData', JSON.stringify(importedData.logs));
                    alert("Data imported successfully! The page will now reload to apply the changes.");
                    location.reload();
                }
                // Old format validation (for backward compatibility)
                else if (Array.isArray(importedData)) {
                    localStorage.setItem('waterTrackerData', JSON.stringify(importedData));
                    alert("Data imported successfully (using old format). The page will now reload.");
                    location.reload();
                }
                else {
                    alert("Invalid data format. Please import a valid JSON file exported from AquaTracker.");
                }
            } catch (error) {
                alert("Error reading or parsing the file. Please ensure it's a valid JSON file.");
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);
    }

    // Function to update the weekly chart
    function updateStatsOverview() {
        const thisWeekTotalEl = document.getElementById('this-week-total');
        const thisWeekGoalEl = document.getElementById('this-week-goal');
        const thisWeekProgressEl = document.getElementById('this-week-progress');

        // Calculate this week's total
        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
        const firstDayOfWeek = new Date(today);
        // Adjust to Monday
        firstDayOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        let weeklyTotal = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date(firstDayOfWeek);
            d.setDate(firstDayOfWeek.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const log = logs.find(l => l.date === dateStr);
            if (log) {
                weeklyTotal += log.entries.reduce((sum, entry) => sum + entry.amount, 0);
            }
        }
        thisWeekTotalEl.textContent = `${(weeklyTotal / 1000).toFixed(1)}L`;

        // Update weekly goal
        const weeklyGoal = dailyGoal * 7;
        thisWeekGoalEl.textContent = `Goal: ${(weeklyGoal / 1000).toFixed(1)}L`;
        let weeklyProgress = weeklyGoal > 0 ? (weeklyTotal / weeklyGoal) * 100 : 0;
        weeklyProgress = Math.min(weeklyProgress, 100);
        thisWeekProgressEl.style.width = `${weeklyProgress}%`;

        // Pre-calculate daily totals for efficiency
        const dailyTotals = new Map();
        logs.forEach(log => {
            const total = log.entries.reduce((sum, entry) => sum + entry.amount, 0);
            dailyTotals.set(log.date, total);
        });

        // Calculate best streak
        const bestStreakEl = document.getElementById('best-streak');

        let bestStreak = 0;
        if (dailyTotals.size > 0) {
            const sortedDates = [...dailyTotals.keys()].sort();
            const firstDate = new Date(sortedDates[0]);
            const lastDate = new Date(sortedDates[sortedDates.length - 1]);
            let currentDate = new Date(firstDate);
            let streakCounter = 0;

            while(currentDate <= lastDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const total = dailyTotals.get(dateStr) || 0;

                if (total >= dailyGoal) {
                    streakCounter++;
                } else {
                    if (streakCounter > bestStreak) {
                        bestStreak = streakCounter;
                    }
                    streakCounter = 0;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            if (streakCounter > bestStreak) {
                bestStreak = streakCounter;
            }
        }
        bestStreakEl.textContent = `${bestStreak} days`;

        // Calculate current streak
        const currentStreakTextEl = document.getElementById('current-streak-text');
        const currentStreakProgressEl = document.getElementById('current-streak-progress');
        let currentStreak = 0;
        if (dailyTotals.size > 0) {
            const sortedDates = [...dailyTotals.keys()].sort();
            const firstLogDate = new Date(sortedDates[0]);

            let startDate = new Date(); // Today
            const todayStr = startDate.toISOString().split('T')[0];
            const todayTotal = dailyTotals.get(todayStr) || 0;

            // If today's goal is not met, start checking from yesterday
            if (todayTotal < dailyGoal) {
                startDate.setDate(startDate.getDate() - 1);
            }

            let streakDate = startDate;

            while (streakDate >= firstLogDate) {
                const dateStr = streakDate.toISOString().split('T')[0];
                const total = dailyTotals.get(dateStr) || 0;

                if (total >= dailyGoal) {
                    currentStreak++;
                } else {
                    // Streak is broken
                    break;
                }
                streakDate.setDate(streakDate.getDate() - 1);
            }
        }
        currentStreakTextEl.textContent = `Current: ${currentStreak} days`;
        let streakProgress = bestStreak > 0 ? (currentStreak / bestStreak) * 100 : 0;
        streakProgress = Math.min(streakProgress, 100);
        currentStreakProgressEl.style.width = `${streakProgress}%`;
    }

    function updateWeeklyChart() {
        const weeklyChart = document.getElementById('weekly-chart');
        const weeklyAvg = document.getElementById('weekly-avg');
        if (!weeklyChart || !weeklyAvg) return;

        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let weeklyTotal = 0;
        let daysWithIntake = 0;

        // Get the last 7 days of data
        const last7DaysData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = logs.find(l => l.date === dateStr);
            const total = log ? log.entries.reduce((sum, entry) => sum + entry.amount, 0) : 0;
            last7DaysData.push({
                day: days[d.getDay()],
                total: total
            });
            if (total > 0) {
                weeklyTotal += total;
                daysWithIntake++;
            }
        }

        const maxIntake = Math.max(...last7DaysData.map(d => d.total), dailyGoal);

        weeklyChart.innerHTML = last7DaysData.map(data => {
            const percentage = maxIntake > 0 ? (data.total / maxIntake) * 100 : 0;
            const barHeight = percentage > 5 ? `${percentage}%` : 'auto';
            const textColor = percentage > 15 ? 'text-white' : 'text-gray-800';
            const amountPosition = percentage > 15 ? '' : 'bar-amount-outside';

            return `
                <div class="flex flex-col items-center justify-end h-full">
                    <div class="w-10 bg-blue-500 rounded-t-lg relative" style="height: ${barHeight}" title="${data.total} ml">
                        <div class="bar-amount ${textColor} ${amountPosition}">${data.total} ml</div>
                    </div>
                    <span class="text-sm text-gray-600 mt-2">${data.day}</span>
                </div>
            `;
        }).join('');

        const avgIntake = daysWithIntake > 0 ? weeklyTotal / daysWithIntake : 0;
        weeklyAvg.textContent = `${(avgIntake / 1000).toFixed(1)}L`;
    }

    function displayAchievements() {
        const container = document.getElementById('achievements-container');
        if (!container) return;

        const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];

        // Sort achievements: unlocked first, then by original order
        const sortedAchievements = [...allAchievements].sort((a, b) => {
            const aUnlocked = unlockedAchievements.includes(a.id);
            const bUnlocked = unlockedAchievements.includes(b.id);
            if (aUnlocked && !bUnlocked) return -1;
            if (!aUnlocked && bUnlocked) return 1;
            return 0; // Keep original order among locked/unlocked groups
        });

        container.innerHTML = sortedAchievements.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const badgeClasses = isUnlocked
                ? 'bg-white bg-opacity-20'
                : 'bg-black bg-opacity-20 filter grayscale cursor-help';
            const iconClass = isUnlocked ? 'text-amber-300' : 'text-gray-500';
            const textClass = isUnlocked ? 'text-white' : 'text-gray-300';
            const description = isUnlocked ? achievement.description : 'Locked';

            return `
                <div class="achievement-badge ${badgeClasses} rounded-xl p-3 text-center transition-all duration-300 transform hover:scale-110" data-achievement-id="${achievement.id}" title="${achievement.name}: ${description}">
                    <i class="${achievement.icon} text-2xl mb-2 ${iconClass}"></i>
                    <p class="font-semibold text-xs ${textClass} break-words">${achievement.name}</p>
                </div>
            `;
        }).join('');

        // Add event listeners to badges
        document.querySelectorAll('.achievement-badge').forEach(badge => {
            badge.addEventListener('click', () => {
                const achievementId = badge.getAttribute('data-achievement-id');
                const achievement = allAchievements.find(a => a.id === achievementId);
                if (achievement) {
                    openAchievementModal(achievement);
                }
            });
        });
    }

    function openAchievementModal(achievement, isNew = false) {
        const isUnlocked = (JSON.parse(localStorage.getItem('unlockedAchievements')) || []).includes(achievement.id);

        const iconContainer = document.getElementById('modal-icon');
        const iconEl = iconContainer.querySelector('i');
        iconEl.className = `${achievement.icon} text-4xl`;

        if (isUnlocked) {
            iconContainer.className = 'w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg';
            iconEl.classList.add('text-white');
        } else {
            iconContainer.className = 'w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4 border-4 border-gray-400 shadow-lg';
            iconEl.classList.add('text-gray-400');
        }

        modalTitle.textContent = isNew ? "Achievement Unlocked!" : achievement.name;
        modalDescription.textContent = isUnlocked ? achievement.description : 'This achievement is still locked. Keep tracking your intake to unlock it!';
        achievementModal.classList.remove('hidden');
    }

    function closeAchievementModal() {
        achievementModal.classList.add('hidden');
    }

    // Modal event listeners
    modalCloseBtn.addEventListener('click', closeAchievementModal);
    achievementModal.addEventListener('click', (e) => {
        if (e.target === achievementModal) {
            closeAchievementModal();
        }
    });
});
