let selectedRow = null;

let id = "";

let taskObj = { backlog: "cardbar_wrap1", inprogress: "cardbar_wrap2", review: "cardbar_wrap3", completed: "cardbar_wrap4" };

function onFormSubmit() {
    let formData = {};
    let formValid = true;

    let titleText = document.getElementById("title");
    let titleRegex = /^[0-9a-zA-Z]+$/;

    if (!(titleText.value.match(titleRegex))) {
        document.getElementById("title").classList.add("invalid");
        document.getElementById("errorMsg").innerHTML = "Please enter the title";
    } else {
        if (!(titleText.value.length <= 40 && titleText.value.length >= 2)) {
            document.getElementById("title").classList.add("invalid");
            document.getElementById("errorMsg").innerHTML = "The title field must contain 2-40 characters";
        } else {
            document.getElementById("title").classList.remove("invalid");
            document.getElementById("errorMsg").innerHTML = "";
            formValid = false;
        }
    }

    document.getElementById("title").addEventListener("click", enter);
    formData["title"] = document.getElementById("title").value;

    formData["description"] = document.getElementById("description").value;

    formData["status"] = document.getElementById("status").value;

    if (formValid === true) {
        console.log("Not valid");
        return false;
    } else {
        if (id == "") {
            let data = getData();
            formData['id'] = uniqueId();
            data.push(formData);
            viewData("", formData);
            setData(data);
            onClear();
        }
        else {
            let data = getData();
            let index = data.findIndex(obj => obj.id === id);
            console.log(index);

            if (index !== -1) {
                data[index] = formData;
                console.log(data[index]);
                data[index].id = id;

                let cardData = document.getElementById(id);
                console.log("title:", cardData.children[0].innerHTML = formData.title);
                console.log("desc:", cardData.children[1].innerHTML = formData.description);

                setData(data);
                viewData();
                onClear();
            }
        }
    }
}

function viewData(searchData, formData) {
    let data = getData();

    if (formData) {
        data.push(formData);
    }

    if (searchData) {
        data = data.filter(search => {
            if (search.title.includes(searchData) || search.description.includes(searchData)) {
                return true;
            }
            return false;
        });
    }

    document.getElementById("cardbar_wrap1").innerHTML = "";
    document.getElementById("cardbar_wrap2").innerHTML = "";
    document.getElementById("cardbar_wrap3").innerHTML = "";
    document.getElementById("cardbar_wrap4").innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        if (taskObj[data[i].status]) {
            const cardBarWrap = document.getElementById(taskObj[data[i].status]);

            const cardDetail = document.createElement("div");
            cardDetail.className = "card_details";

            const leftSide = document.createElement("span");
            leftSide.className = "card_left";
            leftSide.setAttribute("id", data[i].id);

            const heading = document.createElement("h4");
            const headingText = document.createTextNode(data[i].title);
            heading.appendChild(headingText);

            const para = document.createElement("p");
            const paraText = document.createTextNode(data[i].description);
            para.appendChild(paraText);

            leftSide.appendChild(heading)
            leftSide.appendChild(para);
            cardDetail.appendChild(leftSide);

            const rightSide = document.createElement("span");
            rightSide.className = "card_right";

            const editBtn = document.createElement('button');
            editBtn.id = 'edtBtn';
            editBtn.className = 'edit';
            editBtn.addEventListener('click', function () {
                edtData(data[i]);
            })
            editBtn.innerHTML = 'Edit';

            const deleteBtn = document.createElement('button');
            deleteBtn.id = 'delBtn';
            deleteBtn.className = 'delete';
            deleteBtn.addEventListener('click', function () {
                delData(data[i].id, cardDetail);
            })
            deleteBtn.innerHTML = 'Delete';

            rightSide.appendChild(editBtn);
            rightSide.appendChild(deleteBtn);
            cardDetail.appendChild(rightSide);
            cardBarWrap.appendChild(cardDetail);
            onClear();
        }
    }
}

function delData(id, cardDetail) {
    let data = getData();
    let index = data.findIndex(obj => obj.id === id);
    console.log(index);
    if (index !== -1) {
        data.splice(index, 1);
        cardDetail.remove();
        setData(data);
    }
}

function edtData(fetchData) {
    id = fetchData.id;
    let data = getData();
    let index = data.findIndex(obj => obj.id === fetchData.id);
    console.log(index);
    if (index !== -1) {
        document.getElementById("title").value = fetchData.title;
        document.getElementById("description").value = fetchData.description;
        document.getElementById("status").value = fetchData.status;
    }
    document.getElementById("cardStatus").style.display = "block";
    document.getElementById("add").value = "Save Task";
}

function searchFunction() {
    let searchVal = document.getElementById("searchbar").value;
    viewData(searchVal);
}

function uniqueId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function getData() {
    return localStorage.getItem('todoData') ? JSON.parse(localStorage.getItem('todoData')) : [];
}

function setData(data) {
    localStorage.setItem('todoData', JSON.stringify(data));
}

function onClear() {
    document.getElementById("myForm").reset();
    document.getElementById("cardStatus").style.display = "none";
    document.getElementById("add").value = "Add Task";
    enter();
}

function enter() {
    document.getElementById("title").classList.remove("invalid");
    document.getElementById("errorMsg").innerHTML = "";
}

function clearSearch() {
    document.getElementById("searchbar").value = "";
    viewData();
}

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cardStatus").style.display = "none";
});