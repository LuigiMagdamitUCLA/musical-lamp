const myMap = L.map('mapArea').setView([34.0709, -118.444], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let dataExt;
let url = "https://spreadsheets.google.com/feeds/list/1wKSyUz0z_iUbkwxHRME-shID4q9mNWqiKXjyl2w5lgs/oyn3kvk/public/values?alt=json"
fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
        console.log(data)
        processData(data)
    })

let markers = []
var bruinIcon = L.icon({
    iconUrl: 'https://cdn.freebiesupply.com/logos/large/2x/ucla-bruins-1-logo-png-transparent.png',
    shadowUrl: 'leaf-shadow.png',

    iconSize:     [30, 30], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});
function generatePost(year = 1, eth = "Filipino", score1 = 0, score2 = 0, story = "", misc = "") {
    let html_element = `
    <h2>Year: ${year} </h2>
    <h3>Ethnicity: ${eth}</h3>
    <h3>How would you rate your safety prior to COVID-19 era? ${score1}</h3>
    <h3>How would you rate your safety after/during COVID-19 era? ${score2}</h3>
    <h4>My Story</h4>
    <p>${story}</p>

    <h4>Is there anything else you want to share?</h4>
    <p>${misc}</p>
    `
    return html_element
}
function addMarker(data){
        //L.marker([data.lat,data.lng]).addTo(myMap).bindPopup(`<h2>${data.location}</h2>`)
        L.marker([data.lat,data.lng], {icon: bruinIcon}).addTo(myMap).bindPopup(
            generatePost(
                year = data.year,
                eth = data.eth,
                score1 = data.score1,
                score2 = data.score2,
                story = data.story,
                misc = data.misc
            )
        )
        return data.location   
}

extData = null
function processData(theData){
    const formattedData = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */
    const rows = theData.feed.entry // this is the weird Google Sheet API format we will be removing
    // we start a for..of.. loop here 
    for(const row of rows) { 
      const formattedRow = {}
      for(const key in row) {
        // time to get rid of the weird gsx$ format...
        if(key.startsWith("gsx$")) {
              formattedRow[key.replace("gsx$", "")] = row[key].$t
        }
      }
      // add the clean data
      formattedData.push(formattedRow)
    }
    // lets see what the data looks like when its clean!
    console.log(formattedData)
    // we can actually add functions here too
    formattedData.forEach(addMarker)
    dataExt = "haha"
}
function getData(theData){
    const formattedData = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */
    const rows = theData.feed.entry // this is the weird Google Sheet API format we will be removing
    // we start a for..of.. loop here 
    for(const row of rows) { 
      const formattedRow = {}
      for(const key in row) {
        // time to get rid of the weird gsx$ format...
        if(key.startsWith("gsx$")) {
              formattedRow[key.replace("gsx$", "")] = row[key].$t
        }
      }
      // add the clean data
      formattedData.push(formattedRow)
    }
    // lets see what the data looks like when its clean!
    
    randomPoint = (formattedData[Math.floor(Math.random()*formattedData.length)])
    console.log(randomPoint)
    myMap.flyTo([randomPoint.lat, randomPoint.lng], zoom = 6)
    myMap.openPopup([randomPoint.lat, randomPoint.lng])
}
function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "buttonrandom"; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        getRandomStory(); //this is the flyTo from Leaflet but using "myMap" as the target
    })
    document.body.appendChild(newButton); //this adds the button to our page.
}
function createLinkButton() {
    const newButton = document.createElement("input");
    newButton.type = "button"
    newButton.onclick = "location.href='https://google.com';"
    newButton.value = "UCLA Asian American Studies Center"
    newButton.id = "link1"
    newButton.addEventListener('click', function(){
        window.open("http://www.aasc.ucla.edu/")
    })
    document.body.appendChild(newButton);
}
createButtons(0, 0, "Click to see a random story!")

function getRandomStory() {
    fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
        console.log(data)
        processData(data)
        getData(data)
    })
    
}
console.log(dataExt)
createLinkButton()