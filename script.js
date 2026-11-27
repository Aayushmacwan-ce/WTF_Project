let reports = [
    {
        id: 1,
        name: "Blue Water Bottle",
        type: "Lost",
        category: "Personal Belongings",
        location: "College Library",
        date: "2026-11-18",
        description: "A blue bottle with a black cap.",
        contact: "",
        recovered: false
    },
    {
        id: 2,
        name: "Wireless Earphones Case",
        type: "Found",
        category: "Electronics",
        location: "Canteen",
        date: "2026-11-19",
        description: "A white earphone charging case was found on a table.",
        contact: "",
        recovered: false
    },
    {
        id: 3,
        name: "Engineering Notebook",
        type: "Lost",
        category: "Stationery",
        location: "Block A, Room 204",
        date: "2026-11-17",
        description: "A brown notebook with handwritten notes inside.",
        contact: "",
        recovered: true
    }
];

const reportForm = document.getElementById("reportForm");
const itemsContainer = document.getElementById("itemsContainer");
const emptyMessage = document.getElementById("emptyMessage");
const formMessage = document.getElementById("formMessage");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const resetFiltersButton = document.getElementById("resetFilters");

displayReports(reports);
updateCounts();

document.getElementById("itemDate").max = new Date().toISOString().split("T")[0];

reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const type = document.getElementById("reportType").value;
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value.trim();
    const date = document.getElementById("itemDate").value;
    const description = document.getElementById("description").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (name === "" || type === "" || category === "" || location === "" || date === "" || description === "") {
        showFormMessage("Please complete all required fields.", "error");
        return;
    }

    if (date > new Date().toISOString().split("T")[0]) {
        showFormMessage("Date cannot be in the future.", "error");
        return;
    }

    const newReport = {
        id: Date.now(),
        name: name,
        type: type,
        category: category,
        location: location,
        date: date,
        description: description,
        contact: contact,
        recovered: false
    };

    reports.unshift(newReport);
    displayReports(getFilteredReports());
    updateCounts();
    reportForm.reset();
    document.getElementById("itemDate").max = new Date().toISOString().split("T")[0];
    showFormMessage("Your report has been added successfully.", "success");
});

function showFormMessage(message, className) {
    formMessage.textContent = message;
    formMessage.className = "form-message " + className;
}

function displayReports(reportList) {
    itemsContainer.innerHTML = "";

    if (reportList.length === 0) {
        emptyMessage.hidden = false;
        return;
    }

    emptyMessage.hidden = true;

    for (let i = 0; i < reportList.length; i++) {
        const report = reportList[i];

        const card = document.createElement("article");
        card.className = "item-card";

        const typeClass = report.type === "Lost" ? "type-lost" : "type-found";
        const statusText = report.recovered ? "Recovered" : "Not Recovered";
        const statusClass = report.recovered ? "status-recovered" : "status-open";

        // Use textContent for user-entered text so it is displayed as text.
        const topRow = document.createElement("div");
        topRow.className = "card-top";

        const typeBadge = document.createElement("span");
        typeBadge.className = "type-label " + typeClass;
        typeBadge.textContent = report.type;

        const statusBadge = document.createElement("span");
        statusBadge.className = "status-label " + statusClass;
        statusBadge.textContent = statusText;

        topRow.appendChild(typeBadge);
        topRow.appendChild(statusBadge);

        const heading = document.createElement("h3");
        heading.textContent = report.name;

        const meta = document.createElement("div");
        meta.className = "item-meta";

        const categoryLine = document.createElement("span");
        categoryLine.textContent = "Category: " + report.category;

        const locationLine = document.createElement("span");
        locationLine.textContent = "Location: " + report.location;

        const dateLine = document.createElement("span");
        dateLine.textContent = "Date: " + report.date;

        meta.appendChild(categoryLine);
        meta.appendChild(locationLine);
        meta.appendChild(dateLine);

        const description = document.createElement("p");
        description.className = "item-description";
        description.textContent = report.description;

        card.appendChild(topRow);
        card.appendChild(heading);
        card.appendChild(meta);
        card.appendChild(description);

        if (report.contact !== "") {
            const contact = document.createElement("p");
            contact.className = "item-contact";
            contact.textContent = "Contact: " + report.contact;
            card.appendChild(contact);
        }

        const actions = document.createElement("div");
        actions.className = "card-actions";

        if (!report.recovered) {
            const recoverButton = document.createElement("button");
            recoverButton.type = "button";
            recoverButton.className = "button small-button recover-button";
            recoverButton.textContent = "Mark Recovered";
            recoverButton.addEventListener("click", function () {
                markRecovered(report.id);
            });
            actions.appendChild(recoverButton);
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "button small-button delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteReport(report.id);
        });
        actions.appendChild(deleteButton);

        card.appendChild(actions);
        itemsContainer.appendChild(card);
    }
}

function getFilteredReports() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;
    const selectedCategory = categoryFilter.value;

    return reports.filter(function (report) {
        const matchesSearch =
            report.name.toLowerCase().includes(searchText) ||
            report.location.toLowerCase().includes(searchText);

        const matchesType = selectedType === "All" || report.type === selectedType;
        const matchesCategory = selectedCategory === "All" || report.category === selectedCategory;

        return matchesSearch && matchesType && matchesCategory;
    });
}

searchInput.addEventListener("input", function () {
    displayReports(getFilteredReports());
});

typeFilter.addEventListener("change", function () {
    displayReports(getFilteredReports());
});

categoryFilter.addEventListener("change", function () {
    displayReports(getFilteredReports());
});

resetFiltersButton.addEventListener("click", function () {
    searchInput.value = "";
    typeFilter.value = "All";
    categoryFilter.value = "All";
    displayReports(reports);
});

function markRecovered(reportId) {
    for (let i = 0; i < reports.length; i++) {
        if (reports[i].id === reportId) {
            reports[i].recovered = true;
            break;
        }
    }

    displayReports(getFilteredReports());
    updateCounts();
}

function deleteReport(reportId) {
    reports = reports.filter(function (report) {
        return report.id !== reportId;
    });

    displayReports(getFilteredReports());
    updateCounts();
}

function updateCounts() {
    let lost = 0;
    let found = 0;
    let recovered = 0;

    for (let i = 0; i < reports.length; i++) {
        if (reports[i].type === "Lost") {
            lost++;
        } else if (reports[i].type === "Found") {
            found++;
        }

        if (reports[i].recovered) {
            recovered++;
        }
    }

    document.getElementById("totalCount").textContent = reports.length;
    document.getElementById("lostCount").textContent = lost;
    document.getElementById("foundCount").textContent = found;
    document.getElementById("recoveredCount").textContent = recovered;
}
