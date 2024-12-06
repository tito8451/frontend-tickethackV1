// Set date default value to today
const apiUrl = 'https://backend-tickethack-one.vercel.app';
document.querySelector('#date').valueAsDate = new Date();

function updateTripBookingEventListener() {
  for (let i = 0; i < document.querySelectorAll('.book').length; i++) {
    document.querySelectorAll('.book')[i].addEventListener('click', function () {
      // fetch("http://localhost:3000/cart", {
      fetch(`${apiUrl}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: this.id }),
      })
        .then(response => response.json())
        .then(data => {
          data.result && window.location.assign('cart.html');
        });
    });
  }
}

// Search
document.querySelector('#search').addEventListener('click', function () {
  const departure = document.querySelector('#departure').value.trim();
  const arrival = document.querySelector('#arrival').value.trim();
  const date = document.querySelector('#date').value.trim();

  
  if (!departure || !arrival || !date) {
    alert("Please fill in all fields.");
    return;
  }

  fetch(`${apiUrl}/search/${departure}/${arrival}/${date}`)
    .then(response => {
      console.log("response",response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
    .then(data => {
     console.log("data",data);
      if (data.result) {
        document.querySelector('#results').innerHTML = '';

        // Update results
        for (const trip of data.trips) {
          // console.log("c'est le trip dans index",trip);
          document.querySelector('#results').innerHTML += `
					  <div class="trip">
						  <span>${trip.departure} > ${trip.arrival}</span> 
							<span>${moment(trip.date).format('HH:mm')}</span>  
							<span class="price">${trip.price}€</span>
							<button class="book" id="${trip._id}">Book</button>
						</div>
					`;
          document.querySelector('#results').style.justifyContent = "flex-start";

        }

        updateTripBookingEventListener();
      } else {
        document.querySelector('#results').innerHTML = `
					<img id="results-logo" src="images/notfound.png"/>
					<div class="divider green"></div>
					<span>No trip found.</span>
				`;
      }
    }).catch(error => {
      console.error("HTTP error:", error);
      console.error("Error:", error.message);
    });
});
