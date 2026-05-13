let historyData = [];

async function loadHistory() {
    const filter = document.getElementById('historyFilter').value;
    try {
        const res = await fetch(`${API_PATH}history_api.php?filter=${filter}`);
        const data = await res.json();
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';

        if(data.success) {
            historyData = data.data;
            historyData.forEach(h => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${new Date(h.created_at).toLocaleString('id-ID')}</td>
                    <td><strong>${h.order_code}</strong></td>
                    <td>${h.kasir}</td>
                    <td>${h.customer_name || 'Umum'}</td>
                    <td style="font-weight:bold; color:var(--green-700);">${formatRupiah(h.total)}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch(e) { console.error(e); }
}

document.getElementById('historyFilter').addEventListener('change', loadHistory);
