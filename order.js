// ===== WHATSAPP NUMBER =====
const WA_NUMBER = '923151210262';

// ===== PAYMENT TOGGLE =====
function togglePayment() {
  const online = document.getElementById('onlineRadio').checked;
  const details = document.getElementById('onlinePayDetails');
  const codLabel = document.getElementById('codLabel');
  const onlineLabel = document.getElementById('onlineLabel');

  if (online) {
    details.classList.remove('hidden');
    onlineLabel.classList.add('active');
    codLabel.classList.remove('active');
  } else {
    details.classList.add('hidden');
    codLabel.classList.add('active');
    onlineLabel.classList.remove('active');
  }
}

// ===== ADD ITEM ROW =====
let rowIndex = 1;
function addItemRow() {
  rowIndex++;
  const container = document.getElementById('orderItems');
  const div = document.createElement('div');
  div.className = 'order-item-row';
  div.dataset.index = rowIndex;
  div.innerHTML = `
    <div class="item-row-inner">
      <div class="form-group item-select-group">
        <label>Item <span class="req">*</span></label>
        <select class="item-select" onchange="updateSummary()">
          <option value="" data-price="0">-- Select Item --</option>
          <optgroup label="🍽 Hyderabadi Biryani">
            <option value="Hyderabadi Pulao Single (1 پاؤ)" data-price="200">Hyderabadi Pulao Single – Rs. 200</option>
            <option value="Hyderabadi Pulao Medium (1.5 پاؤ)" data-price="300">Hyderabadi Pulao Medium – Rs. 300</option>
            <option value="Hyderabadi Pulao Full (آدھا کلو)" data-price="350">Hyderabadi Pulao Full – Rs. 350</option>
            <option value="Hyderabadi Pulao Full 2 (آدھا کلو)" data-price="400">Hyderabadi Pulao Full 2 – Rs. 400</option>
            <option value="Hyderabadi Pulao Special 2 (آدھا کلو)" data-price="450">Hyderabadi Pulao Special 2 – Rs. 450</option>
          </optgroup>
          <optgroup label="🍗 Chicken Biryani">
            <option value="Chicken Biryani Single (1 پاؤ)" data-price="180">Chicken Biryani Single – Rs. 180</option>
            <option value="Chicken Biryani Medium (1.5 پاؤ)" data-price="250">Chicken Biryani Medium – Rs. 250</option>
            <option value="Chicken Biryani Full 1 (آدھا کلو)" data-price="290">Chicken Biryani Full 1 – Rs. 290</option>
            <option value="Chicken Biryani Full 2 (آدھا کلو)" data-price="340">Chicken Biryani Full 2 – Rs. 340</option>
            <option value="Chicken Biryani Special 2 (آدھا کلو)" data-price="430">Chicken Biryani Special 2 – Rs. 430</option>
          </optgroup>
          <optgroup label="🍚 Simple / Pulao">
            <option value="Saada Biryani Single (1 پاؤ)" data-price="130">Saada Biryani Single – Rs. 130</option>
            <option value="Saada Biryani Medium (1.5 پاؤ)" data-price="190">Saada Biryani Medium – Rs. 190</option>
            <option value="Saada Biryani Full (آدھا کلو)" data-price="250">Saada Biryani Full – Rs. 250</option>
            <option value="Saada Biryani Special (آدھا کلو)" data-price="320">Saada Biryani Special – Rs. 320</option>
            <option value="Saada Pulao Single (1 پاؤ)" data-price="150">Saada Pulao Single – Rs. 150</option>
            <option value="Saada Pulao Medium (1.5 پاؤ)" data-price="220">Saada Pulao Medium – Rs. 220</option>
            <option value="Saada Pulao Full (آدھا کلو)" data-price="280">Saada Pulao Full – Rs. 280</option>
          </optgroup>
          <optgroup label="🥘 Haleem">
            <option value="Haleem Single" data-price="150">Haleem Single – Rs. 150</option>
            <option value="Haleem Full" data-price="250">Haleem Full – Rs. 250</option>
          </optgroup>
          <optgroup label="🥤 Drinks & Extras">
            <option value="Cold Drink Regular" data-price="60">Cold Drink Regular – Rs. 60</option>
            <option value="Sting Regular" data-price="70">Sting Regular – Rs. 70</option>
            <option value="Raita (راشتہ)" data-price="30">Raita – Rs. 30</option>
            <option value="Salad (سلاد)" data-price="30">Salad – Rs. 30</option>
            <option value="Box Packing (باکس پیکنگ)" data-price="20">Box Packing – Rs. 20</option>
            <option value="Shami Kabab (شامی کباب)" data-price="50">Shami Kabab – Rs. 50</option>
          </optgroup>
        </select>
      </div>
      <div class="form-group qty-group">
        <label>Qty</label>
        <div class="qty-ctrl">
          <button type="button" class="qty-btn minus" onclick="changeQty(this, -1)">−</button>
          <input type="number" class="qty-input" value="1" min="1" max="20" onchange="updateSummary()" />
          <button type="button" class="qty-btn plus" onclick="changeQty(this, 1)">+</button>
        </div>
      </div>
      <button type="button" class="remove-row-btn" onclick="removeRow(this)" title="Remove">✕</button>
    </div>
  `;
  container.appendChild(div);
  updateSummary();
}

