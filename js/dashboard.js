let salesChartInstance = null;

async function loadDashboard() {
    try {
        const res = await fetch(`${API_PATH}dashboard.php`);
        const data = await res.json();
        
        if(!data.success) return;

        // Populate Stats
        document.getElementById('dashTotalTx').textContent = data.todayStats.total_today;
        document.getElementById('dashRevenue').textContent = formatRupiah(data.todayStats.revenue_today);
        document.getElementById('dashCustomers').textContent = data.customerStats.total_customers;

        // Render Chart
        const ctx = document.getElementById('salesChart').getContext('2d');
        if(salesChartInstance) salesChartInstance.destroy();

        const labels = data.weeklySales.map(item => item.date);
        const values = data.weeklySales.map(item => item.daily_total);

        salesChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pendapatan 7 Hari Terakhir',
                    data: values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

    } catch(e) {
        console.error(e);
        showToast('Gagal memuat dashboard', 'error');
    }
}
