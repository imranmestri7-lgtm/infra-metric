// ==========================================
// InfraMetrics Dashboard
// Connects the dashboard to Spring Boot API
// ==========================================

const API_URL = "http://localhost:8080/api/reports/all";

// Store reports received from the backend.
let allReports = [];

// ==========================================
// HELPER: Get an element by its ID
// ==========================================

function getElement(id) {
    return document.getElementById(id);
}

// ==========================================
// HELPER: Safely display text in HTML
// ==========================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// HELPER: Format status
// ==========================================

function normalizeStatus(status) {
    const value = String(status ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

    if (value === "resolved" || value === "completed") {
        return "resolved";
    }

    if (
        value === "in progress" ||
        value === "inprogress" ||
        value === "processing"
    ) {
        return "in progress";
    }

    return "pending";
}

// ==========================================
// HELPER: Get status badge HTML
// ==========================================

function getStatusBadge(status) {
    const normalized = normalizeStatus(status);

    let cssClass = "status-pending";
    let label = "Pending";

    if (normalized === "in progress") {
        cssClass = "status-in-progress";
        label = "In Progress";
    } else if (normalized === "resolved") {
        cssClass = "status-resolved";
        label = "Resolved";
    }

    return `
        <span class="status-badge ${cssClass}">
            ${label}
        </span>
    `;
}

// ==========================================
// HELPER: Format date
// ==========================================

function formatDate(dateValue) {
    if (!dateValue) {
        return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// ==========================================
// UPDATE DASHBOARD STATISTICS
// ==========================================

function updateStatistics(reports) {
    const total = reports.length;

    const pending = reports.filter(
        report => normalizeStatus(report.status) === "pending"
    ).length;

    const inProgress = reports.filter(
        report => normalizeStatus(report.status) === "in progress"
    ).length;

    const resolved = reports.filter(
        report => normalizeStatus(report.status) === "resolved"
    ).length;

    if (getElement("totalReports")) {
        getElement("totalReports").textContent = total;
    }

    if (getElement("pendingReports")) {
        getElement("pendingReports").textContent = pending;
    }

    if (getElement("progressReports")) {
        getElement("progressReports").textContent = inProgress;
    }

    if (getElement("resolvedReports")) {
        getElement("resolvedReports").textContent = resolved;
    }
}

// ==========================================
// DISPLAY REPORTS IN THE TABLE
// ==========================================

function displayReports(reports) {
    const tableBody = getElement("reportsTable");

    if (!tableBody) {
        console.error(
            'Dashboard table not found. Expected element ID "reportsTable".'
        );
        return;
    }

    if (reports.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cell">
                    <i class="fa-solid fa-folder-open"></i>
                    <br><br>
                    No reports found.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = reports.map(report => {
        const reportId = escapeHTML(report.id);
        const title = escapeHTML(report.title || "Untitled Report");
        const description = escapeHTML(
            report.description || "No description provided"
        );

        const roadName = escapeHTML(
            report.road?.name ||
            report.road?.roadName ||
            report.road?.location ||
            "Road information unavailable"
        );

        const createdAt = formatDate(report.createdAt);

        return `
            <tr>
                <td>
                    <span class="report-title">${title}</span>
                    <span class="report-id">Report #${reportId}</span>
                </td>

                <td>${roadName}</td>

                <td>${createdAt}</td>

                <td>
                    ${getStatusBadge(report.status)}
                </td>

                <td>
                    <button
                        type="button"
                        class="icon-button view-report-button"
                        data-report-id="${reportId}"
                        title="View report"
                        aria-label="View report ${reportId}"
                    >
                        <i class="fa-regular fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    // Attach click handlers to the View buttons.
    tableBody.querySelectorAll(".view-report-button").forEach(button => {
        button.addEventListener("click", () => {
            const reportId = button.dataset.reportId;

            const report = allReports.find(
                item => String(item.id) === String(reportId)
            );

            if (report) {
                showReportDetails(report);
            }
        });
    });
}

// ==========================================
// VIEW REPORT DETAILS
// ==========================================

function showReportDetails(report) {
    const roadName =
        report.road?.name ||
        report.road?.roadName ||
        report.road?.location ||
        "Not available";

    const userName =
        report.user?.name ||
        report.user?.fullName ||
        report.user?.username ||
        "Not available";

    const details = [
        `Report ID: ${report.id}`,
        `Title: ${report.title || "Untitled Report"}`,
        `Road: ${roadName}`,
        `Submitted by: ${userName}`,
        `Status: ${normalizeStatus(report.status)}`,
        `Created: ${formatDate(report.createdAt)}`,
        "",
        `Description: ${report.description || "No description provided"}`
    ];

    if (report.photoUrl) {
        details.push("", `Photo URL: ${report.photoUrl}`);
    }

    window.alert(details.join("\n"));
}

// ==========================================
// SEARCH AND STATUS FILTER
// ==========================================

function filterReports() {
    const searchInput = getElement("reportSearch");
    const statusFilter = getElement("statusFilter");

    const searchText = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value.toLowerCase()
        : "all";

    const filteredReports = allReports.filter(report => {
        const title = String(report.title || "").toLowerCase();
        const description = String(report.description || "").toLowerCase();
        const roadName = String(
            report.road?.name ||
            report.road?.roadName ||
            report.road?.location ||
            ""
        ).toLowerCase();

        const id = String(report.id ?? "");

        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText) ||
            roadName.includes(searchText) ||
            id.includes(searchText);

        const normalizedStatus = normalizeStatus(report.status);

        const matchesStatus =
            selectedStatus === "all" ||
            normalizedStatus === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    displayReports(filteredReports);

    const note = getElement("tableNote");

    if (note) {
        note.textContent =
            `Showing ${filteredReports.length} of ${allReports.length} reports.`;
    }
}

// ==========================================
// FETCH REPORTS FROM SPRING BOOT
// ==========================================

async function loadReports() {
    const tableBody = getElement("reportsTable");
    const note = getElement("tableNote");

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading-cell">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Loading reports...
                </td>
            </tr>
        `;
    }

    if (note) {
        note.textContent = "Connecting to the report service...";
    }

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Server returned HTTP ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("The API did not return a report list.");
        }

        allReports = data;

        updateStatistics(allReports);
        filterReports();

        console.log("Reports loaded successfully:", allReports);

    } catch (error) {
        console.error("Could not load reports:", error);

        allReports = [];

        updateStatistics([]);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-cell">
                        Unable to load reports.
                        <br><br>
                        Check that the Spring Boot backend is running.
                    </td>
                </tr>
            `;
        }

        if (note) {
            note.textContent =
                "Could not connect to the report service. " +
                "Check the backend and browser console.";
        }
    }
}

// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = getElement("reportSearch");
    const statusFilter = getElement("statusFilter");

    if (searchInput) {
        searchInput.addEventListener("input", filterReports);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterReports);
    }

    loadReports();
});