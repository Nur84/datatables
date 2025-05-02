
# datatable_helper.js

`datatable_helper.js` is a lightweight JavaScript library designed to create **DataTables** without relying on **jQuery**. This library supports **pagination**, **search**, **custom filters**, and **data export** to **CSV**, **Excel**, and **PDF**, using data retrieved via **AJAX**.

---

## 📦 Features

- No jQuery dependency
- Dynamic pagination
- Search input
- Custom filters
- Export to CSV, Excel, and PDF
- Custom action columns
- Simple API data structure

---

## ⚙️ AJAX Response Data Format

This library requires a JSON-formatted response as shown below:

```json
{
  "recordsTotal": 9,
  "recordsFiltered": 1,
  "start": 0,
  "data": [
    // array of row data
  ]
}
```

---

## 🚀 How to Use

### 1. Include the Script

Ensure you include `datatable_helper.js` in your HTML file:

```html
<script src="js/datatable_helper.js"></script>
```

To enable export functionality for Excel and PDF, optionally include the following scripts:

```html
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
```

### 2. Prepare HTML Elements

Create the following elements in your HTML:

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

<!-- Optional custom filter -->
<select id="idElementFilter">
  ...
</select>
```

### 3. Initialization

Use the `initDataTable()` function with a configuration object as follows:

```javascript
initDataTable({
  tableId: "#dataTable",
  paginationId: "#pagination",
  searchInputId: "#searchInput",
  infoRowRangeId: "#infoRowRange",
  infoFilteredId: "#infoRowRange", // may use the same or a different element
  pageSizeSelectId: "#pageSizeSelect",
  exportCSVButtonId: "#exportCsvBtn",
  exportExcelButtonId: "#exportExcelBtn",
  exportPDFButtonId: "#exportPdfBtn",
  apiUrl: "./data.json",
  hasAction: true,
  customFilters: ["#idElementFilter"],
  actionButtons: (item) => {
    return `<button class="btn btn-primary btn-sm" onclick="actionKlick()">Edit</button>`;
  },
});
```

---

## 🧩 Configuration Options

| Option                | Type       | Description                                                           |
|----------------------|------------|-----------------------------------------------------------------------|
| `tableId`            | `string`   | ID of the `<table>` element                                           |
| `paginationId`       | `string`   | ID of the pagination element                                          |
| `searchInputId`      | `string`   | ID of the search input                                                |
| `infoRowRangeId`     | `string`   | ID for displaying total row count information                         |
| `infoFilteredId`     | `string`   | ID for displaying filtered result info (can be same as `infoRowRangeId`) |
| `pageSizeSelectId`   | `string`   | ID of the `<select>` element for items per page                       |
| `exportCSVButtonId`  | `string`   | ID of the CSV export button                                           |
| `exportExcelButtonId`| `string`   | ID of the Excel export button                                         |
| `exportPDFButtonId`  | `string`   | ID of the PDF export button                                           |
| `apiUrl`             | `string`   | URL to fetch JSON data                                                |
| `hasAction`          | `boolean`  | Adds an action column                                                 |
| `customFilters`      | `string[]` | IDs of additional filters (optional)                                  |
| `actionButtons`      | `function` | Function that returns HTML content for action buttons                 |

---

## 📁 Folder Structure (Optional)

```text
📁 js/
  └── datatable_helper.js
📄 index.html
📄 data.json (API simulation)
```

---

## 📄 License

Free to use, modify, and further develop. ❤️

---

## 🙌 Contributor

- [Nurdiansah](https://github.com/Nur84)
