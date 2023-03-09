let url = 'https://api.wheretheiss.at/v1/satellites/25544'

let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')
let timeIssLocationFetched = document.querySelector('#time')

let update = 10000
let maxfailedAttempts = 3

let issMarker  // Leaflet marker 
let icon = L.icon({
    iconUrl: 'iss.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})
let map = L.map('iss-map').setView([0, 0], 1)  // Center at 0, 0 and max zoom out

// Add the tile layer - roads, streets etc. Without this, nothing to see 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copywrite">OpenStreetMap</a>',    
}).addTo(map)

iss(maxfailedAttempts) // call function one time to start
//setInterval(iss, update ) // 10 seconds
function iss(attempts){

    if (attempts <= 0){
        alert('Attempted to contact server, failed after several attempts.')
        return
    }

    fetch(url).then((res) => {  
        return res.json()  // process response into JSON
    }).then( (issData) => {
        console.log(issData) //TODO -Display data on web page
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat
        issLong.innerHTML = long

       // create marker if it dosen't exist
       //mover marker if it does exist
       if (!issMarker) {
        // create marker
        issMarker = L.marker([lat, long], {icon: icon} ).addTo(map)
       } else {
        issMarker.setLatLng([lat, long]) // Already exists - move to new location
       }

       // Update the time element to the current date and time 
       let now = Date()
       timeIssLocationFetched.innerHTML = `This data was fetched as ${now}`

    }).catch( (err) =>{
        attempts --
        console.log('ERROR!', err)
    }).finally( () => {
        // finally runs whether the fetch() worked or failed.
        // Call the iss function after a delay of update miliseconds to update the position 
        setTimeout(iss, update, attempts)
    })
}