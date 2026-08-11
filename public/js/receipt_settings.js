/**
 * FreshPOS – receipt_settings.js
 * Logika Pengaturan Struk Belanja (Nama Toko, Alamat, No. Telp, Header & Footer Struk)
 */

const RECEIPT_SETTINGS_KEY = 'freshpos_receipt_settings';

const btnOpenReceiptSettings  = document.getElementById('btnOpenReceiptSettings');
const btnCloseReceiptSettings = document.getElementById('btnCloseReceiptSettings');
const receiptSettingsModal    = document.getElementById('receiptSettingsModal');
const receiptSettingsForm     = document.getElementById('receiptSettingsForm');

const settingStoreNameInput    = document.getElementById('settingStoreName');
const settingStoreAddressInput = document.getElementById('settingStoreAddress');
const settingStorePhoneInput   = document.getElementById('settingStorePhone');
const settingHeaderTitleInput  = document.getElementById('settingHeaderTitle');
const settingFooterMsgInput    = document.getElementById('settingFooterMsg');

// Default Settings
const defaultReceiptSettings = {
    storeName: 'FreshPOS Cafe & Resto',
    storeAddress: 'Jl. Merdeka No. 123, Indonesia',
    storePhone: '0812-3456-7890',
    headerTitle: 'Struk Pembayaran',
    footerMsg: 'Terima Kasih Atas Kunjungan Anda!'
};

function getReceiptSettings() {
    const saved = localStorage.getItem(RECEIPT_SETTINGS_KEY);
    return saved ? { ...defaultReceiptSettings, ...JSON.parse(saved) } : defaultReceiptSettings;
}

function loadReceiptSettingsToForm() {
    const settings = getReceiptSettings();
    if (settingStoreNameInput)    settingStoreNameInput.value    = settings.storeName;
    if (settingStoreAddressInput) settingStoreAddressInput.value = settings.storeAddress;
    if (settingStorePhoneInput)   settingStorePhoneInput.value   = settings.storePhone;
    if (settingHeaderTitleInput)  settingHeaderTitleInput.value  = settings.headerTitle;
    if (settingFooterMsgInput)    settingFooterMsgInput.value    = settings.footerMsg;
}

function applyReceiptSettingsToModal() {
    const settings = getReceiptSettings();
    const receiptHeader = document.querySelector('.receipt-header');
    const receiptFooter = document.querySelector('.receipt-footer p');

    if (receiptHeader) {
        const h2 = receiptHeader.querySelector('h2');
        const pSub = receiptHeader.querySelector('p');
        if (h2) h2.textContent = settings.storeName;
        if (pSub) pSub.textContent = settings.headerTitle;

        // Ensure sub-info for address & phone if element exists or insert
        let infoEl = receiptHeader.querySelector('.receipt-store-info');
        if (!infoEl) {
            infoEl = document.createElement('p');
            infoEl.className = 'receipt-store-info';
            infoEl.style.fontSize = '0.78rem';
            infoEl.style.color = '#64748b';
            infoEl.style.marginTop = '2px';
            receiptHeader.insertBefore(infoEl, receiptHeader.querySelector('#receiptDate'));
        }
        infoEl.textContent = `${settings.storeAddress} | Telp: ${settings.storePhone}`;
    }

    if (receiptFooter) {
        receiptFooter.textContent = settings.footerMsg;
    }
}

if (btnOpenReceiptSettings) {
    btnOpenReceiptSettings.addEventListener('click', () => {
        loadReceiptSettingsToForm();
        if (receiptSettingsModal) receiptSettingsModal.classList.add('show');
    });
}

if (btnCloseReceiptSettings) {
    btnCloseReceiptSettings.addEventListener('click', () => {
        if (receiptSettingsModal) receiptSettingsModal.classList.remove('show');
    });
}

if (receiptSettingsForm) {
    receiptSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = {
            storeName: settingStoreNameInput.value.trim() || defaultReceiptSettings.storeName,
            storeAddress: settingStoreAddressInput.value.trim() || defaultReceiptSettings.storeAddress,
            storePhone: settingStorePhoneInput.value.trim() || defaultReceiptSettings.storePhone,
            headerTitle: settingHeaderTitleInput.value.trim() || defaultReceiptSettings.headerTitle,
            footerMsg: settingFooterMsgInput.value.trim() || defaultReceiptSettings.footerMsg
        };

        localStorage.setItem(RECEIPT_SETTINGS_KEY, JSON.stringify(settings));
        applyReceiptSettingsToModal();
        alert('Pengaturan Struk Belanja berhasil disimpan!');
        if (receiptSettingsModal) receiptSettingsModal.classList.remove('show');
    });
}

if (receiptSettingsModal) {
    receiptSettingsModal.addEventListener('click', (e) => {
        if (e.target === receiptSettingsModal) {
            receiptSettingsModal.classList.remove('show');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyReceiptSettingsToModal();
});
