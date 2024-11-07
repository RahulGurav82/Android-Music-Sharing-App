window.onload = function() {
    // URL of the server (your deployed server URL)
    const apiUrl = 'https://android-music-sharing-app.onrender.com/api/contacts';

    // Fetch contacts from the server
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Get the table body element
            const tableBody = document.querySelector('#contactsTable tbody');

            // Loop through the contacts and add them to the table
            data.contacts.forEach(contact => {
                const row = document.createElement('tr');

                // Create table cells for each contact field
                const nameCell = document.createElement('td');
                nameCell.textContent = contact.name;

                const phoneCell = document.createElement('td');
                phoneCell.textContent = contact.phone;

                // Append cells to the row
                row.appendChild(nameCell);
                row.appendChild(phoneCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching contacts:', error);
        });
};
