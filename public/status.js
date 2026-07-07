document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenId = urlParams.get('token_id');

  if (!tokenId) {
    alert('No token ID provided.');
    return;
  }

  const socket = io();
  let departmentId = null;

  async function fetchStatus() {
    try {
      const res = await fetch(`/api/status/${tokenId}`);
      if (!res.ok) {
        document.getElementById('loadingContainer').innerHTML = '<div class="header"><h2>Token not found</h2></div>';
        return;
      }
      const data = await res.json();
      
      document.getElementById('loadingContainer').style.display = 'none';
      document.getElementById('statusContainer').style.display = 'block';
      
      document.getElementById('tokenName').textContent = `Hi, ${data.token.name}`;
      document.getElementById('tokenId').textContent = data.token.display_token || data.token.token_id;
      document.getElementById('peopleAhead').textContent = data.people_ahead;
      document.getElementById('estWait').textContent = data.estimated_wait_mins + ' min';
      document.getElementById('currentStatus').textContent = 'Status: ' + data.token.status.toUpperCase();
      
      departmentId = data.token.department_id;
    } catch (err) {
      console.error(err);
    }
  }

  // Initial fetch
  await fetchStatus();

  // Listen for queue updates
  socket.on('queueUpdated', (data) => {
    if (departmentId && data.department_id === departmentId) {
      fetchStatus(); // re-fetch if our department updated
    }
  });
});