function removeRow(btn) {
  const rows = document.querySelectorAll('.order-item-row');
  if (rows.length <= 1) return; // Keep at least 1 row
  btn.closest('.order-item-row').remove();
  updateSummary();
}

function changeQty(btn, delta) {
  const input = btn.parentElement.querySelector('.qty-input');
  let val = parseInt(input.value) || 1;
  val = Math.max(1, Math.min(20, val + delta));
  input.value = val;
  updateSummary();
}

// ===== UPDATE ORDER SUMMARY =====
function updateSummary() {
  const rows = document.querySelectorAll('.order-item-row');
  const summaryItems = document.getElementById('summaryItems');
  const totalEl = document.getElementById('summaryTotal');
  let total = 0;
  let html = '';
  let hasItems = false;

  rows.forEach(row => {
    const sel = row.querySelector('.item-select');
    const qtyInput = row.querySelector('.qty-input');
    if (!sel || !qtyInput) return;
    const selected = sel.options[sel.selectedIndex];
    const name = selected.value;
    const price = parseInt(selected.dataset.price) || 0;
    const qty = parseInt(qtyInput.value) || 1;

    if (name && price > 0) {
      hasItems = true;
      const lineTotal = price * qty;
      total += lineTotal;
      html += `
        <div class="summary-item">
          <div>
            <div class="summary-item-name">${name}</div>
            <div class="summary-item-qty">x${qty} × Rs.${price}</div>
          </div>
          <div class="summary-item-price">Rs.${lineTotal}</div>
        </div>
      `;
    }
  });

  if (!hasItems) {
    summaryItems.innerHTML = '<div class="summary-empty">No items added yet.<br>Select items from the form.</div>';
  } else {
    summaryItems.innerHTML = html;
  }
  totalEl.textContent = `Rs. ${total.toLocaleString()}`;
}

// ===== GEOLOCATION =====
function getLocation() {
  const btn = document.getElementById('locBtnText');
  const status = document.getElementById('locationStatus');
  btn.textContent = '⏳ Getting location...';

  if (!navigator.geolocation) {
    status.textContent = '❌ Geolocation not supported by your browser';
    status.className = 'location-status error';
    btn.textContent = '📡 Use My Location';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      const addressField = document.getElementById('address');
      const currentAddr = addressField.value;
      if (!currentAddr) {
        addressField.value = `Near: ${lat}, ${lng} (Islamabad)`;
      }
      status.textContent = `✅ Location captured: ${lat}, ${lng}`;
      status.className = 'location-status success';
      btn.textContent = '✅ Location Set';
    },
    (err) => {
      status.textContent = `❌ Could not get location: ${err.message}`;
      status.className = 'location-status error';
      btn.textContent = '📡 Use My Location';
    }
  );
}

