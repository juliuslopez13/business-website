// ===== FADE NAVIGATION =====
function navigateWithFade(url) {
    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 350);
}

// ===== LOGIN/REGISTER AUTHENTICATION =====
function switchAuthTab(tab) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active-form');
    });
    
    // Remove active from all tabs
    document.querySelectorAll('.auth-tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
    });
    
    // Show selected form
    const formId = tab + '-form';
    const form = document.getElementById(formId);
    if (form) {
        form.classList.add('active-form');
    }
    
    // Set active tab
    event.target.classList.add('active');
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Store user data
    const userData = { email, isLoggedIn: true, type: 'login' };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    alert(`Welcome back, ${email}!`);
    document.getElementById('loginRegisterSection').style.display = 'none';
    document.querySelector('.payment-methods').style.display = 'block';
}

function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Store user data
    const userData = { name, email, phone, isLoggedIn: true, type: 'register' };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    alert(`Account created successfully!\n\nWelcome, ${name}!`);
    document.getElementById('loginRegisterSection').style.display = 'none';
    document.querySelector('.payment-methods').style.display = 'block';
}

// Initialize authentication on payment page load
function initializePaymentPage() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        // User is already logged in, hide auth section
        const authSection = document.getElementById('loginRegisterSection');
        if (authSection) {
            authSection.style.display = 'none';
        }
    }
}

// Load dark mode preference on page load
window.addEventListener('load', () => {
    setupEventListeners();
    setupDropdowns();
    initializePaymentPage();
});

// ===== DROPDOWN MENUS =====
function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.style.display = 'block';
        });
        
        dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.style.display = 'none';
        });
    });
}

// ===== PAGE NAVIGATION =====
function goToPage(page) {
    const pageIds = ['home-page', 'designs-page', 'payment-page'];
    pageIds.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active-page');
    });

    if (page === 'home') {
        const home = document.getElementById('home-page');
        if (home) {
            home.classList.add('active-page');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else if (page === 'payment') {
        const payment = document.getElementById('payment-page');
        if (payment) {
            payment.classList.add('active-page');
            window.scrollTo(0, 0);
        }
    }
}

// ===== SMOOTH SCROLLING =====
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToAbout() {
    scrollToSection('about');
}

// ===== FORM CALCULATIONS =====
function calculateTotal() {
    const guestCount = parseInt(document.getElementById('guestCount').value) || 0;
    const foodPackage = parseInt(document.getElementById('foodPackage').value) || 0;
    const staffService = document.getElementById('staffService').value;
    
    if (guestCount === 0 || foodPackage === 0) {
        alert('Please fill in all required fields');
        return;
    }
    
    const foodCost = guestCount * foodPackage;
    const staffCost = staffService === 'with-waiters' ? guestCount * 15 : 0;
    const totalCost = foodCost + staffCost;
    
    // Update display
    document.getElementById('foodCost').textContent = foodCost;
    document.getElementById('staffCost').textContent = staffCost;
    document.getElementById('totalPrice').textContent = totalCost;
    
    return { foodCost, staffCost, totalCost };
}

// Update price as user changes form
function setupEventListeners() {
    const inputs = ['guestCount', 'foodPackage', 'staffService'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', calculateTotal);
            element.addEventListener('input', calculateTotal);
        }
    });
}

