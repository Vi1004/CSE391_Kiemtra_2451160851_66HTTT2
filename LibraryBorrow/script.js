// =====================================
// DỮ LIỆU MẪU + LOCAL STORAGE
// =====================================

// Dữ liệu mặc định nếu Local Storage chưa có dữ liệu

const defaultBorrows = [

    {
        borrowId: "PM-2048",
        borrowerName: "Nguyen Van A",
        bookId: "BK10234",
        category: "CNTT",
        borrowDate: "2025-05-01",
        returnDate: "2025-05-20",
        phone: "0912345678",
        email: "a@library.vn",
        status: "Đang mượn",
        note: "Muon giao trinh"
    },

    {
        borrowId: "PM-2049",
        borrowerName: "Tran Thi B",
        bookId: "BK12345",
        category: "Ngoại ngữ",
        borrowDate: "2025-05-10",
        returnDate: "2025-05-25",
        phone: "0987654321",
        email: "b@library.vn",
        status: "Đã trả",
        note: ""
    }

];

// Đọc dữ liệu từ Local Storage

let borrows =
    JSON.parse(
        localStorage.getItem("borrows")
    ) || defaultBorrows;

// Chỉ số bản ghi đang sửa

let editIndex = -1;

// =====================================
// KHỞI ĐỘNG TRANG
// =====================================

renderTable();

updateStatistics();

// =====================================
// LƯU LOCAL STORAGE
// =====================================

function saveData() {

    localStorage.setItem(
        "borrows",
        JSON.stringify(borrows)
    );

}

// =====================================
// MỞ FORM
// =====================================

function openForm() {

    document
        .getElementById("borrowModal")
        .style.display = "block";

}

// =====================================
// ĐÓNG FORM
// =====================================

function closeForm() {

    document
        .getElementById("borrowModal")
        .style.display = "none";

    document
        .getElementById("borrowForm")
        .reset();

    clearErrors();

    editIndex = -1;

}

// =====================================
// HIỂN THỊ BẢNG
// =====================================