// ===== FORM VALIDATION =====
function showError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) field.classList.add('error');
  if (err) err.classList.add('visible');
}
function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) field.classList.remove('error');
  if (err) err.classList.remove('visible');
}

['fullName', 'phone', 'address'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id, 'err-' + id));
});

// ===== FORM SUBMIT =====
document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  // Validate name
  const name = document.getElementById('fullName').value.trim();
  if (!name) { showError('fullName', 'err-fullName'); valid = false; } else clearError('fullName', 'err-fullName');

  // Validate phone
  const phone = document.getElementById('phone').value.trim();
  if (!phone || phone.length < 10) { showError('phone', 'err-phone'); valid = false; } else clearError('phone', 'err-phone');

  // Validate address
  const address = document.getElementById('address').value.trim();
  if (!address) { showError('address', 'err-address'); valid = false; } else clearError('address', 'err-address');

  // Validate items
  const rows = document.querySelectorAll('.order-item-row');
  let hasValidItem = false;
  rows.forEach(row => {
    const sel = row.querySelector('.item-select');
    if (sel && sel.value) hasValidItem = true;
  });
  if (!hasValidItem) {
    alert('Please select at least one item to order.');
    valid = false;
  }

  // Validate online payment
  const isOnline = document.getElementById('onlineRadio').checked;
  if (isOnline) {
    const txnId = document.getElementById('transactionId').value.trim();
    if (!txnId) {
      showError('transactionId', 'err-transactionId');
      valid = false;
    } else {
      clearError('transactionId', 'err-transactionId');
    }
  }

  if (!valid) return;

  // Build order message
  const altPhone = document.getElementById('altPhone').value.trim();
  const city = document.getElementById('city').value.trim() || 'Islamabad';
  const instructions = document.getElementById('specialInstructions').value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  let itemLines = '';
  let total = 0;
  rows.forEach((row, i) => {
    const sel = row.querySelector('.item-select');
    const qtyInput = row.querySelector('.qty-input');
    if (!sel || !qtyInput) return;
    const selected = sel.options[sel.selectedIndex];
    const itemName = selected.value;
    const price = parseInt(selected.dataset.price) || 0;
    const qty = parseInt(qtyInput.value) || 1;
    if (itemName && price > 0) {
      const lineTotal = price * qty;
      total += lineTotal;
      itemLines += `  ${i + 1}. ${itemName} x${qty} = Rs.${lineTotal}\n`;
    }
  });

  let paymentLine = paymentMethod;
  if (isOnline) {
    const method = document.querySelector('input[name="onlineMethod"]:checked').value;
    const txnId = document.getElementById('transactionId').value.trim();
    paymentLine = `${paymentMethod} (${method}) — TXN ID: ${txnId}`;
  }

  const message =
`🍛 *NEW ORDER — Karachi Haideri Biryani* 🍛
━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${name}
📞 *Phone:* ${phone}${altPhone ? `\n📱 *Alt Phone:* ${altPhone}` : ''}

🛒 *Order Items:*
${itemLines}
💰 *Total: Rs. ${total.toLocaleString()}*
━━━━━━━━━━━━━━━━━━━━━━
📍 *Delivery Address:*
${address}, ${city}

💳 *Payment:* ${paymentLine}
${instructions ? `\n📝 *Special Instructions:* ${instructions}` : ''}
━━━━━━━━━━━━━━━━━━━━━━
✅ Please confirm & share ETA. Shukriya! 🙏`;

  // Show modal
  const modal = document.getElementById('successModal');
  modal.classList.add('show');

  // After 2 seconds redirect to WhatsApp
  setTimeout(() => {
    const encoded = encodeURIComponent(message);
    window.location.href = `https://wa.me/${WA_NUMBER}?text=${encoded}`;
    modal.classList.remove('show');
  }, 2000);
});

// ===== INIT =====
updateSummary();
