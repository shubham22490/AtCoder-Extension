// Get the current URL

const urlToExtract = window.location.href.split("/tasks")[0] + "/submissions/me";

var data = new Map();

fetch(urlToExtract)
    .then(response => response.text())
    .then(htmlContent => {
        // Call a function to parse or extract information from the HTML content
        parseHTML(htmlContent);

        const currentHtmlContent = document.documentElement.outerHTML;
        // Call a function to parse or extract information from the current HTML content
        parseCurrentHTML(currentHtmlContent);
    })
    .catch(error => {
        // Handle any errors that occur during the fetch request
        console.error("Error fetching webpage:", error);
    });

function parseHTML(htmlContent) {
    // Create a DOMParser object
    var parser = new DOMParser();

    // Parse the HTML content into a DOM document
    var parsedHtml = parser.parseFromString(htmlContent, "text/html");

    // Select elements by their class using querySelectorAll
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

    // console.log(data);

}


function parseCurrentHTML(currentHtmlContent) {
    // Create a DOMParser object
    var parser = new DOMParser();

    // Parse the HTML content of the current webpage into a DOM document
    var parsedCurrentHtml = parser.parseFromString(currentHtmlContent, "text/html");

    // Select elements or perform other parsing operations on the current webpage
    // Example:
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