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

    function goToPage(currPage) {
      currentPage = currPage;
      fetchData();
    }

    // function changePage(direction) {
    //   const maxPage = Math.ceil(totalRecords / pageSize) - 1;
    //   currentPage = Math.max(0, Math.min(currentPage + direction, maxPage));
    //   fetchData();
    // }

    function updatePagination(filteredRecords) {
      pagination.innerHTML = "";
      const totalPages = Math.ceil(filteredRecords / pageSize);

      const maxVisibleButtons = 5; // Maksimal 5 tombol halaman
      let startPage = Math.max(
        0,
        currentPage - Math.floor(maxVisibleButtons / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisibleButtons);

      // Adjust startPage jika terlalu dekat dengan akhir
      if (endPage - startPage < maxVisibleButtons) {
        startPage = Math.max(0, endPage - maxVisibleButtons);
      }

      // Tombol Previous
      const prevLi = document.createElement("li");
      prevLi.className = `page-item ${currentPage === 0 ? "disabled" : ""}`;
      const prevA = document.createElement("a");
      prevA.className = "page-link";
      prevA.textContent = "Previous";
      prevA.href = "#";
      prevA.onclick = (event) => {
        event.preventDefault();
        if (currentPage > 0) {
          currentPage--;
          goToPage(currentPage);
          // fetchData();
        }
      };
      prevLi.appendChild(prevA);
      pagination.appendChild(prevLi);

      // Tombol First
      const firstLi = document.createElement("li");
      firstLi.className = `page-item ${currentPage === 0 ? "disabled" : ""}`;
      const firstA = document.createElement("a");
      firstA.className = "page-link";
      firstA.textContent = "1";
      firstA.href = "#";
      firstA.onclick = (event) => {
        event.preventDefault();
        if (currentPage > 0) {
          currentPage = 0; // Pindah ke halaman pertama
          goToPage(currentPage);
          fetchData();
        }
      };
      if (currentPage > 2) {
        firstLi.appendChild(firstA);
        pagination.appendChild(firstLi);
      }

      // Elipsis sebelum halaman pertama yang ditampilkan
      if (startPage > 1) {
        const ellipsisLi = document.createElement("li");
        ellipsisLi.className = "page-item disabled";
        const ellipsisSpan = document.createElement("span");
        ellipsisSpan.className = "page-link";
        ellipsisSpan.textContent = "...";
        ellipsisLi.appendChild(ellipsisSpan);
        pagination.appendChild(ellipsisLi);
      }
      // Tombol Halaman
      for (let i = startPage; i < endPage; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        const a = document.createElement("a");
        a.className = "page-link";
        a.textContent = i + 1;
        a.href = "#";
        a.onclick = (event) => {
          event.preventDefault();
          currentPage = i; // Pastikan currentPage diubah sesuai halaman
          // currentPage = Math.max(0, currentPage); // Hindari nilai negatif
          // const start = currentPage * pageSize;
          goToPage(i);
          // fetchData();
        };
        li.appendChild(a);
        pagination.appendChild(li);
      }

      // Elipsis setelah halaman terakhir yang ditampilkan
      if (endPage < totalPages) {
        const ellipsisLi = document.createElement("li");
        ellipsisLi.className = "page-item disabled";
        const ellipsisSpan = document.createElement("span");
        ellipsisSpan.className = "page-link";
        ellipsisSpan.textContent = "...";
        ellipsisLi.appendChild(ellipsisSpan);
        pagination.appendChild(ellipsisLi);
      }

      // Tombol Last
      const lastLi = document.createElement("li");
      lastLi.className = `page-item ${
        currentPage === totalPages - 1 ? "disabled" : ""
      }`;
      const lastA = document.createElement("a");
      lastA.className = "page-link";
      lastA.textContent = totalPages;
      lastA.href = "#";
      lastA.onclick = (event) => {
        event.preventDefault();
        if (currentPage < totalPages - 1) {
          currentPage = totalPages - 1; // Pindah ke halaman terakhir
          goToPage(currentPage);
          fetchData();
        }
      };
      if (currentPage < totalPages - 3) {
        lastLi.appendChild(lastA);
        pagination.appendChild(lastLi);
      }

      // Tombol Next
      const nextLi = document.createElement("li");
      nextLi.className = `page-item ${
        currentPage === totalPages - 1 ? "disabled" : ""
      }`;
      const nextA = document.createElement("a");
      nextA.className = "page-link";
      nextA.textContent = "Next";
      nextA.href = "#";
      nextA.onclick = (event) => {
        event.preventDefault();
        if (currentPage < totalPages - 1) {
          currentPage++;
          goToPage(currentPage);
          // fetchData();
        }
      };
      nextLi.appendChild(nextA);
      pagination.appendChild(nextLi);

      // for (let i = 0; i < totalPages; i++) {
      //     const li = document.createElement('li');
      //     li.className = 'page-item' + (i === currentPage ? ' active' : '');
      //     const a = document.createElement('a');
      //     a.className = 'page-link';
      //     a.href = '#';
      //     a.textContent = i + 1;
      //     a.addEventListener('click', (e) => {
      //         e.preventDefault();
      //         currentPage = i;
      //         fetchData();
      //     });
      //     li.appendChild(a);
      //     pagination.appendChild(li);
      // }
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
