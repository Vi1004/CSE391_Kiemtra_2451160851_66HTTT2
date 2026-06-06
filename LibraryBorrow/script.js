// Dữ liệu mẫu

let borrows =
JSON.parse(localStorage.getItem("borrows")) || [
{
    borrowId:"PM-2048",
    borrowerName:"Nguyen Van A",
    bookId:"BK10234",
    category:"CNTT",
    borrowDate:"2025-06-01",
    returnDate:"2025-06-15",
    phone:"0912345678",
    email:"a@library.vn",
    status:"Đang mượn",
    note:""
}
];

let editIndex = -1;

// Khởi động

render();
updateStats();

// Mở form

function openForm(){
    modal.style.display="block";
}

// Đóng form

function closeForm(){
    modal.style.display="none";
    borrowForm.reset();
    clearErrors();
    editIndex=-1;
}

// Lưu LocalStorage

function saveData(){
    localStorage.setItem(
        "borrows",
        JSON.stringify(borrows)
    );
}

// Hiển thị bảng

function render(){

    borrowTable.innerHTML =
    borrows.map((b,i)=>`

    <tr>
        <td>${i+1}</td>
        <td>${b.borrowId}</td>
        <td>${b.borrowerName}</td>
        <td>${b.bookId}</td>
        <td>${b.category}</td>
        <td>${b.borrowDate}</td>
        <td>${b.returnDate}</td>
        <td>${b.status}</td>

        <td>

            <button
            class="btn-edit"
            onclick="editBorrow(${i})">
            Sửa
            </button>

            <button
            class="btn-delete"
            onclick="deleteBorrow(${i})">
            Xóa
            </button>

        </td>

    </tr>

    `).join("");
}

// Thống kê

function updateStats(){

    total.innerText =
    borrows.length;

    borrowing.innerText =
    borrows.filter(
        b=>b.status==="Đang mượn"
    ).length;

    returned.innerText =
    borrows.filter(
        b=>b.status==="Đã trả"
    ).length;
}

// Hiện lỗi

function error(id,msg){
    document.getElementById(id).innerText=msg;
}

// Xóa lỗi

function clearErrors(){
    document
    .querySelectorAll(".error")
    .forEach(e=>e.innerText="");
}

// Validate

function validate(){

    clearErrors();

    let ok=true;

    let id=borrowId.value.trim();
    let name=borrowerName.value.trim();
    let book=bookId.value.trim();
    let noteText=note.value.trim();

    if(!/^PM-\d{4}$/.test(id)){
        error("borrowIdError","PM-XXXX");
        ok=false;
    }

    let duplicate=
    borrows.findIndex(
        b=>b.borrowId===id
    );

    if(
        duplicate!=-1 &&
        duplicate!=editIndex
    ){
        error("borrowIdError","Mã bị trùng");
        ok=false;
    }

    if(
        name.length<2 ||
        name.length>40
    ){
        error("borrowerNameError","2-40 ký tự");
        ok=false;
    }

    if(!/^BK\d{5}$/.test(book)){
        error("bookIdError","BK12345");
        ok=false;
    }

    if(category.value===""){
        error("categoryError","Chọn thể loại");
        ok=false;
    }

    if(
        !/^(03|05|07|08|09)\d{8}$/
        .test(phone.value)
    ){
        error("phoneError","SĐT sai");
        ok=false;
    }

    if(
        !/^[^\s@]+@library\.vn$/
        .test(email.value)
    ){
        error("emailError","@library.vn");
        ok=false;
    }

    if(status.value===""){
        error("statusError","Chọn trạng thái");
        ok=false;
    }

    if(noteText.length>120){
        error("noteError","Tối đa 120 ký tự");
        ok=false;
    }

    if(
        /<(script|iframe|img)/i
        .test(noteText)
    ){
        error("noteError","Không nhập HTML");
        ok=false;
    }

    let d1=new Date(borrowDate.value);
    let d2=new Date(returnDate.value);

    let diff=
    (d2-d1)/(1000*60*60*24);

    if(d2<d1){
        error(
            "returnDateError",
            "Hạn trả >= ngày mượn"
        );
        ok=false;
    }

    if(diff>30){
        error(
            "returnDateError",
            "Không quá 30 ngày"
        );
        ok=false;
    }

    return ok;
}

// Submit

borrowForm.onsubmit=function(e){

    e.preventDefault();

    if(!validate()) return;

    let borrow={

        borrowId:borrowId.value,
        borrowerName:borrowerName.value,
        bookId:bookId.value,
        category:category.value,
        borrowDate:borrowDate.value,
        returnDate:returnDate.value,
        phone:phone.value,
        email:email.value,
        status:status.value,
        note:note.value

    };

    if(editIndex==-1){

        borrows.push(borrow);

    }else{

        borrows[editIndex]=borrow;

    }

    saveData();

    render();

    updateStats();

    closeForm();
};

// Sửa

function editBorrow(i){

    editIndex=i;

    let b=borrows[i];

    borrowId.value=b.borrowId;
    borrowerName.value=b.borrowerName;
    bookId.value=b.bookId;
    category.value=b.category;
    borrowDate.value=b.borrowDate;
    returnDate.value=b.returnDate;
    phone.value=b.phone;
    email.value=b.email;
    status.value=b.status;
    note.value=b.note;

    openForm();
}

// Xóa

function deleteBorrow(i){

    if(
        confirm(
            "Bạn có chắc muốn xóa?"
        )
    ){

        borrows.splice(i,1);

        saveData();

        render();

        updateStats();
    }
}

// Click nền để đóng

window.onclick=function(e){

    if(e.target==modal){

        closeForm();

    }
}