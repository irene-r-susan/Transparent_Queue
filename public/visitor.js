document.addEventListener('DOMContentLoaded', async () => {
  const deptSelect = document.getElementById('department_id');
  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');

  try {
    const res = await fetch('/api/departments');
    const departments = await res.json();
    deptSelect.innerHTML = departments.map(d => `<option value="${d.department_id}">${d.name}</option>`).join('');
  } catch (err) {
    deptSelect.innerHTML = '<option value="">Error loading departments</option>';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;

    const payload = {
      name: document.getElementById('name').value,
      age: parseInt(document.getElementById('age').value),
      department_id: parseInt(document.getElementById('department_id').value),
      reason: document.getElementById('reason').value,
      service_type: document.getElementById('service_type').value,
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.token_id) {
        window.location.href = `/status.html?token_id=${data.token_id}`;
      } else {
        alert('Failed to book appointment.');
        submitBtn.textContent = 'Book Appointment';
        submitBtn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
      submitBtn.textContent = 'Book Appointment';
      submitBtn.disabled = false;
    }
  });
});
