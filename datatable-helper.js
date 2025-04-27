// datatable-helper.js (UPGRADED + EXPORT PDF & EXCEL)

function initDataTable(options) {
    const table = document.querySelector(options.tableId);
    const pagination = document.querySelector(options.paginationId);
    const searchInput = document.querySelector(options.searchInputId);
    const infoRowRange = document.querySelector(options.infoRowRangeId);
    const infoFiltered = document.querySelector(options.infoFilteredId);
    let pageSizeSelect = options.pageSizeSelectId ? document.querySelector(options.pageSizeSelectId) : null;

    let currentPage = 0;
    let pageSize = options.pageSize || 10;
    let orderColumn = 0;
    let orderDir = 'asc';
    let searchQuery = '';
    let totalRecords = 0;
    let headers = [];


    function getCustomFilters() {
        let filters = {};
        if (options.customFilters && Array.isArray(options.customFilters)) {
            options.customFilters.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    const name = element.getAttribute('name') || selector.replace('#', '');
                    filters[name] = element.value;
                }
            });
        }
        return filters;
    }
    function showLoader() {
        const loader = document.createElement('div');
        loader.id = 'datatable-loader';
        loader.style.position = 'absolute';
        loader.style.top = '0';
        loader.style.left = '0';
        loader.style.width = '100%';
        loader.style.height = '100%';
        loader.style.backgroundColor = 'rgba(255,255,255,0.7)';
        loader.style.display = 'flex';
        loader.style.justifyContent = 'center';
        loader.style.alignItems = 'center';
        loader.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
        table.parentElement.style.position = 'relative';
        table.parentElement.appendChild(loader);
    }

    function hideLoader() {
        const loader = document.getElementById('datatable-loader');
        if (loader) loader.remove();
    }

    function fetchData() {
        const url = new URL(options.apiUrl, window.location.origin);
        const params = {
            search: searchQuery,
            start: currentPage * pageSize,
            length: pageSize,
            orderColumn: orderColumn,
            orderDir: orderDir,
            ...getCustomFilters()
        };

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        showLoader();
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!headers.length) buildTableHeader(Object.keys(data.data[0] || {}));
                updateTable(data.data);
                updatePagination(data.recordsFiltered);
                totalRecords = data.recordsTotal;
                updateTableInfo(data.recordsFiltered, data.data.length, totalRecords);
            })
            .catch(error => console.error('Error fetching data:', error))
            .finally(() => hideLoader());
    }

    function buildTableHeader(keys) {
        headers = keys;
        const thead = table.querySelector('thead');
        thead.innerHTML = '';
        const row = document.createElement('tr');

        const thSelect = document.createElement('th');
        thSelect.innerHTML = '<input type="checkbox" id="selectAllRows">';
        row.appendChild(thSelect);

        keys.forEach((key, index) => {
            const th = document.createElement('th');
            th.textContent = key;
            th.style.cursor = 'pointer';
            th.addEventListener('click', () => {
                if (orderColumn === index) {
                    orderDir = orderDir === 'asc' ? 'desc' : 'asc';
                } else {
                    orderColumn = index;
                    orderDir = 'asc';
                }
                fetchData();
            });
            row.appendChild(th);
        });

        if (options.hasAction) {
            const thAction = document.createElement('th');
            thAction.textContent = 'Aksi';
            row.appendChild(thAction);
        }

        thead.appendChild(row);

        table.querySelector('#selectAllRows').addEventListener('change', function(e) {
            const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
    }

    function updateTable(data) {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        if (!data.length) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = headers.length + (options.hasAction ? 2 : 1);
            cell.textContent = 'Tidak ada data untuk ditampilkan.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            const selectCell = document.createElement('td');
            selectCell.innerHTML = '<input type="checkbox" class="rowCheckbox">';
            row.appendChild(selectCell);

            headers.forEach(key => {
                const cell = document.createElement('td');
                cell.innerHTML = /<[a-z][\s\S]*>/i.test(item[key]) ? item[key] : item[key] ?? '';
                row.appendChild(cell);
            });

            if (options.hasAction && typeof options.actionButtons === 'function') {
                const actionCell = document.createElement('td');
                actionCell.innerHTML = options.actionButtons(item);
                row.appendChild(actionCell);
            }

            tbody.appendChild(row);
        });
    }

    function updatePagination(filteredRecords) {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(filteredRecords / pageSize);

        for (let i = 0; i < totalPages; i++) {
            const li = document.createElement('li');
            li.className = 'page-item' + (i === currentPage ? ' active' : '');
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = i + 1;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                fetchData();
            });
            li.appendChild(a);
            pagination.appendChild(li);
        }
    }

    function updateTableInfo(filtered, displayed, total) {
        if (infoRowRange) {
            const start = currentPage * pageSize + 1;
            const end = Math.min((currentPage + 1) * pageSize, filtered);
            infoRowRange.textContent = `Menampilkan ${displayed} baris, baris ke ${start} sampai ${end} dari total ${total} baris`;
        }
        if (infoFiltered) {
            infoFiltered.textContent = filtered;
        }
    }

    function exportTableToCSV(filename = 'data.csv') {
        const rows = table.querySelectorAll('tr');
        let csv = [];

        rows.forEach(row => {
            const cols = row.querySelectorAll('td, th');
            let rowCsv = [];
            cols.forEach(col => rowCsv.push('"' + col.innerText.replace(/"/g, '""') + '"'));
            csv.push(rowCsv.join(','));
        });

        const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
        const downloadLink = document.createElement('a');
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function exportTableToExcel(filename = 'data.xlsx') {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, filename);
    }

    function exportTableToPDF(filename = 'data.pdf') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.autoTable({ html: table });
        doc.save(filename);
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            currentPage = 0;
            fetchData();
        });
    }

    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            pageSize = parseInt(e.target.value, 10);
            currentPage = 0;
            fetchData();
        });
    }
    
    if (options.customFilters && Array.isArray(options.customFilters)) {
        options.customFilters.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener('change', () => {
                    currentPage = 0;
                    fetchData();
                });
            }
        });
    }

    if (options.exportCSVButtonId) {
        document.querySelector(options.exportCSVButtonId).addEventListener('click', () => {
            exportTableToCSV();
        });
    }

    if (options.exportExcelButtonId) {
        document.querySelector(options.exportExcelButtonId).addEventListener('click', () => {
            exportTableToExcel();
        });
    }

    if (options.exportPDFButtonId) {
        document.querySelector(options.exportPDFButtonId).addEventListener('click', () => {
            exportTableToPDF();
        });
    }

    fetchData();
}
