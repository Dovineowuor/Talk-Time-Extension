// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();

  // Get the form inputs
  const recipient = document.getElementById('recipient').value;
  const message = document.getElementById('message').value;
  const attachment = document.getElementById('attachment').files[0];

  // Create a new message item
  const messageItem = document.createElement('div');
  messageItem.className = 'message-item';

  // Set the recipient and message content
  const recipientHeading = document.createElement('h3');
  recipientHeading.textContent = 'Recipient: ' + recipient;

  const messageContent = document.createElement('p');
  messageContent.textContent = 'Message: ' + message;

  messageItem.appendChild(recipientHeading);
  messageItem.appendChild(messageContent);

  // Check if an attachment is selected
  if (attachment) {
    const attachmentImg = document.createElement('img');
    attachmentImg.src = URL.createObjectURL(attachment);
    attachmentImg.alt = 'Attachment';

    messageItem.appendChild(attachmentImg);
  }

  // Add the new message item to the sent messages display area
  const sentMessages = document.getElementById('sentMessages');
  sentMessages.appendChild(messageItem);

  // Reset the form inputs
  document.getElementById('recipient').value = '';
  document.getElementById('message').value = '';
  document.getElementById('attachment').value = '';
}

// Function to fetch online users from the database
function fetchOnlineUsers(callback) {
  // Replace this with your actual logic to fetch online users from the database
  const onlineUsers = ['User 1', 'User 2', 'User 3'];
  callback(onlineUsers);
}

// Update the recipient options dynamically
document.addEventListener('DOMContentLoaded', function () {
  const recipientSelect = document.getElementById('recipient');

  // Retrieve online users
  fetchOnlineUsers((onlineUsers) => {
    // Populate recipient options with online users
    onlineUsers.forEach(function (user) {
      const option = document.createElement('option');
      option.value = user;
      option.textContent = user;
      recipientSelect.appendChild(option);
    });
  });
});

// Add event listener to handle form submission
const messageForm = document.getElementById('messageForm');
messageForm.addEventListener('submit', handleSubmit);
