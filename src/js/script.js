// Initialize app
document.addEventListener('DOMContentLoaded', function() {
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

    // Get today's log
    let todayLog = logs.find(log => log.date === todayStr);
    if (!todayLog) {
        todayLog = { date: todayStr, entries: [] };
        logs.push(todayLog);
    }

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
        exportDataToJson(logs);
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

    // Function to update UI
    function updateUI() {
        // Calculate daily total
        const dailyTotal = todayLog.entries.reduce((sum, entry) => sum + entry.amount, 0);
        document.getElementById('daily-total').textContent = dailyTotal;

        // Update progress bar
        const percentage = Math.min((dailyTotal / dailyGoal) * 100, 100);
        document.getElementById('water-level').style.width = `${percentage}%`;
        document.getElementById('progress-percentage').textContent = `${Math.round(percentage)}%`;

        // Update weekly chart
        updateWeeklyChart();

        // Update stats overview, which includes weekly total, best streak, and current streak.
        updateStatsOverview();

        // Update entries list
        const entriesContainer = document.getElementById('entries-container');
        if (todayLog.entries.length === 0) {
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
                    <div class="entry-item bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                <i class="fas fa-tint text-white"></i>
                            </div>
                            <div>
                                <p class="font-bold text-gray-800">${entry.amount} ml</p>
                                <p class="text-sm text-gray-500">${timeString}</p>
                            </div>
                        </div>
                        <button class="delete-entry text-red-500 hover:text-red-700" data-timestamp="${entry.timestamp}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            }).join('');

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-entry').forEach(button => {
                button.addEventListener('click', function() {
                    const timestamp = parseInt(this.getAttribute('data-timestamp'));
                    deleteEntry(timestamp);
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
        todayLog = logForToday; // Keep the global reference up to date.

        // If the last entry is gone, remove the entire log for today.
        if (logForToday.entries.length === 0) {
            logs = logs.filter(log => log.date !== todayStr);
        }

        // Save to localStorage and update the UI.
        localStorage.setItem('waterTrackerData', JSON.stringify(logs));
        updateUI();
    }

    // Function to export data
    function exportDataToJson(data) {
        if (!data || data.length === 0) {
            alert("No data to export.");
            return;
        }

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
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
                // Basic validation: check if it's an array and has the expected structure
                if (Array.isArray(importedData) && importedData.every(log => 'date' in log && 'entries' in log)) {
                    localStorage.setItem('waterTrackerData', JSON.stringify(importedData));
                    alert("Data imported successfully! The page will now reload to apply the changes.");
                    location.reload();
                } else {
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
            let streakDate = new Date(); // Start from today

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
});
