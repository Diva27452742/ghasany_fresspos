document.getElementById('btnExportExcel').addEventListener('click', () => {
    if(historyData.length === 0) {
        showToast('Tidak ada data untuk di-export', 'warning');
        return;
    }

    const wsData = historyData.map(h => ({
        'Tanggal': h.created_at,
        'Kode Order': h.order_code,
        'Kasir': h.kasir,
        'Pelanggan': h.customer_name || 'Umum',
        'Subtotal': parseFloat(h.subtotal),
        'Pajak': parseFloat(h.tax),
        'Total': parseFloat(h.total),
        'Metode': h.payment_method
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat_Transaksi");
    
    XLSX.writeFile(wb, `Laporan_Transaksi_FreshPOS_${new Date().toISOString().slice(0,10)}.xlsx`);
});

document.getElementById('btnExportPDF').addEventListener('click', () => {
    if(historyData.length === 0) {
        showToast('Tidak ada data untuk di-export', 'warning');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Laporan Transaksi FreshPOS", 14, 20);
    
    const tableColumn = ["Tanggal", "Kode Order", "Kasir", "Pelanggan", "Total"];
    const tableRows = [];

    historyData.forEach(h => {
        const row = [
            new Date(h.created_at).toLocaleDateString('id-ID'),
            h.order_code,
            h.kasir,
            h.customer_name || 'Umum',
            formatRupiah(h.total)
        ];
        tableRows.push(row);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'striped',
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`Laporan_Transaksi_FreshPOS_${new Date().toISOString().slice(0,10)}.pdf`);
});
