
# datatable_helper.js

`datatable_helper.js` adalah library JavaScript ringan untuk membuat **DataTable** tanpa ketergantungan pada **jQuery**. Library ini mendukung **paginasi**, **pencarian**, **filter kustom**, serta **ekspor data** ke **CSV**, **Excel**, dan **PDF**, menggunakan data yang didapatkan via **AJAX**.

---

## 📦 Fitur

- Tanpa jQuery
- Paginasi dinamis
- Input pencarian
- Filter kustom
- Ekspor ke CSV, Excel, dan PDF
- Kolom aksi kustom
- Struktur data API sederhana

---

## ⚙️ Format Response Data AJAX

Library ini membutuhkan response dengan format JSON seperti berikut:

```json
{
  "recordsTotal": 9,
  "recordsFiltered": 1,
  "start": 0,
  "data": [
    // array data baris
  ]
}
```

---

## 🚀 Cara Menggunakan

### 1. Sertakan Script
Pastikan Anda sudah menyertakan `datatable_helper.js` di HTML Anda:

```html
<script src="js/datatable_helper.js"></script>
```

### 2. Siapkan Elemen HTML

Buat elemen-elemen berikut di HTML:

```html
<table id="dataTable"></table>
<div id="pagination"></div>
<input type="text" id="searchInput" />
<div id="infoRowRange"></div>
<select id="pageSizeSelect">
  <option value="10">10</option>
  <option value="25">25</option>
  <option value="50">50</option>
</select>
<button id="exportCsvBtn">Export CSV</button>
<button id="exportExcelBtn">Export Excel</button>
<button id="exportPdfBtn">Export PDF</button>

<!-- Filter kustom (opsional) -->
<select id="idElementFilter">...</select>
```

### 3. Inisialisasi

Gunakan fungsi `initDataTable()` dengan konfigurasi seperti berikut:

```javascript
initDataTable({ 
  tableId: '#dataTable',
  paginationId: '#pagination',
  searchInputId: '#searchInput',
  infoRowRangeId: '#infoRowRange',
  infoFilteredId: '#infoRowRange', // gunakan elemen yang sama atau berbeda
  pageSizeSelectId: '#pageSizeSelect',
  exportCSVButtonId: '#exportCsvBtn',
  exportExcelButtonId: '#exportExcelBtn',
  exportPDFButtonId: '#exportPdfBtn',
  apiUrl: './data.json',
  hasAction: true,
  customFilters: [
    '#idElementFilter'
  ],
  actionButtons: (item) => {
    return `<button class="btn btn-primary btn-sm" onclick="actionKlick()">Edit</button>`;
  }
});
```

---

## 🧩 Opsi Konfigurasi

| Opsi                 | Tipe       | Deskripsi |
|----------------------|------------|-----------|
| `tableId`            | `string`   | ID dari elemen `<table>` |
| `paginationId`       | `string`   | ID elemen untuk pagination |
| `searchInputId`      | `string`   | ID input pencarian |
| `infoRowRangeId`     | `string`   | ID untuk menampilkan info jumlah data |
| `infoFilteredId`     | `string`   | ID untuk info hasil pencarian (bisa sama dengan `infoRowRangeId`) |
| `pageSizeSelectId`   | `string`   | ID `<select>` jumlah item per halaman |
| `exportCSVButtonId`  | `string`   | ID tombol ekspor CSV |
| `exportExcelButtonId`| `string`   | ID tombol ekspor Excel |
| `exportPDFButtonId`  | `string`   | ID tombol ekspor PDF |
| `apiUrl`             | `string`   | URL untuk fetch data JSON |
| `hasAction`          | `boolean`  | Tambahkan kolom aksi |
| `customFilters`      | `string[]` | ID filter tambahan (opsional) |
| `actionButtons`      | `function` | Fungsi yang mengembalikan HTML tombol aksi |

---

## 📁 Struktur Folder (Opsional)

```text
📁 js/
  └── datatable_helper.js
📄 index.html
📄 data.json (simulasi API)
```

---

## 📄 Lisensi

Lisensi bebas digunakan, dimodifikasi, dan dikembangkan lebih lanjut. ❤️

---

## 🙌 Kontributor

- [Nurdiansah](https://github.com/Nur84)
