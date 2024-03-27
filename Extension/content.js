// Get the current URL

const urlToExtract = window.location.href.split("/tasks")[0] + "/submissions/me";

var data = new Map();
var parser = new DOMParser();
var pageNum = 1;


(async function() {
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
    console.log(data);
    updateTasks(document.documentElement.outerHTML);
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

// Function to update the tasks page
function updateTasks(currentHtmlContent) {
    // Parse the HTML content of the current webpage into a DOM document
    var parsedCurrentHtml = parser.parseFromString(currentHtmlContent, "text/html");

    // Selecting all the rows one by one
    var elements = parsedCurrentHtml.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for(var i = 0; i < elements.length; i++){
        var element = elements[i];
        var ques = element.getElementsByTagName("td")[1].textContent.trim();
        // var button = element.getElementsByTagName("td")
        // console.log(ques)
        // console.log(button)
        if(data.has(ques)){
            if(data.get(ques) === "AC"){
                element.style.backgroundColor = "#d4edc9";
            } else if(data.get(ques) !== "WJ"){
                element.style.backgroundColor = "#ffe3e3";
            }
        }
    }
    // console.log(parsedCurrentHtml.documentElement.innerHTML)
    document.documentElement.innerHTML = parsedCurrentHtml.documentElement.innerHTML;
}