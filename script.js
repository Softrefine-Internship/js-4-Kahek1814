//--------storage and object creation region
//-----Starter id
let starterID = localStorage.getItem("id") ?? (localStorage.setItem("id", 0), "0");
//-----Payment method
const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Bank Transfer",
    "Wallet (Paytm, PhonePe, etc.)",
    "Cheque",
    "Crypto",
    "Other"
];

//-----catagory dropDown data
const expenseCategories = [
    "Rent / Mortgage",
    "Utilities",
    "Groceries",
    "Transportation",
    "Insurance",
    "Medical / Healthcare",
    "Dining Out / Food Delivery",
    "Shopping",
    "Subscriptions",
    "Gym / Fitness / Sports",
    "Personal Care",
    "Courses / Learning",
    "Books & Study Materials",
    "Software / Tools",
    "Work-related Expenses",
    "Movies / Events",
    "Travel / Vacations",
    "Hobbies",
    "Gifts",
    "Investments",
    "Savings / Emergency Fund",
    "Loan Payments / Credit Card Bills",
    "Taxes",
    "Childcare / School Fees",
    "Pet Expenses",
    "Donations / Charity",
    "Miscellaneous"
];
//-----filler object fro every entry
let expenseObject = {
    id: "",
    description: "",
    amount: 0,
    currentDate: "",
    modifiedDate: "",
    category: "",
    paymentMethod: ""
}
//-----expense list (persistant data)
let expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];
//--------end of region


//--------Test area
// let currentInfo;
// fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata").then(res => res.json()).then(res => console.log(res))


// Filling the dropdown
// Adding Data to the catagory dropdown

const catagoryDropDown = document.querySelector(".categoryDropDown")
// Getting Text Value in text feild
let innerHmtlforCatagory = ""
expenseCategories.forEach((item, index) => {
    innerHmtlforCatagory += `<option value=${index}>${item}</option>`
})
catagoryDropDown.innerHTML += innerHmtlforCatagory
// End Adding Data to the catagory dropdown

// Adding Data to the Payment dropdown
const paymentmethodDropDown = document.querySelector(".paymentmethod")
// Getting Text value in text feild
let innerHmtlforPayment = "";
paymentMethods.forEach((item, index) => {
    innerHmtlforPayment += `<option value=${index}>${item}</option>`
})
paymentmethodDropDown.innerHTML += innerHmtlforPayment

// Filling the dropdown


// ------------------------------------------------------------------

// Handle Form Submit

const form = document.querySelector(".Form")

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Setting Up Date
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');     // 01–31
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 01–12
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    // End Setting up Date
    // Gettin all the Data From The Form
    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData.entries());



    if (data.id === '') {
        if (!displayError(data)) {
            // Setting Up ID 
            starterID++;
            expenseObject.id = starterID;
            localStorage.setItem('id', starterID)
            // Setting Up Description
            expenseObject.description = data.description;
            // Setting Up AMount
            expenseObject.amount = data.amount;
            // Setting Up Date
            expenseObject.currentDate = formattedDate
            //Setting Up Catagory
            expenseObject.category = data.category
            //Setting Up PriceMetho
            expenseObject.paymentMethod = data.paymentMethod

            expenseList.push(expenseObject)
            localStorage.setItem('expenseList', JSON.stringify(expenseList))
            renderTable();
            form.reset()
            expenseObject = {
                id: "",
                description: "",
                amount: 0,
                currentDate: "",
                modifiedDate: "",
                category: "",
                paymentMethod: ""
            }
            // 
            // 
            // 
            // Re Rendring Code Of Table
            // 
            // 
            // 

            // Resetting form

        }
    }
    else {
        if (!displayError(data)) {
            // Find the expense by ID
            const index = expenseList.findIndex(exp => exp.id == data.id);
            if (index !== -1) {
                // Update the object while keeping the original currentDate
                expenseList[index] = {
                    ...expenseList[index], // preserve existing fields like currentDate
                    ...data,               // overwrite with new input
                    modifiedDate: formattedDate // set modified date
                };
            }

            // Reset temporary object
            expenseObject = {
                id: "",
                description: "",
                amount: 0,
                currentDate: "",
                modifiedDate: "",
                category: "",
                paymentMethod: ""
            };

            localStorage.setItem('expenseList', JSON.stringify(expenseList));
            renderTable();
            form.reset();
            document.getElementsByName('id')[0].value = '';
            document.getElementsByName('Button')[0].value = "Add Expense";
        }

    }
})

