import EventsApi from './api.js';
import { openModal } from './components/modal.js';

const eventsApi = new EventsApi();

function displayEvents(events) {
  const cardsContainer = document.querySelector('.cards');
  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
            <img class="event-image" src="${event.images[0].url}" alt="${event.name}">
            <h3 class="event-name">${event.name}</h3>
            <p class="event-date">${event.dates.start.localDate}</p>
            <p class="event-place">${event._embedded.venues[0].name}</p>
                `;
    card.addEventListener('click', () => openModal(event));
    cardsContainer.appendChild(card);
  });
}

eventsApi
  .getEvents()
  .then(data => {
    if (data._embedded && data._embedded.events) {
      displayEvents(data._embedded.events);
    } else {
      console.error('No events found');
    }
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

// Choose Country

const dropdownInput = document.getElementById('dropdown-input');
const dropdownMenu = document.querySelector('.dropdown-menu');

dropdownInput.addEventListener('click', function () {
  dropdownMenu.style.display =
    dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', function (event) {
  if (
    !dropdownInput.contains(event.target) &&
    !dropdownMenu.contains(event.target)
  ) {
    dropdownMenu.style.display = 'none';
  }
});

const dropdownItems = document.querySelectorAll('.dropdown-menu li');
dropdownItems.forEach(item => {
  item.addEventListener('click', function () {
    dropdownInput.value = this.textContent;
    dropdownMenu.style.display = 'none';
  });
});


// -------------------INPUT START-SEARCHING-------------------------


document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault(); 

  const keyword = document.getElementById('searchInput').value.trim();
  if (keyword) {
    searchEvents(keyword);
  }
});

async function searchEvents(keyword) {
  const content = document.querySelector('.cards');
  content.innerHTML = `<p>Searching for "${keyword}"...</p>`;

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events?keyword=${keyword}&apikey=Z9sML3GkU2JtjpwYuKAphTWzMdRrsxCG`
    );
    const data = await response.json();

    if (data._embedded && data._embedded.events) {
      displayEvents(data._embedded.events);
    } else {
      content.innerHTML = `<p>No results found for "${keyword}".</p>`;
    }
  } catch (error) {
    content.innerHTML = `<p>Error searching for "${keyword}". Please try again later.</p>`;
  }
}

// -------------------------------------------------------------------------------------