const myMap = L.map('mapArea').setView([34.0709, -118.444], 8);
let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});
Esri_WorldGrayCanvas.addTo(myMap);
let url = "https://spreadsheets.google.com/feeds/list/1ZH2-pBKLWZEDFkV90ECcUX5HMw4P-8vpKjDxNs3wnMc/okrozsk/public/values?alt=json"
var markers = []
// INIT VARIABELS HERE================================================

var obj;
fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{

        processData(data)
        obj = data
    })
    
// INIT FUNCTIONS HERE===============================================


let circleOptions = {
    radius: 10,
    fillColor: "purple",
    color: "pink",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  }
  let modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close")[0];
  
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  let btn = document.getElementById("myBtn");
  btn.onclick = function() {
    modal.style.display = "block";
  }
var bruinIcon = L.icon({
    iconUrl: 'https://i.pinimg.com/originals/71/c8/06/71c806428f9d8c76f8dd491ee177382c.png',
    shadowUrl: 'leaf-shadow.png',

    iconSize:     [30, 30], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [19, 46],//changed marker icon positionpond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -36] // point from which the popup should open relative to the iconAnchor
});


// FUNCTIONS ======================================================================


function generatePost(id, prior, fear, supp, safe, story, place, eth, misc) {
    
    for(var i = 0; i < arguments.length; i++){
        if(arguments[i] == ""){

            arguments[i] = "No response given by survey taker"

        }

    }

    let html_element = `
    <h4>Do you identify as Asian American?: ${id} </h4>

    <h4>Please describe how your race/ethnicity has influenced your level of fear of mistreatment prior to the COVID-19 pandemic, as well as after. Have these feelings changed, and how so?:</h4>
    <p>${prior}</p>

    <h4>How does your level of fear regarding hate crimes affect how you conduct your daily life, if it affects it at all?:</h4>
    <p>${fear}</p>

    <h4>Who would you consider to be within your support network (ex. a parent, a friend, a sibling, etc)?</h4>
    <p>${supp}</p>

    <h4>What would make you feel safer and more supported against racially motivated discrimination in your community?</h4>
    <p>${safe}</p>

    <h4>What’s your story? What message would you like to share with others in the Asian American community at this time? (ex. A message, a page, website or project to inspire and empower other Asian Americans.)</h4>
    <p>${story}</p>

    <h4>Where were you living when you were experiencing these emotions during COVID-19?</h4>
    <p>${place}</p>

    <h4>Which ethnic category do you most identify with?</h4>
    <p>${eth}</p>

    <h4>Is there anything else you would like to share?</h4>
    <p>${misc}</p>
    `
    return html_element
}
function addMarker(data){
        content = generatePost(
                    id = data["doyouself-identifyasasianamerican"],
                    prior = data["pleasedescribehowyourraceethnicityhasinfluencedyourleveloffearofmistreatmentpriortothecovid-19pandemicaswellasafter.havethesefeelingschangedandhowso"],
                    fear = data["howdoesyourleveloffearregardinghatecrimesaffecthowyouconductyourdailylifeifatall"],
                    supp = data["whowouldyouconsidertobewithinyoursupportnetworkex.aparentafriendasiblingetc"],
                    safe = data["whatwouldmakeyoufeelsaferandmoresupportedagainstraciallymotivateddiscriminationinyourcommunity"],
                    story = data["whatsyourstorywhatmessagewouldyouliketosharewithothersintheasianamericancommunityatthistimeex.amessageapagewebsiteorprojecttoinspireandempowerotherasianamericans."],
                    place = data["wherewereyoulivingwhenyouwereexperiencingtheseemotionsduringcovid-19"],
                    eth = data["whichethniccategorydoyoumostidentifywith"],
                    misc = data["isthereanythingelseyouwouldliketoshare"],
                )
        var popup = L.popup(
            {
                maxHeight: 500
            }
        )
            .setLatLng([data.lat, data.lng])
            .setContent(content)
            .openOn(myMap);
        var marker = L.marker([data.lat,data.lng])
        markers.push(marker)
        marker.addTo(myMap).bindPopup(popup)
        

        //createButtons(data.lat,data.lng,data["wherewereyoulivingwhenyouwereexperiencingtheseemotionsduringcovid-19"])
        createStories(data.lat, data.lng, data["whatsyourstorywhatmessagewouldyouliketosharewithothersintheasianamericancommunityatthistimeex.amessageapagewebsiteorprojecttoinspireandempowerotherasianamericans."])
        return data.location   
}
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

    // we can actually add functions here too
    formattedData.forEach(addMarker)
    
    L.control.layers(null,layers).addTo(myMap)
   
    myMap.fitBounds(allLayers.getBounds());
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

    myMap.flyTo([randomPoint.lat, randomPoint.lng], zoom = 10)
    myMap.openPopup([randomPoint.lat, randomPoint.lng])
}
function createButtons2(lat,lng,title){
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
//createButtons(0, 0, "Click to see a random story!")



//createLinkButton()

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "buttonsmenu"; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        myMap.flyTo([lat,lng], zoom = 10); //this is the flyTo from Leaflet
        myMap.openPopup([lat, lng])
    })
    const spaceForButtons = document.getElementById('contents')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
}
function createStories(lat,lng,title){
    const newButton = document.createElement("h4"); // adds a new button
    newButton.id = "buttonsmenu"; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    const spaceForButtons = document.getElementById('contents')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
}
console.log(markers[1])
for(var i = 0; i < markers.length; i++) {
    console.log(markers[i])
}