function renderTable() {

    let table =
        document.getElementById(
            "borrowTable"
        );

    table.innerHTML = "";

    borrows.forEach(
        (borrow, index) => {

            table.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${borrow.borrowId}</td>

                <td>${borrow.borrowerName}</td>

                <td>${borrow.bookId}</td>

                <td>${borrow.category}</td>

                <td>${borrow.borrowDate}</td>

                <td>${borrow.returnDate}</td>

                <td>${borrow.status}</td>

                <td>

                    <button
                        class="btn-edit"
                        onclick="editBorrow(${index})">

                        Sửa

                    </button>

                    <button
                        class="btn-delete"
                        onclick="deleteBorrow(${index})">

                        Xóa

                    </button>

                </td>

            </tr>

            `;
        }
    );

}

// =====================================
// THỐNG KÊ
// =====================================

function updateStatistics() {

    document.getElementById(
        "totalBorrows"
    ).innerText =
        borrows.length;

    document.getElementById(
        "borrowingCount"
    ).innerText =
        borrows.filter(
            borrow =>
            borrow.status === "Đang mượn"
        ).length;

    document.getElementById(
        "returnedCount"
    ).innerText =
        borrows.filter(
            borrow =>
            borrow.status === "Đã trả"
        ).length;

}

// Phần 2
// =====================================
// HIỂN THỊ LỖI
// =====================================

function showError(id, message) {

    document.getElementById(id).innerText =
        message;

}

// =====================================
// XÓA TOÀN BỘ LỖI
// =====================================

function clearErrors() {

    document
        .querySelectorAll(".error")
        .forEach(error => {

            error.innerText = "";

        });

}

// =====================================
// VALIDATE FORM
// =====================================

function validateForm() {

    clearErrors();

    let isValid = true;

    // =====================
    // LẤY DỮ LIỆU
    // =====================

    let borrowId =
        document.getElementById(
            "borrowId"
        ).value.trim();

    let borrowerName =
        document.getElementById(
            "borrowerName"
        ).value.trim();

    let bookId =
        document.getElementById(
            "bookId"
        ).value.trim();

    let category =
        document.getElementById(
            "category"
        ).value;

    let borrowDate =
        document.getElementById(
            "borrowDate"
        ).value;

    let returnDate =
        document.getElementById(
            "returnDate"
        ).value;

    let phone =
        document.getElementById(
            "phone"
        ).value.trim();

    let email =
        document.getElementById(
            "email"
        ).value.trim();

    let status =
        document.getElementById(
            "status"
        ).value;

    let note =
        document.getElementById(
            "note"
        ).value.trim();

    // =====================
    // MÃ PHIẾU MƯỢN
    // =====================

    if (borrowId === "") {

        showError(
            "borrowIdError",
            "Không được để trống"
        );

        isValid = false;
    }

    else if (
        !/^PM-\d{4}$/.test(borrowId)
    ) {

        showError(
            "borrowIdError",
            "Định dạng PM-XXXX"
        );

        isValid = false;
    }

    else {

        let duplicate =
            borrows.findIndex(
                borrow =>
                    borrow.borrowId === borrowId
            );

        if (
            duplicate !== -1 &&
            duplicate !== editIndex
        ) {

            showError(
                "borrowIdError",
                "Mã phiếu đã tồn tại"
            );

            isValid = false;
        }
    }

    // =====================
    // HỌ TÊN
    // =====================

    if (borrowerName === "") {

        showError(
            "borrowerNameError",
            "Không được để trống"
        );

        isValid = false;
    }

    else if (
        borrowerName.length < 2 ||
        borrowerName.length > 40
    ) {

        showError(
            "borrowerNameError",
            "Từ 2 đến 40 ký tự"
        );

        isValid = false;
    }

    else if (
        !/^[A-Za-zÀ-ỹ\s]+$/
        .test(borrowerName)
    ) {

        showError(
            "borrowerNameError",
            "Chỉ chứa chữ và khoảng trắng"
        );

        isValid = false;
    }

    // =====================
    // MÃ SÁCH
    // =====================

    if (bookId === "") {

        showError(
            "bookIdError",
            "Không được để trống"
        );

        isValid = false;
    }

    else if (
        !/^BK\d{5}$/
        .test(bookId)
    ) {

        showError(
            "bookIdError",
            "VD: BK10234"
        );

        isValid = false;
    }

    // =====================
    // THỂ LOẠI
    // =====================

    if (category === "") {

        showError(
            "categoryError",
            "Chọn thể loại"
        );

        isValid = false;
    }

    // =====================
    // NGÀY MƯỢN
    // =====================

    let today =
        new Date()
        .toISOString()
        .split("T")[0];

    if (borrowDate === "") {

        showError(
            "borrowDateError",
            "Không được để trống"
        );

        isValid = false;
    }

    else if (
        borrowDate > today
    ) {

        showError(
            "borrowDateError",
            "Không được lớn hơn hôm nay"
        );

        isValid = false;
    }

    // =====================
    // HẠN TRẢ
    // =====================

    if (returnDate === "") {

        showError(
            "returnDateError",
            "Không được để trống"
        );

        isValid = false;
    }

    else {

        let borrow =
            new Date(borrowDate);

        let returnD =
            new Date(returnDate);

        let diffDays =
            (returnD - borrow)
            /
            (1000 * 60 * 60 * 24);

        if (
            returnD < borrow
        ) {

            showError(
                "returnDateError",
                "Phải >= ngày mượn"
            );

            isValid = false;
        }

        else if (
            diffDays > 30
        ) {

            showError(
                "returnDateError",
                "Không vượt quá 30 ngày"
            );

            isValid = false;
        }
    }

    // =====================
    // SỐ ĐIỆN THOẠI
    // =====================

    if (phone === "") {

        showError(
            "phoneError",
            "Không được để trống"
        );

        isValid = false;
    }

    else if (
        !/^(03|05|07|08|09)\d{8}$/
        .test(phone)
    ) {

        showError(
            "phoneError",
            "SĐT không hợp lệ"
        );

        isValid = false;
    }

    // =====================
    // EMAIL
    // =====================

    if (email === "") {

        showError(
            "emailError",
            "Không được để trống"
        );

        isValid = false;
    }

    else if (
        !/^[^\s@]+@library\.vn$/
        .test(email)
    ) {

        showError(
            "emailError",
            "Email phải kết thúc @library.vn"
        );

        isValid = false;
    }

    // =====================
    // TRẠNG THÁI
    // =====================

    if (status === "") {

        showError(
            "statusError",
            "Chọn trạng thái"
        );

        isValid = false;
    }

    // =====================
    // GHI CHÚ
    // =====================

    if (
        note.length > 120
    ) {

        showError(
            "noteError",
            "Tối đa 120 ký tự"
        );

        isValid = false;
    }

    if (
        /<(script|iframe|img)/i
        .test(note)
    ) {

        showError(
            "noteError",
            "Không được chứa thẻ HTML"
        );

        isValid = false;
    }

    return isValid;

}

//Phần 3
// =====================================
// SUBMIT FORM
// =====================================

document
    .getElementById("borrowForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            // Validate thất bại thì dừng

            if (!validateForm()) {

                return;

            }

            // =====================
            // TẠO OBJECT
            // =====================

            let borrow = {

                borrowId:
                    document.getElementById(
                        "borrowId"
                    ).value.trim(),

                borrowerName:
                    document.getElementById(
                        "borrowerName"
                    ).value.trim(),

                bookId:
                    document.getElementById(
                        "bookId"
                    ).value.trim(),

                category:
                    document.getElementById(
                        "category"
                    ).value,

                borrowDate:
                    document.getElementById(
                        "borrowDate"
                    ).value,

                returnDate:
                    document.getElementById(
                        "returnDate"
                    ).value,

                phone:
                    document.getElementById(
                        "phone"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "email"
                    ).value.trim(),

                status:
                    document.getElementById(
                        "status"
                    ).value,

                note:
                    document.getElementById(
                        "note"
                    ).value.trim()

            };

            // =====================
            // THÊM MỚI
            // =====================

            if (editIndex === -1) {

                borrows.push(borrow);

            }

            // =====================
            // CẬP NHẬT
            // =====================

            else {

                borrows[editIndex] =
                    borrow;

            }

            // =====================
            // LƯU DỮ LIỆU
            // =====================

            saveData();

            renderTable();

            updateStatistics();

            alert(
                "Lưu dữ liệu thành công!"
            );

            closeForm();

        }
    );

// =====================================
// ĐỔ DỮ LIỆU LÊN FORM KHI SỬA
// =====================================

function editBorrow(index) {

    editIndex = index;

    let borrow =
        borrows[index];

    document.getElementById(
        "borrowId"
    ).value =
        borrow.borrowId;

    document.getElementById(
        "borrowerName"
    ).value =
        borrow.borrowerName;

    document.getElementById(
        "bookId"
    ).value =
        borrow.bookId;

    document.getElementById(
        "category"
    ).value =
        borrow.category;

    document.getElementById(
        "borrowDate"
    ).value =
        borrow.borrowDate;

    document.getElementById(
        "returnDate"
    ).value =
        borrow.returnDate;

    document.getElementById(
        "phone"
    ).value =
        borrow.phone;

    document.getElementById(
        "email"
    ).value =
        borrow.email;

    document.getElementById(
        "status"
    ).value =
        borrow.status;

    document.getElementById(
        "note"
    ).value =
        borrow.note;

    openForm();

}

// =====================================
// XÓA PHIẾU MƯỢN
// =====================================

function deleteBorrow(index) {

    let confirmDelete =
        confirm(
            "Bạn có chắc chắn muốn xóa phiếu mượn này không?"
        );

    if (!confirmDelete) {

        return;

    }

    borrows.splice(index, 1);

    saveData();

    renderTable();

    updateStatistics();

    alert(
        "Xóa thành công!"
    );

}

// =====================================
// CLICK RA NGOÀI MODAL ĐỂ ĐÓNG
// =====================================

window.onclick =
    function (event) {

        let modal =
            document.getElementById(
                "borrowModal"
            );

        if (
            event.target === modal
        ) {

            closeForm();

        }

    };