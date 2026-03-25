// ============================================================
//  FORM PATCH — form-connect.js
//
//  HOW TO USE:
//  Add this ONE line inside your index.html, just before </body>:
//
//    <script src="form-connect.js"></script>
//
//  That's it. This file overrides only the form submit handler
//  to send data to your backend. Nothing else changes.
// ============================================================

window.handleFormSubmit = async function(e) {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const btn     = e.target.querySelector('button[type=submit]');
  const success = document.getElementById('form-success');

  btn.innerHTML  = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled   = true;

  try {
    const res  = await fetch('/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, message }),
    });
    const data = await res.json();

    if (data.success) {
      btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      btn.disabled  = false;
      success.textContent = '✓ Message sent! I\'ll get back to you soon.';
      success.classList.add('show');
      e.target.reset();
      setTimeout(() => success.classList.remove('show'), 4000);
    } else {
      throw new Error(data.error || 'Unknown error');
    }
  } catch (err) {
    btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
    btn.disabled  = false;
    success.style.color   = '#ff4d4d';
    success.style.background = 'rgba(255,77,77,0.08)';
    success.style.borderColor = 'rgba(255,77,77,0.3)';
    success.textContent   = '✗ Failed to send. Please try again.';
    success.classList.add('show');
    setTimeout(() => {
      success.classList.remove('show');
      success.style.color = '';
      success.style.background = '';
      success.style.borderColor = '';
    }, 4000);
    console.error('Form error:', err.message);
  }
};
