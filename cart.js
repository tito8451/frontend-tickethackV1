const apiUrl ='http://localhost:3000';
function updateRemoveFromCartEventListener() {
  for (let i = 0; i < document.querySelectorAll('.delete').length; i++) {
    document.querySelectorAll('.delete')[i].addEventListener('click', function () {
      fetch(`${apiUrl}/cart/${this.id}`, { method: 'DELETE' })
      // fetch(`http://localhost:3000/cart/${this.id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            this.parentNode.remove();

            // Reset cart if all trips have been deleted
            if (document.querySelectorAll('.delete').length === 0) {
              document.querySelector('#cart').innerHTML = `
								<p>No tickets in your cart.</p>
								<p>Why not plan a trip?</p>
							`;
              document.querySelector('#cart2').style.display = 'none';
            } else {
              // Update total
              document.querySelector('#total').textContent = data.bookings.reduce((acc, { trip }) => acc + trip.price, 0);
            }
          }
        });
    });
  }
}

// Get cart
fetch(`${apiUrl}/cart`)
// fetch('http://localhost:3000/cart')
// fetch('http://localhost:3000/cart')
  .then(response => response.json())
  .then(data => {
    if (data.result) {
      document.querySelector('#cart2').style.display = 'flex';
      document.querySelector('#cart').innerHTML = '<h4>My cart</h4>';

      // Update cart list
      for (const { trip } of data.bookings) {
        document.querySelector('#cart').innerHTML += `
					<div class="selected-trip">
						${trip.departure} > ${trip.arrival} <span>${moment(trip.date).format('HH:mm')}</span><span class="price">${trip.price}€</span>
						<button class="delete" id="${trip._id}">X</button>
					</div>
				`;
      }

      // Update total
      document.querySelector('#total').textContent = data.bookings.reduce((acc, { trip }) => acc + trip.price, 0);

      updateRemoveFromCartEventListener();
    } else {
      document.querySelector('#cart2').style.display = 'none';
    }
  });

// Purchase
document.querySelector('#purchase').addEventListener('click', function () {
  // Récupérez les IDs des voyages qui sont dans le cart
  const tripIds = Array.from(document.querySelectorAll('.selected-trip')).map(trip => trip.querySelector('.delete').id);

  // Vérifiez si des voyages sont dans le panier
  if (tripIds.length === 0) {
    alert("Your cart is empty, please add trips before purchasing.");
    return;
  }

  // Créez un tableau d'objets à envoyer avec isPaid à true
  const bookingsData = tripIds.map(tripId => ({ tripId, isPaid: true }));

  fetch(`${apiUrl}/bookings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingsData), // Envoyez le tableau avec les valeurs nécessaires
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.result) {
        window.location.assign('bookings.html');
      } else {
        console.error('Failed to update booking:', data.error);
      }
    })
    .catch(error => {
      console.error("HTTP error:", error);
    });
});