// ===== BOOKING FORM SUBMISSION =====
function submitBooking(event) {
    event.preventDefault();
    
    const prices = calculateTotal();
    if (!prices) return;
    
    // Store booking data
    const bookingData = {
        eventType: document.getElementById('eventType').value,
        eventDesign: document.getElementById('eventDesign').value,
        staffService: document.getElementById('staffService').value,
        foodPackage: document.getElementById('foodPackage').value,
        guestCount: document.getElementById('guestCount').value,
        eventDate: document.getElementById('eventDate').value,
        eventTime: document.getElementById('eventTime').value,
        eventDuration: document.getElementById('eventDuration').value,
        specialRequests: document.getElementById('specialRequests').value,
        foodCost: prices.foodCost,
        staffCost: prices.staffCost,
        totalCost: prices.totalCost
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Generate order summary
    generateOrderSummary(bookingData);
    
    // Go to payment page
    goToPage('payment');
}

// ===== ORDER SUMMARY =====
function generateOrderSummary(data) {
    const orderDetails = document.getElementById('orderDetails');
    
    const eventTypeMap = {
        'wedding': 'Wedding',
        'corporate': 'Corporate Event',
        'birthday': 'Birthday Party',
        'anniversary': 'Anniversary',
        'graduation': 'Graduation',
        'other': 'Other Event'
    };
    
    const designMap = {
        'classic': 'Classic Elegance',
        'modern': 'Modern Minimalist',
        'rustic': 'Rustic Charm',
        'tropical': 'Tropical Paradise',
        'vintage': 'Vintage Romance',
        'glamorous': 'Glamorous Gold'
    };
    
    const staffMap = {
        'with-waiters': 'With Professional Waiters ($15/person)',
        'self-service': 'Self-Service'
    };
    
    const foodMap = {
        '25': 'Basic Package ($25/person)',
        '50': 'Standard Package ($50/person)',
        '75': 'Premium Package ($75/person)',
        '100': 'Luxury Package ($100/person)'
    };
    
    orderDetails.innerHTML = `
        <p><strong>Event Type:</strong> ${eventTypeMap[data.eventType]}</p>
        <p><strong>Design Theme:</strong> ${designMap[data.eventDesign]}</p>
        <p><strong>Staff Service:</strong> ${staffMap[data.staffService]}</p>
        <p><strong>Food Package:</strong> ${foodMap[data.foodPackage]}</p>
        <p><strong>Number of Guests:</strong> ${data.guestCount}</p>
        <p><strong>Event Date:</strong> ${data.eventDate}</p>
        <p><strong>Event Time:</strong> ${data.eventTime}</p>
        <p><strong>Duration:</strong> ${data.eventDuration} hours</p>
        ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ''}
    `;
    
    document.getElementById('paymentTotal').textContent = data.totalCost;
}

// ===== PAYMENT FORM FUNCTIONS =====
function showPaymentForm(method) {
    // Hide all payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.remove('active-form');
    });
    
    // Show selected payment form
    const formId = method + '-form';
    const form = document.getElementById(formId);
    if (form) {
        form.classList.add('active-form');
    }
}

function completePayment() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const termsAccepted = document.getElementById('termsAccepted').checked;
    
    // Validate required fields
    if (!termsAccepted) {
        alert('Please accept the terms and conditions');
        return;
    }
    
    // Validate card details if credit card selected
    if (paymentMethod === 'credit-card') {
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;
        
        if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
            alert('Please fill in all card details');
            return;
        }
    }
    
    // Show success message
    const bookingData = JSON.parse(localStorage.getItem('bookingData'));
    const userData = JSON.parse(localStorage.getItem('userData'));
    const reservationId = 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    alert(`
Payment Successful!

Reservation ID: ${reservationId}
Payment Method: ${paymentMethod}

Thank you for booking with May's Catering!
We will contact you to confirm your event details.

Event Date: ${bookingData.eventDate}
Total Amount Paid: $${bookingData.totalCost}
    `);
    
    // Reset form
    document.getElementById('bookingForm').reset();
    localStorage.removeItem('bookingData');
    
    // Go back to home
    goToPage('home');
}

// ===== DESIGNS GALLERY FILTER =====
function filterDesigns(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter cards
    document.querySelectorAll('.design-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function scrollToTop() {
    window.scrollTo(0, 0);
}

function toggleMobileMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) {
        nav.classList.toggle('open');
    }
}

// Close menu when a link is clicked (mobile)
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.getElementById('navLinks');
    if (nav) {
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
            });
        });
    }

    handleInitialHash();
});
function handleInitialHash() {
    if (window.location.hash !== '#booking-page') return;
    const booking = document.getElementById('booking-page');
    if (booking) {
        setTimeout(function () {
            booking.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    }
}

function goToHome() {
    const homePage = document.getElementById('home-page');
    if (homePage) {
        goToPage('home');
        if (window.location.hash) {
            const page = window.location.pathname.split('/').pop() || 'index.html';
            history.replaceState(null, '', page);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    navigateWithFade('index.html');
}