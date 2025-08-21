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

    // Function to update the weekly chart
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
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = logs.find(l => l.date === dateStr);
            const total = log ? log.entries.reduce((sum, entry) => sum + entry.amount, 0) : 0;
            last7DaysData.push({
                day: days[(d.getDay() + 7) % 7],
                total: total
            });
            if (total > 0) {
                weeklyTotal += total;
                daysWithIntake++;
            }
        }
        last7DaysData.reverse(); // To have the current day at the end

        const maxIntake = Math.max(...last7DaysData.map(d => d.total), dailyGoal);

        weeklyChart.innerHTML = last7DaysData.map(data => {
            const percentage = maxIntake > 0 ? (data.total / maxIntake) * 100 : 0;
            return `
                <div class="flex flex-col items-center w-1/7">
                    <div class="w-10 bg-blue-500 rounded-t-lg mb-2" style="height: ${percentage}%" title="${data.total} ml"></div>
                    <span class="text-sm text-gray-600">${data.day}</span>
                </div>
            `;
        }).join('');

        const avgIntake = daysWithIntake > 0 ? weeklyTotal / daysWithIntake : 0;
        weeklyAvg.textContent = `${(avgIntake / 1000).toFixed(1)}L`;
    }
});
