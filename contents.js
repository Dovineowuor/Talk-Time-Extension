document.addEventListener('DOMContentLoaded', function () {
    // use case: Retrieve the active user data from the page
    const activeUserElement = document.getElementById('activeUser');
    const activeUser = {
      id: activeUserElement.dataset.userId,
      name: activeUserElement.dataset.userName,
      status: activeUserElement.dataset.userStatus
    };
  
    // Send the active user data to the background script
    chrome.runtime.sendMessage({ action: 'activeUser', data: activeUser }, function (response) {
      console.log(response.message);
    });
  
    // Check if the active user matches the "We believe people come..." profile
    const isWeBelieveProfile = activeUserElement.classList.contains('weBelieveProfile');
  
    // Send the active user data and "We believe people come..." status to the background script
    chrome.runtime.sendMessage({ action: 'activeUser', data: activeUser, isWeBelieveProfile }, function (response) {
      console.log(response.message);
    });
  
    // Apply dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
  
    // Set minimum sending delay to 0.01 seconds (10 milliseconds)
    const minimumDelay = 10;
    chrome.runtime.sendMessage({ action: 'setMinimumDelay', delay: minimumDelay }, function (response) {
      console.log(response.message);
    });
  
    // Send messages to "We believe people come..." profiles
    if (isWeBelieveProfile) {
      // Retrieve the message template from local storage or an external source
      const messageTemplate = 'Hello! I believe people come...';
  
      // use case: Send a message to the current profile
      const messageInput = document.getElementById('messageInput');
      messageInput.value = messageTemplate;
      messageInput.dispatchEvent(new Event('input'));
  
      // use case: Trigger the send button click event
      const sendButton = document.getElementById('sendButton');
      sendButton.click();
    }
  
    // Room Management
    const roomSelect = document.getElementById('roomSelect');
    roomSelect.addEventListener('change', updateProfiles);
  
    function updateProfiles() {
      const selectedRoom = roomSelect.value;
  
      // Make an AJAX request or fetch the updated profile data for the selected room
      fetch(`/get-profiles?room=${selectedRoom}`)
        .then(response => response.json())
        .then(data => {
          const profilesContainer = document.getElementById('profilesContainer');
          profilesContainer.innerHTML = '';
  
          data.forEach(profile => {
            const profileElement = document.createElement('div');
            profileElement.classList.add('profile');
            profileElement.textContent = profile.name;
            profilesContainer.appendChild(profileElement);
          });
        })
        .catch(error => console.error(error));
    }
  
    // Populate room options dynamically
    fetch('/get-rooms')
      .then(response => response.json())
      .then(data => {
        data.forEach(room => {
          const option = document.createElement('option');
          option.value = room.id;
          option.textContent = room.name;
          roomSelect.appendChild(option);
        });
      })
      .catch(error => console.error(error));
  
    // Sidebar Management
    const sidebar = document.getElementById('sidebar');
    const hideButton = document.getElementById('hideButton');
    const showButton = document.getElementById('showButton');
  
    hideButton.addEventListener('click', hideSidebar);
    showButton.addEventListener('click', showSidebar);
  
    function hideSidebar() {
      sidebar.classList.add('hidden');
      showButton.style.display = 'block';
    }
  
    function showSidebar() {
      sidebar.classList.remove('hidden');
      showButton.style.display = 'none';
    }
  
    // Blacklist handling
    const blacklistedCustomers = document.getElementById('blacklistedCustomers');
  
    // Make an HTTP request to your server-side endpoint to fetch the blacklisted customers
    fetch('/api/blacklisted-customers') // Replace '/api/blacklisted-customers' with your actual endpoint URL
      .then(response => response.json())
      .then(data => {
        // Iterate over the blacklisted customers and dynamically create <li> elements
        data.forEach(customer => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `<span class="icon offline"></span>${customer}`;
          blacklistedCustomers.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error fetching blacklisted customers:', error);
      });
  
    // Handle form submission
    const blockForm = document.getElementById('blockForm');
    const customerInput = document.getElementById('customerInput');
  
    blockForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const customerValue = customerInput.value.trim();
      if (customerValue !== '') {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="icon offline"></span>${customerValue}`;
        blacklistedCustomers.appendChild(listItem);
        // Add customer to your application's blacklist logic and make a request to your server-side endpoint to update the blacklist
        customerInput.value = '';
      }
    });
  
    // Auto Sending review and handling
    // Function to handle form submission and update delay settings
    function setDelay(event) {
      event.preventDefault();
  
      const delayInput = document.getElementById('delayInput');
      const delay = parseInt(delayInput.value);
  
      // Update the delay settings (store it in localStorage for simplicity)
      localStorage.setItem('messageDelay', delay);
  
      console.log('Delay updated:', delay);
    }
  
    // Event listener for form submission
    const delayForm = document.getElementById('delayForm');
    delayForm.addEventListener('submit', setDelay);
  
    // Function to check message frequency and enforce minimum time gap between messages
    function checkMessageFrequency() {
      const lastSentTime = localStorage.getItem('lastSentTime');
      const messageDelay = localStorage.getItem('messageDelay');
  
      if (!lastSentTime || !messageDelay) {
        // Either lastSentTime or messageDelay is not set, no need for frequency control
        return true;
      }
  
      const currentTime = new Date().getTime();
      const timeSinceLastMessage = currentTime - parseInt(lastSentTime);
  
      if (timeSinceLastMessage < messageDelay) {
        // Minimum time gap not met, do not send message
        console.log('Minimum time gap not met. Cannot send message.');
        return false;
      }
  
      // Update last sent time
      localStorage.setItem('lastSentTime', currentTime.toString());
      return true;
    }
  
    // Function to send a message
    function sendMessage(message) {
      // Implement your code to send the message here
      console.log('Message sent:', message);
    }
  
    // Function to automate message sending
    function automateMessageSending() {
      // Read the message to send from the DOM or database entries on workspace.html
      const messageInput = document.getElementById('messageInput');
      const messageToSend = messageInput.value.trim();
  
      if (!messageToSend) {
        console.log('No message to send.');
        return;
      }
  
      if (checkMessageFrequency()) {
        // Send the message
        sendMessage(messageToSend);
        messageInput.value = ''; // Clear the input field after sending the message
      } else {
        // Do not send the message
        console.log('Message not sent.');
      }
    }
  
    // Example usage:
    automateMessageSending();
  });
  