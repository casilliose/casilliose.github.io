function All()
{
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'questions.json', false);

    try {
        xhr.send();
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            const obj = JSON.parse(xhr.response);
            window.questions = obj
            document.getElementById("start").hidden = true
            render(window.questions["1"], "1")
        }
    } catch(err) {
        console.log(err)
        alert("Запрос не удался");
    }
}

const shuffle = (array) => {
    let m = array.length, t, i;

    // Пока есть элементы для перемешивания
    while (m) {

        // Взять оставшийся элемент
        i = Math.floor(Math.random() * m--);

        // И поменять его местами с текущим элементом
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function render(obj, index) {
    let pattern = "<div class='center'>"
    if (obj["img"] != "") {
        pattern += "<img src='img/"+obj["img"]+"' />"
    }
    pattern += "<p>"+obj["question"]+"</p><div id='qwr' data-index='"+index+"'>"
    shuffle(obj["variants"]);
    for (const [key, value] of Object.entries(obj["variants"])) {
        pattern += "<button onclick='check(this)' data-correct='"+value["correct"]+"'>"+value["answer"]+"</button>"
    }
    pattern += "</div></div>"
    document.getElementById("questions").innerHTML = pattern
}

function check(ts)
{
    if (ts.dataset.correct == "false") {
        ts.style.color = "red";
        document.getElementById("qwr").style.color = "green"
        addLocal(ts.parentNode.dataset.index)
        for (const element of ts.parentNode.children) {
            if (element.dataset.correct == "true") {
                element.style.color = "green"
            }
        }
    } else {
        ts.style.color = "green";
        removeStore(ts.parentNode.dataset.index)
    }
    let res = nextElemenet(ts.parentNode.dataset.index)
    if (res == null) {
        setTimeout(() => { finish(); }, 1500);
    } else {
        setTimeout(() => { render(res[1],  res[0]); }, 1500);
    }
}

function addLocal(inx)
{
    if (localStorage.getItem("failAnswer") == null ) {
        let arrayFail = [];
        arrayFail.push(inx)
        localStorage.setItem("failAnswer", JSON.stringify(arrayFail));
    } else {
       let save = JSON.parse(localStorage.getItem("failAnswer"));
        if (!contains(save, inx)) {
            save.push(inx);
            localStorage.setItem("failAnswer", JSON.stringify(save));
        }
    }
}

function removeStore(inx) {
    if (localStorage.getItem("failAnswer") != null ) {
        let save = JSON.parse(localStorage.getItem("failAnswer"));
        if (contains(save, inx)) {
            save = save.filter(function(item) {
                return item !== inx
            })
            localStorage.setItem("failAnswer", JSON.stringify(save));
        }
    }
}

function contains(arr, elem) {
    return arr.indexOf(elem) != -1;
}

function finish() {
    alert("Тест завершен !!!")
    document.getElementById("questions").innerHTML = ""
    document.getElementById("start").hidden = false
    return
}

function notAll()
{
    let save = JSON.parse(localStorage.getItem("failAnswer"));
    if (save == null || save.length <= 0) {
        alert("Нет неправильных ответов")
        document.getElementById("start").hidden = false
        return
    }
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'questions.json', false);

    try {
        xhr.send();
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            const obj = JSON.parse(xhr.response);
            const arr = {}
            for (const [key, value] of Object.entries(obj)) {
                if (contains(save, key)) {
                    arr[key] = value
                }
            }
            window.questions = arr
            document.getElementById("start").hidden = true
            res = getFirstElement(window.questions)
            render(res[1], res[0])
        }
    } catch(err) {
        console.log(err)
        alert("Запрос не удался");
    }
}

function nextElemenet(inx) {
    let f = false
    for (const [key, value] of Object.entries(window.questions)) {
        if (f) {
            return [key, value]
        }
        if (key == inx) {
            f = true
        }
    }
    return null
}

function getFirstElement(arr) {
    for (const [key, value] of Object.entries(arr)) {
        return [key, value]
    }
}