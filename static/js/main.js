// Initialize the application on DOM ready
$(document).ready(function () {
    //initializeDatabase();
    //queryCompanyDB_getAllEmployees();
    //queryCompanyDB_getAllDepartments();
    queryCompanyDB_getEmployeeById(1);
});

// Initialize the IndexedDB
function initializeDatabase() {
    const request = indexedDB.open("CompanyDB", 1);
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("companyStore")) {
            db.createObjectStore("companyStore", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("departmentStore")) {
            db.createObjectStore("departmentStore", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("employeeStore")) {
            db.createObjectStore("employeeStore", { keyPath: "id" });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        checkExistingData(db).then(function (dataExists) {
            if (dataExists) {
                console.log("Using cached data");
                loadCachedData(db);
            } else {
                console.log("Fetching data from backend...");
                fetchDataFromBackend(db);
            }
        });
    };
    request.onerror = function (event) {
        console.error("Error opening database:", event.target.error);
    };
}

// Check if data exists in the database
function checkExistingData(db) {
    const transaction = db.transaction(["companyStore"], "readonly");
    const store = transaction.objectStore("companyStore");
    return new Promise(function (resolve) {
        const request = store.count();
        request.onsuccess = function () {
            resolve(request.result > 0);
        };
        request.onerror = function () {
            resolve(false);
        };
    });
}

// Fetch data from backend and populate IndexedDB
async function fetchDataFromBackend(db) {
    try {
        const response = await fetch("/data");
        const data = await response.json();

        const transaction = db.transaction(["companyStore", "departmentStore", "employeeStore"], "readwrite");
        const companyStore = transaction.objectStore("companyStore");
        const departmentStore = transaction.objectStore("departmentStore");
        const employeeStore = transaction.objectStore("employeeStore");

        data.companies.forEach((company) => companyStore.add(company));
        data.departments.forEach((department) => departmentStore.add(department));
        data.employees.forEach((employee) => employeeStore.add(employee));

        transaction.oncomplete = () => loadCachedData(db);
    } catch (error) {
        console.error("Error fetching data from backend:", error);
    }
}

// Load cached data and display in the table
function loadCachedData(db) {
    const transaction = db.transaction(["companyStore", "departmentStore", "employeeStore"], "readonly");

    const companyStore = transaction.objectStore("companyStore");
    const departmentStore = transaction.objectStore("departmentStore");
    const employeeStore = transaction.objectStore("employeeStore");

    companyStore.getAll().onsuccess = function (event) {
        displayData("Company", event.target.result);
    };
    departmentStore.getAll().onsuccess = function (event) {
        displayData("Department", event.target.result);
    };
    employeeStore.getAll().onsuccess = function (event) {
        displayData("Employee", event.target.result);
    };
}

// Display data in the table
function displayData(type, data) {
    const $tableBody = $("#dataTable tbody");
    $tableBody.empty();
    $.each(data, function(index, employee) {
        const row = `
            <tr>
                <td>${employee.firstname}</td>
                <td>${employee.lastname}</td>
                <td>${employee.email}</td>
                <td>${employee.departmentName}</td>
                <td>${employee.companyName}</td>
            </tr>
        `;
        $tableBody.append(row);
    });
}

// Examples of how you can query an IndexedDB database

// Example 1: Retrieve all records from the "Employees" object store
function queryCompanyDB_getAllEmployees() {
    const dbRequest = indexedDB.open("CompanyDB");
    dbRequest.onsuccess = function(event) {
        const db = event.target.result;
        const tx = db.transaction("employeeStore", "readonly");
        const store = tx.objectStore("employeeStore");
        const request = store.getAll();
        request.onsuccess = function(event) {
            const employees = event.target.result;
            console.log(employees);
        };
    };
}

// Example 2: Retrieve all departments from the "departmentStore"
function queryCompanyDB_getAllDepartments() {
    const dbRequest = indexedDB.open("CompanyDB");
    dbRequest.onsuccess = function(event) {
        const db = event.target.result;
        const tx = db.transaction("departmentStore", "readonly");
        const store = tx.objectStore("departmentStore");
        const request = store.getAll();
        request.onsuccess = function(event) {
            const departments = event.target.result;
            console.log("All Departments:", departments);
        };
    };
    dbRequest.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
    };
}


// Example 3: Retrieve a specific employee by ID
function queryCompanyDB_getEmployeeById(employeeId) {
    const dbRequest = indexedDB.open("CompanyDB");
    dbRequest.onsuccess = function(event) {
        const db = event.target.result;
        const tx = db.transaction("employeeStore", "readonly");
        const store = tx.objectStore("employeeStore");
        const request = store.get(employeeId);
        request.onsuccess = function(event) {
            const employee = event.target.result;
            if (employee) {
                console.log("Employee Found:", employee);
            } else {
                console.log("No employee found with ID:", employeeId);
            }
        };
    };
    dbRequest.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
    };
}
