document.addEventListener('DOMContentLoaded', async () => {
  const deptSelect = document.getElementById('department_id');
  const dashboardContent = document.getElementById('dashboardContent');
  const queueList = document.getElementById('queueList');
  const totalWaiting = document.getElementById('totalWaiting');
  const callNextBtn = document.getElementById('callNextBtn');
  const walkinForm = document.getElementById('walkinForm');
  
  const socket = io();
  let currentDepartmentId = null;

  // Load departments
  try {
    const res = await fetch('/api/departments');
    const departments = await res.json();
    departments.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.department_id;
      opt.textContent = d.name;
      deptSelect.appendChild(opt);
    });
  } catch (err) {
    console.error('Failed to load departments');
  }

  // Handle department selection
  deptSelect.addEventListener('change', (e) => {
    currentDepartmentId = e.target.value;
    if (currentDepartmentId) {
      dashboardContent.style.display = 'grid';
      fetchQueue();
    } else {
      dashboardContent.style.display = 'none';
    }
  });

  async function fetchQueue() {
    if (!currentDepartmentId) return;
    try {
      const res = await fetch(`/api/queue/${currentDepartmentId}`);
      const queue = await res.json();
      
      totalWaiting.textContent = queue.length;
      queueList.innerHTML = queue.map(t => `
        <li class="queue-item ${t.queue_type === 'emergency' ? 'emergency' : ''}">
          <div>
            <strong>Token ${t.display_token || t.token_id}</strong> - ${t.name} <br>
            <small style="color: var(--text-muted)">${t.queue_type.toUpperCase()} | ${t.service_type}</small>
          </div>
          <div>${t.expected_duration} min</div>
        </li>
      `).join('');
    } catch (err) {
      console.error(err);
    }
  }

  socket.on('queueUpdated', (data) => {
    if (currentDepartmentId && data.department_id === parseInt(currentDepartmentId)) {
      fetchQueue();
    }
  });

  // Call next
  callNextBtn.addEventListener('click', async () => {
    if (!currentDepartmentId) return;
    try {
      callNextBtn.disabled = true;
      const res = await fetch(`/api/next/${currentDepartmentId}`, { method: 'POST' });
      const data = await res.json();
      
      if (data.token_id) {
        document.getElementById('calledVisitor').style.display = 'block';
        document.getElementById('calledTokenId').textContent = data.display_token || data.token_id;
        document.getElementById('calledName').textContent = data.name;
      } else {
        alert(data.message || 'Queue is empty');
      }
    } catch (err) {
      console.error(err);
    } finally {
      callNextBtn.disabled = false;
    }
  });

  // Walk-in form
  walkinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentDepartmentId) return alert('Select department first');

    const payload = {
      name: document.getElementById('w_name').value,
      age: parseInt(document.getElementById('w_age').value),
      department_id: currentDepartmentId,
      reason: document.getElementById('w_reason').value,
      service_type: document.getElementById('w_service_type').value,
      queue_type: document.getElementById('w_queue_type').value,
    };

    try {
      const res = await fetch('/api/walkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Walk-in registered successfully');
        walkinForm.reset();
      }
    } catch (err) {
      console.error(err);
    }
  });
});