function displayError(data) {
    let error = false;
    // validation for description
    // Selecting span in descriptionError
    const descriptionErrorSpan = document.querySelector(".descriptionError");
    if (data.description === "") {
        descriptionErrorSpan.textContent = "Please Fill Out Description"
        error = true;
    }
    else if (data.description.length < 3) {
        descriptionErrorSpan.textContent = "Please Enter Valid Description"
        error = true;
    }
    else {
        descriptionErrorSpan.textContent = ""
    }
    // validation for Amount
    // Selecting span in Amount
    const numberErrorSpan = document.querySelector(".numberError");
    if (data.amount === '') {
        numberErrorSpan.textContent = "Please Fill Out Amount Feild"
        error = true;
    }
    else if (data.amount <= 0) {
        numberErrorSpan.textContent = "Please Enter Value bigger than 0"
        error = true;
    }
    else {
        numberErrorSpan.textContent = ""
    }
    // validation for Catagory
    // Selecting span in Catagory
    const catagoryErrorSpan = document.querySelector(".catagoryError");
    if (data.category === '') {
        catagoryErrorSpan.textContent = "Please Select Valid Catagory Feild"
        error = true;
    } else {
        catagoryErrorSpan.textContent = ""
    }
    // validation for Payment
    // Selecting span in Payment
    const paymentMethodErrorSpan = document.querySelector(".paymentMethodError");
    if (data.paymentMethod === '') {
        paymentMethodErrorSpan.textContent = "Please Select Valid Price Feild"
        error = true;
    } else {
        paymentMethodErrorSpan.textContent = ""
    }
    return error;
}

const table = document.querySelector(".table");
function renderTable() {
    // Sort expenseList by id descending (latest first)
    expenseList.sort((a, b) => Number(b.id) - Number(a.id));

    table.innerHTML = "";
    let inputString = `<tr>
                    <th>Date</th>
                    <th>InsertID</th>
                    <th>Description</th>
                    <th class="amountdata">Amount</th>
                    <th>Category</th>
                    <th>Payment Method</th>
                    <th>Action</th>
                </tr>`;

    expenseList.forEach((item, index) => {
        inputString += `<tr>
                            <td>${item.currentDate}</td>
                            <td>${item.id}</td>
                            <td>${item.description}</td>
                            <td>${Number(item.amount).toLocaleString('en-IN')}</td>
                            <td>${expenseCategories[item.category]}</td>
                            <td>${paymentMethods[item.paymentMethod]}</td>
                            <td>
                                <button class="edit-btn" data-index=${item.id}>Edit</button>
                                <button class="delete-btn" data-index=${item.id}>Delete</button>
                            </td>
                        </tr>`;
    });
    table.innerHTML += inputString;

    updateExpenseSummary();
}

// Delting the obejct from the list
table.addEventListener("click", (e) => {
    // handling amount sorting

    // Working on delete button
    if (e.target.classList.contains("delete-btn")) {
        if (confirm("Are You Sure!")) {
            const ids = e.target.dataset.index;
            expenseList = expenseList.filter(item => item.id != ids);
            localStorage.setItem('expenseList', JSON.stringify(expenseList))
            renderTable();
            alert("DateRow deleted succefully!")
        }
    }
    // Working on edit button
    if (e.target.classList.contains("edit-btn")) {

        const ids = e.target.dataset.index;
        console.log(ids)
        expenseList.forEach((item, index) => {
            if (item.id == ids) {
                document.getElementsByName('id')[0].value = item.id;
                document.getElementsByName('description')[0].value = item.description;
                document.getElementsByName('amount')[0].value = item.amount;
                document.getElementsByName('category')[0].value = item.category;
                document.getElementsByName('paymentMethod')[0].value = item.paymentMethod;


                // Setting up the edit object
                expenseObject.id = item.id;
                // Setting Up Description
                expenseObject.description = item.description;
                // Setting Up AMount
                expenseObject.amount = item.amount;
                // Setting Up Date
                expenseObject.currentDate = item.currentDate
                //Setting Up Catagory
                expenseObject.category = item.category
                //Setting Up PriceMetho
                expenseObject.paymentMethod = item.paymentMethod

                document.getElementsByName('Button')[0].value = "Update"
            }
        })
    }
})
// Calling render on on call
window.onload = function () {
    renderTable()
};
// Updata Info Data
function updateExpenseSummary() {
    const todayEl = document.querySelector(".today");
    const weekEl = document.querySelector(".week");
    const monthEl = document.querySelector(".month");
    const yearEl = document.querySelector(".year");
    const totalEl = document.querySelector(".total");

    const now = new Date();

    let todaySum = 0;
    let weekSum = 0;
    let monthSum = 0;
    let yearSum = 0;
    let totalSum = 0;

    expenseList.forEach(item => {
        const [day, month, year] = item.currentDate.split('-').map(Number);
        const expenseDate = new Date(year, month - 1, day); // month is 0-indexed

        totalSum += Number(item.amount);

        // Today
        if (expenseDate.toDateString() === now.toDateString()) {
            todaySum += Number(item.amount);
        }

        // This Week (week starting Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        if (expenseDate >= startOfWeek && expenseDate <= endOfWeek) {
            weekSum += Number(item.amount);
        }

        // This Month
        if (expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()) {
            monthSum += Number(item.amount);
        }

        // This Year
        if (expenseDate.getFullYear() === now.getFullYear()) {
            yearSum += Number(item.amount);
        }
    });

    // Update DOM with Indian format
    todayEl.textContent = todaySum.toLocaleString('en-IN');
    weekEl.textContent = weekSum.toLocaleString('en-IN');
    monthEl.textContent = monthSum.toLocaleString('en-IN');
    yearEl.textContent = yearSum.toLocaleString('en-IN');
    totalEl.textContent = totalSum.toLocaleString('en-IN');
}

