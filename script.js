// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const adminPanel = document.getElementById('admin-panel');
const adminLogin = document.getElementById('admin-login');
const adminDashboard = document.getElementById('admin-dashboard');

// Sample Data
const galleryData = [
  { id: 1, src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', caption: 'Family Reunion 2023' },
  { id: 2, src: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', caption: 'Christmas Celebration' },
  // More gallery items...
];

const eventsData = [
  { id: 1, title: "Grandma's 80th Birthday", date: "2023-11-15", description: "Celebration at family home" },
  // More events...
];

const familyTreeData = {
  name: "John Shadrack",
  image: "https://randomuser.me/api/portraits/men/75.jpg",
  spouse: {
    name: "Mary Shadrack",
    image: "https://randomuser.me/api/portraits/women/75.jpg"
  },
  children: [
    // Family members...
  ]
};

const messagesData = [
  { id: 1, name: "Robert Smith", email: "robert@example.com", message: "Hi, I'm researching family history" },
  // More messages...
];

// Mobile Menu Toggle
mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Admin Panel Toggle
function toggleAdminPanel() {
  adminPanel.classList.toggle('show-admin');
}

// Render Gallery
function renderGallery() {
  const galleryContainer = document.querySelector('#gallery .grid');
  galleryContainer.innerHTML = galleryData.map(item => `
    <div class="gallery-item bg-white rounded-lg overflow-hidden shadow-md">
      <img src="${item.src}" alt="${item.caption}" class="w-full h-48 object-cover">
      <div class="p-3">
        <p class="text-gray-700">${item.caption}</p>
      </div>
    </div>
  `).join('');
}

// Render Events
function renderEvents() {
  const eventsContainer = document.querySelector('#events .grid');
  eventsContainer.innerHTML = eventsData.map(event => {
    const eventDate = new Date(event.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString('en-US', options);
    
    return `
      <div class="event-card bg-white rounded-xl overflow-hidden shadow-md">
        <div class="bg-indigo-600 text-white p-4">
          <h3 class="font-bold text-xl">${event.title}</h3>
          <p class="text-indigo-100">${formattedDate}</p>
        </div>
        <div class="p-4">
          <p class="text-gray-700">${event.description}</p>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-sm text-gray-500">Family Event</span>
            <button class="text-indigo-600 hover:text-indigo-800">
              <i class="far fa-calendar-plus"></i> Add to Calendar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  renderEvents();
  
  // Form Submissions
  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message!');
    e.target.reset();
  });

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    adminLogin.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
  });
});
