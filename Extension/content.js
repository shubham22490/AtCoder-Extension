// Get the current URL
const baseURL = window.location.href.split("/tasks")[0];
const urlToExtract = baseURL + "/submissions/me";

var data = new Map();
var parser = new DOMParser();
let problems = [];
var pageNum = 1;
var currentPageHtml = parser.parseFromString(document.documentElement.outerHTML, "text/html");

(async function() {
    const ACurl = baseURL + "/standings/json";
    console.log(ACurl);
    const resp = await fetch(ACurl);
    if(resp.ok){
        addColumn(currentPageHtml);
    }
    while(true) {
        var url = urlToExtract + `?page=${pageNum}`;
        console.log(url);
        try{
            const response = await fetch(url);
            const htmlContent = await response.text();
            const parsedHTML = parser.parseFromString(htmlContent, 'text/html');
            
            const pager = parsedHTML.getElementsByClassName("pager");
            if(pager.length == 0){
                console.log("No more Pages");
                break;
            }

            getData(parsedHTML);
        } catch(error){
            console.log("Error: " + error);
            break;
        }

        pageNum++;
    }
    
    if(resp.ok){
        const jsonData = await resp.json();
        getACcount(jsonData);
        updateTasksAndStandings(currentPageHtml);
    } else{
        updateTasks(currentPageHtml);
    }
    
})()

// Function to find the 
function getData(parsedHtml) {
    var elements = parsedHtml.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        // Access the properties or text content of each element
        var ques = element.getElementsByTagName("td")[1].textContent.trim().split("-")[1].trim();
        var state = element.getElementsByTagName("td")[6].getElementsByTagName("span")[0].textContent.trim()
        // console.log(state);
        if(!data.has(ques) || data.get(ques) !== "AC") {
            data.set(ques, state);
        }
    }
}

function getACcount(json){
    let users = json.StandingsData;
    problems = json.TaskInfo;
    for(let i = 0; i < problems.length; i++) problems[i].count = 0;
    for(let i = 0; i < users.length; i++){
        let user = users[i];
        for(let j = 0; j < problems.length; j++){
            let result = user.TaskResults[problems[j].TaskScreenName];
            if(result == undefined || result.Score == 0) continue;
            problems[j].count++;
        }
    }

    for(let i = 0; i < problems.length; i++) console.log(problems[i]);
    // console.log(countAC);
}

function addColumn(parsedHTML){
    
    var table = parsedHTML.querySelector("table");
    
    var newHeaderCell = document.createElement("th");
    newHeaderCell.textContent = "Accepted";
    newHeaderCell.style.width = "8%";
    newHeaderCell.classList.add("no-break");
    newHeaderCell.classList.add("text-center");
    table.rows[0].appendChild(newHeaderCell);

    for(var i = 1; i < table.rows.length; i++){
        let row = table.rows[i];
        var cell = row.insertCell(-1);
        cell.classList.add("text-center");
        cell.classList.add("no-break");
        cell.style.width = "8%";
        cell.innerHTML = `<img src='https://codeforces.org/s/15108/images/icons/user.png' /> x${0}`;
    }
    console.log("Table: ", table);
    var currentTable = document.querySelector("table");
    currentTable.innerHTML = table.innerHTML;
}

function updateTasks(parsedHtml){
    var elements = parsedHtml.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for(var i = 0; i < elements.length; i++){
        var element = elements[i];
        var ques = element.getElementsByTagName("td")[1].textContent.trim();
        if(data.has(ques)){
            if(data.get(ques) === "AC"){
                element.style.backgroundColor = "#d4edc9";
            } else if(data.get(ques) !== "WJ"){
                element.style.backgroundColor = "#ffe3e3";
            }
        }
    }
    var currentTable = document.querySelector("table");
    currentTable.innerHTML = parsedHtml.querySelector("table").innerHTML;
}

// Function to update the tasks page
function updateTasksAndStandings(parsedCurrentHtml) {
    // Selecting all the rows one by one
    var elements = parsedCurrentHtml.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    var table = parsedCurrentHtml.querySelector("table");
    console.log(table);
    
    for(var i = 0; i < elements.length; i++){
        let row = table.rows[i+1].cells[5];
        row.innerHTML = `<img src='https://codeforces.org/s/15108/images/icons/user.png' /> x${problems[i].count}` ;
        var element = elements[i];
        var ques = element.getElementsByTagName("td")[1].textContent.trim();
        if(data.has(ques)){
            if(data.get(ques) === "AC"){
                element.style.backgroundColor = "#d4edc9";
            } else if(data.get(ques) !== "WJ"){
                element.style.backgroundColor = "#ffe3e3";
            }
        }
    }
    var currentTable = document.querySelector("table");
    currentTable.innerHTML = table.innerHTML;
}