// Call it after rendering the table or whenever expenseList changes
//------------------- searching JS Code -------------------

// Sort state for amount column
const sortState = { "Amount": 0 }; // 0: normal, 1: low->high, 2: high->low

// Create filter dropdowns above table if not already in HTML
const tableSection = document.querySelector(".expenseTable");
let filtersDiv = document.createElement("div");
filtersDiv.className = "filters";
filtersDiv.style.marginBottom = "10px";
filtersDiv.innerHTML = `
    <select id="categoryFilter">
        <option value="">All Categories</option>
    </select>
    <select id="paymentFilter">
        <option value="">All Payment Methods</option>
    </select>
    <input type="date" id="dateFilter" placeholder="Select Date">
`;
tableSection.prepend(filtersDiv);

// Populate category filter
const categoryFilter = document.getElementById("categoryFilter");
expenseCategories.forEach((item, index) => {
    categoryFilter.innerHTML += `<option value="${index}">${item}</option>`;
});

// Populate payment filter
const paymentFilter = document.getElementById("paymentFilter");
paymentMethods.forEach((item, index) => {
    paymentFilter.innerHTML += `<option value="${index}">${item}</option>`;
});

//------------------- Render Table -------------------
function renderTable() {
    let filteredList = [...expenseList];

    // Apply filters
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== "") filteredList = filteredList.filter(e => e.category === selectedCategory);

    const selectedPayment = paymentFilter.value;
    if (selectedPayment !== "") filteredList = filteredList.filter(e => e.paymentMethod === selectedPayment);

    const selectedDate = document.getElementById("dateFilter").value;
    if (selectedDate) {
        filteredList = filteredList.filter(e => {
            const [d, m, y] = e.currentDate.split("-");
            const itemDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
            return itemDate === selectedDate;
        });
    }

    // Sort by amount if requested
    if (sortState["Amount"] === 1) filteredList.sort((a, b) => Number(a.amount) - Number(b.amount));
    else if (sortState["Amount"] === 2) filteredList.sort((a, b) => Number(b.amount) - Number(a.amount));
    else filteredList.sort((a, b) => Number(b.id) - Number(a.id)); // default ID descending

    table.innerHTML = `<tr>
        <th>Date</th>
        <th>InsertID</th>
        <th>Description</th>
        <th class="amountdata">Amount</th>
        <th>Category</th>
        <th>Payment Method</th>
        <th>Action</th>
    </tr>`;

    filteredList.forEach(item => {
        table.innerHTML += `<tr>
            <td>${item.currentDate}</td>
            <td>${item.id}</td>
            <td>${item.description}</td>
            <td>${Number(item.amount).toLocaleString('en-IN')}</td>
            <td>${expenseCategories[item.category]}</td>
            <td>${paymentMethods[item.paymentMethod]}</td>
            <td>
                <button class="edit-btn" data-index=${item.id}>Edit</button>
                <button class="delete-btn" data-index=${item.id}>Delete</button>
            </td>
        </tr>`;
    });

    updateExpenseSummary();
}

