/* ==========================================================================
   VILI SALON SPA & TATTOO STUDIO - INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLiveHoursStatus();
  initServiceFilter();
  initMobileDrawer();
  initDatePicker();
  initCopyrightYear();
});

/* 1. Live Operating Hours Calculator */
function initLiveHoursStatus() {
  const statusEl = document.getElementById('live-status-text');
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hour + minutes / 60;

  let isOpen = false;
  let todayHoursText = '';

  if (day === 0) {
    // Sunday: 7:00 AM – 10:00 PM
    isOpen = currentTime >= 7 && currentTime < 22;
    todayHoursText = 'Sunday: 7:00 AM – 10:00 PM';
  } else if (day === 1 || day === 2) {
    // Mon & Tue: 6:00 AM – 10:00 PM
    isOpen = currentTime >= 6 && currentTime < 22;
    todayHoursText = `${day === 1 ? 'Monday' : 'Tuesday'}: 6:00 AM – 10:00 PM`;
  } else {
    // Wed to Sat: 6:00 AM – 9:00 PM
    const daysName = ['Sun', 'Mon', 'Tue', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    isOpen = currentTime >= 6 && currentTime < 21;
    todayHoursText = `${daysName[day]}: 6:00 AM – 9:00 PM`;
  }

  if (isOpen) {
    statusEl.innerHTML = `<span style="color: #4ade80; font-weight: 700;">🟢 Open Now</span> &bull; Today (${todayHoursText})`;
  } else {
    statusEl.innerHTML = `<span style="color: #f87171; font-weight: 700;">🔴 Closed Now</span> &bull; Today's Hours: ${todayHoursText}`;
  }
}

/* 2. Service Category Tabs Filter */
function initServiceFilter() {
  const tabs = document.querySelectorAll('.service-category-tabs .tab-btn');
  const cards = document.querySelectorAll('.services-grid .service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const category = tab.getAttribute('data-category');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 3. Mobile Navigation Drawer */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-link, .drawer-action-btn');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => drawer.classList.add('open');
  const closeDrawer = () => drawer.classList.remove('open');

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close when tapping outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* 4. Minimum date for appointment picker */
function initDatePicker() {
  const dateInput = document.getElementById('client-date');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;
}

/* 5. Copyright Year Auto-update */
function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* 6. Prefill Appointment Service Helper */
function prefillBooking(serviceName) {
  const select = document.getElementById('client-service');
  const bookingSec = document.getElementById('booking');

  if (select) {
    // Try finding direct or partial match in options
    let matched = false;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase().split(' ')[0])) {
        select.selectedIndex = i;
        matched = true;
        break;
      }
    }
    if (!matched) {
      select.value = "General Beauty Consultation";
    }
  }

  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: 'smooth' });
  }
}

/* 7. WhatsApp Appointment Form Submission */
function handleBookingSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const service = document.getElementById('client-service').value;
  const date = document.getElementById('client-date').value;
  const time = document.getElementById('client-time').value;
  const notes = document.getElementById('client-notes').value.trim();

  if (!name || !phone || !service || !date || !time) {
    alert('Please fill out all required fields marked with *');
    return;
  }

  // Format lovely WhatsApp text message
  let message = `✨ *APPOINTMENT / INQUIRY - VILI SALON SPA & TATTOO STUDIO* ✨\n`;
  message += `(விழி அழகாலயம், Vaniyambadi)\n\n`;
  message += `👤 *Client Name:* ${name}\n`;
  message += `📞 *Phone:* ${phone}\n`;
  message += `💆 *Selected Service:* ${service}\n`;
  message += `📅 *Preferred Date:* ${date}\n`;
  message += `⏰ *Time Slot:* ${time}\n`;
  if (notes) {
    message += `📝 *Notes/Requirements:* ${notes}\n`;
  }
  message += `\n📍 *Studio:* Jamethar St, Opp. Islamiah Women's College, Vaniyambadi\n`;
  message += `_Sent via Vili Salon Web Portal_`;

  const salonNumber = '919500860063';
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${salonNumber}&text=${encodedMsg}`;

  // Open WhatsApp directly
  window.open(whatsappUrl, '_blank');
}

/* 8. Tattoo Lightbox Modal */
let currentTattooTitle = '';

function openLightbox(imgSrc, title, description) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');

  if (!modal || !img) return;

  img.src = imgSrc;
  titleEl.textContent = title;
  descEl.textContent = description;
  currentTattooTitle = title;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function bookThisTattoo() {
  closeLightbox();
  const select = document.getElementById('client-service');
  const notes = document.getElementById('client-notes');
  if (select) {
    select.value = "Custom Permanent Tattoo (By Rajesh)";
  }
  if (notes && currentTattooTitle) {
    notes.value = `Inquiring about tattoo style: ${currentTattooTitle}`;
  }
  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: 'smooth' });
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

/* 9. FAQ Accordion Toggle */
function toggleFaq(button) {
  const item = button.closest('.faq-item');
  if (!item) return;

  const isActive = item.classList.contains('active');

  // Close all other items
  document.querySelectorAll('.faq-item').forEach(el => {
    el.classList.remove('active');
  });

  if (!isActive) {
    item.classList.add('active');
  }
}

/* 10. Copy Address Toast Notification */
function copyAddress(btn) {
  const addressText = "No. 49, 50 Jamethar Street, Islamiya College Road (Opposite Islamiah Women’s Arts & Science College), near Sri Puthu Mariyamman Kovil, Gandhinagar, New Town, Vaniyambadi, Tamil Nadu 635752";
  
  navigator.clipboard.writeText(addressText).then(() => {
    showToast("📍 Address copied to clipboard!");
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    }
  }).catch(() => {
    showToast("📍 Address copied!");
  });
}

function showToast(text) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