//------------------- Filter Events -------------------
categoryFilter.addEventListener("change", renderTable);
paymentFilter.addEventListener("change", renderTable);
document.getElementById("dateFilter").addEventListener("change", renderTable);

//------------------- Amount Click Sorting -------------------
table.addEventListener("click", e => {
    if (e.target.classList.contains("amountdata") || e.target.tagName === "TH" && e.target.textContent.trim() === "Amount") {
        sortState["Amount"] = (sortState["Amount"] + 1) % 3; // cycle 0->1->2->0
        renderTable();
    }
});

//------------------- Delete/Edit buttons -------------------
table.addEventListener("click", e => {
    if (e.target.classList.contains("delete-btn")) {
        if (confirm("Are you sure?")) {
            const id = e.target.dataset.index;
            expenseList = expenseList.filter(item => item.id != id);
            localStorage.setItem('expenseList', JSON.stringify(expenseList));
            renderTable();
        }
    } else if (e.target.classList.contains("edit-btn")) {
        const id = e.target.dataset.index;
        const item = expenseList.find(i => i.id == id);
        if (item) {
            document.getElementsByName('id')[0].value = item.id;
            document.getElementsByName('description')[0].value = item.description;
            document.getElementsByName('amount')[0].value = item.amount;
            document.getElementsByName('category')[0].value = item.category;
            document.getElementsByName('paymentMethod')[0].value = item.paymentMethod;
            document.getElementsByName('Button')[0].value = "Update";
            expenseObject = { ...item };
        }
    }
}); // Pagination variables
let currentPage = 1;
const rowsPerPage = 5; // Number of rows per page

// Updated renderTable with pagination
function renderTable() {
    let filteredList = [...expenseList];

    // Apply filters
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== "") filteredList = filteredList.filter(e => e.category === selectedCategory);

    const selectedPayment = paymentFilter.value;
    if (selectedPayment !== "") filteredList = filteredList.filter(e => e.paymentMethod === selectedPayment);

    const selectedDate = document.getElementById("dateFilter").value;
    if (selectedDate) {
        filteredList = filteredList.filter(e => {
            const [d, m, y] = e.currentDate.split("-");
            const itemDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
            return itemDate === selectedDate;
        });
    }

    // Sort by amount if requested
    if (sortState["Amount"] === 1) filteredList.sort((a, b) => Number(a.amount) - Number(b.amount));
    else if (sortState["Amount"] === 2) filteredList.sort((a, b) => Number(b.amount) - Number(a.amount));
    else filteredList.sort((a, b) => Number(b.id) - Number(a.id)); // default ID descending

    // Pagination calculations
    const totalPages = Math.ceil(filteredList.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1; // reset if page exceeds

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList.slice(start, start + rowsPerPage);

    // Render table header
    table.innerHTML = `<tr>
        <th>Date</th>
        <th>InsertID</th>
        <th>Description</th>
        <th class="amountdata">Amount</th>
        <th>Category</th>
        <th>Payment Method</th>
        <th>Action</th>
    </tr>`;

    // Render paginated rows
    paginatedList.forEach(item => {
        table.innerHTML += `<tr>
            <td>${item.currentDate}</td>
            <td>${item.id}</td>
            <td>${item.description}</td>
            <td>${Number(item.amount).toLocaleString('en-IN')}</td>
            <td>${expenseCategories[item.category]}</td>
            <td>${paymentMethods[item.paymentMethod]}</td>
            <td>
                <button class="edit-btn" data-index=${item.id}>Edit</button>
                <button class="delete-btn" data-index=${item.id}>Delete</button>
            </td>
        </tr>`;
    });

    // Update expense summary
    updateExpenseSummary();

    // Render pagination
    renderPagination(totalPages);
}

// Pagination rendering
function renderPagination(totalPages) {
    let paginationDiv = document.querySelector(".pagination");
    if (!paginationDiv) {
        paginationDiv = document.createElement("div");
        paginationDiv.className = "pagination";
        paginationDiv.style.textAlign = "center";
        paginationDiv.style.marginTop = "10px";
        tableSection.appendChild(paginationDiv);
    }

    paginationDiv.innerHTML = "";

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    paginationDiv.appendChild(prevBtn);

    // Current page / total pages display
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `  Page ${currentPage}  of  ${totalPages}  `;
    pageInfo.style.margin = "0 5px";
    paginationDiv.appendChild(pageInfo);

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    paginationDiv.appendChild(nextBtn);
}
