// FuelSHOT Complete Functionality Script
// Global state management
let currentUser = null;
let isLoggedIn = false;
let currentSection = 'home';
let orders = [
    {
        id: 'FS-2024-001',
        fuelType: 'Regular Petrol',
        quantity: 15,
        address: '123 Main St',
        date: 'May 15, 2024',
        time: '10:30 AM',
        status: 'delivered'
    },
    {
        id: 'FS-2024-002',
        fuelType: 'Speed Diesel',
        quantity: 20,
        address: '456 Park Ave',
        date: 'May 18, 2024',
        time: '2:45 PM',
        status: 'pending'
    }
];
// Fuel pricing (in Indian Rupees)
const fuelPrices = {
    'petrol': 105.50,
    'diesel': 94.50,
    'speed-petrol': 115.75,
    'speed-diesel': 105.25
};
// DOM Elements
const elements = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    navHome: document.getElementById('navHome'),
    navAbout: document.getElementById('navAbout'),
    navRescue: document.getElementById('navRescue'),
    navLogin: document.getElementById('navLogin'),
    navSignup: document.getElementById('navSignup'),
    
    // User menu
    userIcon: document.getElementById('userIcon'),
    userDropdown: document.getElementById('userDropdown'),
    profileBtn: document.getElementById('profileBtn'),
    ordersBtn: document.getElementById('ordersBtn'),
    customerSupportBtn: document.getElementById('customerSupportBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Content sections
    homeContent: document.getElementById('homeContent'),
    aboutContent: document.getElementById('aboutContent'),
    rescueContent: document.getElementById('rescueContent'),
    loginContent: document.getElementById('loginContent'),
    signupContent: document.getElementById('signupContent'),
    profileInfoContent: document.getElementById('profileInfoContent'),
    ordersPlacedContent: document.getElementById('ordersPlacedContent'),
    customerSupportContent: document.getElementById('customerSupportContent'),
    
    // Hero section
    heroSection: document.querySelector('.hero'),
    
    // Forms
    orderForm: document.getElementById('orderForm'),
    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
    profileForm: document.getElementById('profileForm'),
    
    // Order summary
    orderSummary: document.getElementById('orderSummary'),
    
    // Fuel cards
    fuelCards: document.querySelectorAll('.fuel-card'),
    
    // Mobile menu
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    navMenu: document.getElementById('navMenu'),
    
    // Logo
    logo: document.getElementById('logo'),
    
    // Footer links
    footerLinks: document.querySelectorAll('[id^="footer"]'),
    
    // Links
    signupLink: document.getElementById('signupLink'),
    loginLink: document.getElementById('loginLink'),
    
    // Hero button
    heroBtn: document.querySelector('.btn-hero'),
    
    // Profile elements
    profilePic: document.getElementById('profilePic'),
    profilePicInput: document.getElementById('profilePicInput'),
    profileSaveMessage: document.getElementById('profileSaveMessage')
};
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
    updateUI();
});
// Initialize application
function initializeApp() {
    console.log('FuelSHOT app initialized');
    showSection('home');
    
    // Check if user is logged in (simulate with localStorage)
    const savedUser = localStorage.getItem('fuelshot_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateAuthUI();
    }
}
// Setup event listeners
function setupEventListeners() {
    // Navigation
    elements.navHome?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });
    
    elements.navAbout?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('about');
    });
    
    elements.navRescue?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('rescue');
    });
    
    elements.navLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
    
    elements.navSignup?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('signup');
    });
    
    // User dropdown toggle
    elements.userIcon?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleUserDropdown();
    });
    
    // Dropdown items
    elements.profileBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeUserDropdown();
        showSection('profile');
    });
    
    elements.ordersBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeUserDropdown();
        showSection('orders');
    });
    
    elements.customerSupportBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeUserDropdown();
        showSection('support');
    });
    
    elements.logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeUserDropdown();
        logout();
    });
    
    // Forms
    elements.orderForm?.addEventListener('submit', handleOrderSubmit);
    elements.loginForm?.addEventListener('submit', handleLogin);
    elements.signupForm?.addEventListener('submit', handleSignup);
    elements.profileForm?.addEventListener('submit', handleProfileUpdate);
    
    // Fuel cards
    elements.fuelCards?.forEach(card => {
        card.addEventListener('click', () => selectFuelType(card));
    });
    
    // Mobile menu
    elements.mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
    
    // Logo click
    elements.logo?.addEventListener('click', () => showSection('about'));
    
    // Footer links
    elements.footerLinks?.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.id.replace('footer', '').toLowerCase();
            if (section === 'home') showSection('home');
            else if (section === 'about') showSection('about');
            else if (section === 'rescue') showSection('rescue');
            else if (section === 'support') showSection('support');
        });
    });
    
    // Cross-form links
    elements.signupLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('signup');
    });
    
    elements.loginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
    
    // Hero button
    elements.heroBtn?.addEventListener('click', () => {
        showSection('home');
        document.getElementById('orderForm')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Profile picture
    elements.profilePic?.addEventListener('click', () => {
        elements.profilePicInput?.click();
    });
    
    elements.profilePicInput?.addEventListener('change', handleProfilePicChange);
    
    // Order form real-time updates
    const fuelTypeSelect = document.getElementById('fuelType');
    const quantityInput = document.getElementById('quantity');
    
    fuelTypeSelect?.addEventListener('change', updateOrderSummary);
    quantityInput?.addEventListener('input', updateOrderSummary);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.userDropdown?.contains(e.target) && !elements.userIcon?.contains(e.target)) {
            closeUserDropdown();
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchButton?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}
// Show section
function showSection(section) {
    // Hide all sections
    const sections = [
        'homeContent', 'aboutContent', 'rescueContent', 
        'loginContent', 'signupContent', 'profileInfoContent', 
        'ordersPlacedContent', 'customerSupportContent'
    ];
    
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    });
    
    // Show/hide hero section based on current section
    if (elements.heroSection) {
        if (section === 'home') {
            elements.heroSection.classList.remove('hidden');
        } else {
            elements.heroSection.classList.add('hidden');
        }
    }
    
    // Show target section
    let targetSection;
    switch(section) {
        case 'home':
            targetSection = 'homeContent';
            break;
        case 'about':
            targetSection = 'aboutContent';
            break;
        case 'rescue':
            targetSection = 'rescueContent';
            break;
        case 'login':
            targetSection = 'loginContent';
            break;
        case 'signup':
            targetSection = 'signupContent';
            break;
        case 'profile':
            targetSection = 'profileInfoContent';
            break;
        case 'orders':
            targetSection = 'ordersPlacedContent';
            break;
        case 'support':
            targetSection = 'customerSupportContent';
            break;
        default:
            targetSection = 'homeContent';
    }
    
    const element = document.getElementById(targetSection);
    if (element) {
        element.classList.remove('hidden');
    }
    
    // Update navigation
    updateNavigation(section);
    currentSection = section;
    
    // Close user dropdown
    closeUserDropdown();
    
    // Close mobile menu
    closeMobileMenu();
    
    // Load user data if viewing profile
    if (section === 'profile') {
        loadUserData();
    }
    
    // Update orders list if viewing orders
    if (section === 'orders') {
        updateOrdersList();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// Update navigation active state
function updateNavigation(section) {
    elements.navLinks?.forEach(link => {
        link.classList.remove('active');
    });
    
    switch(section) {
        case 'home':
            elements.navHome?.classList.add('active');
            break;
        case 'about':
            elements.navAbout?.classList.add('active');
            break;
        case 'rescue':
            elements.navRescue?.classList.add('active');
            break;
        case 'login':
            elements.navLogin?.classList.add('active');
            break;
        case 'signup':
            elements.navSignup?.classList.add('active');
            break;
    }
}
// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = elements.userDropdown;
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}
// Close user dropdown
function closeUserDropdown() {
    const dropdown = elements.userDropdown;
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}
// Toggle mobile menu
function toggleMobileMenu() {
    elements.navMenu?.classList.toggle('active');
}
// Close mobile menu
function closeMobileMenu() {
    elements.navMenu?.classList.remove('active');
}
// Handle order form submission
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        fuelType: formData.get('fuelType'),
        quantity: parseInt(formData.get('quantity')),
        address: formData.get('address')
    };
    
    if (!orderData.fuelType || !orderData.quantity || !orderData.address) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    // Create new order
    const newOrder = {
        id: `FS-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
        fuelType: getFuelDisplayName(orderData.fuelType),
        quantity: orderData.quantity,
        address: orderData.address,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        status: 'pending'
    };
    
    orders.unshift(newOrder);
    
    // Calculate total
    const price = fuelPrices[orderData.fuelType] || 0;
    const total = (price * orderData.quantity).toFixed(2);
    
    // Show success message
    showAlert(`Order placed successfully! Order ID: ${newOrder.id}. Total: ₹${total}`, 'success');
    
    // Reset form
    e.target.reset();
    elements.orderSummary.style.display = 'none';
    
    // Update orders if user is viewing orders section
    if (currentSection === 'orders') {
        updateOrdersList();
    }
}
// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('loginEmail');
    const password = formData.get('loginPassword');
    
    if (!email || !password) {
        showAlert('Please enter both email and password.', 'error');
        return;
    }
    
    // Simulate login (in real app, this would be an API call)
    if (email && password) {
        currentUser = {
            name: 'John Doe',
            email: email,
            phone: '+1-555-0123',
            address: '123 Main Street, City, State'
        };
        
        isLoggedIn = true;
        localStorage.setItem('fuelshot_user', JSON.stringify(currentUser));
        
        updateAuthUI();
        showAlert('Login successful! Welcome back.', 'success');
        showSection('home');
        
        // Reset form
        e.target.reset();
    }
}
// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('signupName');
    const email = formData.get('signupEmail');
    const password = formData.get('signupPassword');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = formData.get('agreeTerms');
    
    if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('Please agree to the Terms of Service and Privacy Policy.', 'error');
        return;
    }
    
    // Simulate signup
    currentUser = {
        name: name,
        email: email,
        phone: '',
        address: ''
    };
    
    isLoggedIn = true;
    localStorage.setItem('fuelshot_user', JSON.stringify(currentUser));
    
    updateAuthUI();
    showAlert('Account created successfully! Welcome to FuelSHOT.', 'success');
    showSection('home');
    
    // Reset form
    e.target.reset();
}
// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    if (currentUser) {
        currentUser.name = formData.get('profileNameInput') || currentUser.name;
        currentUser.email = formData.get('profileEmailInput') || currentUser.email;
        currentUser.phone = formData.get('profilePhoneInput') || currentUser.phone;
        currentUser.address = formData.get('profileAddressInput') || currentUser.address;
        
        localStorage.setItem('fuelshot_user', JSON.stringify(currentUser));
        
        // Show success message
        const message = elements.profileSaveMessage;
        if (message) {
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        }
    }
}
// Handle profile picture change
function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profilePic = elements.profilePic;
            if (profilePic) {
                profilePic.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}
// Select fuel type from card
function selectFuelType(card) {
    const fuelType = card.dataset.type;
    const fuelSelect = document.getElementById('fuelType');
    
    if (fuelSelect) {
        fuelSelect.value = fuelType;
        updateOrderSummary();
        
        // Scroll to order form
        elements.orderForm?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Visual feedback
    elements.fuelCards?.forEach(c => c.style.transform = '');
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
        card.style.transform = '';
    }, 200);
}
// Update order summary
function updateOrderSummary() {
    const fuelType = document.getElementById('fuelType')?.value;
    const quantity = parseInt(document.getElementById('quantity')?.value) || 0;
    
    if (fuelType && quantity > 0) {
        const price = fuelPrices[fuelType] || 0;
        const total = (price * quantity).toFixed(2);
        const deliveryFee = 50.00;
        const grandTotal = (parseFloat(total) + deliveryFee).toFixed(2);
        
        const summary = elements.orderSummary;
        if (summary) {
            summary.innerHTML = `
                <h3>Order Summary</h3>
                <p><strong>Fuel Type:</strong> ${getFuelDisplayName(fuelType)}</p>
                <p><strong>Quantity:</strong> ${quantity} liters</p>
                <p><strong>Price per liter:</strong> ₹${price.toFixed(2)}</p>
                <p><strong>Subtotal:</strong> ₹${total}</p>
                <p><strong>Delivery Fee:</strong> ₹${deliveryFee.toFixed(2)}</p>
                <p><strong>Total:</strong> ₹${grandTotal}</p>
                <p><em>Estimated delivery time: 30 minutes</em></p>
            `;
            summary.style.display = 'block';
        }
    } else {
        if (elements.orderSummary) {
            elements.orderSummary.style.display = 'none';
        }
    }
}
// Get fuel display name
function getFuelDisplayName(fuelType) {
    const names = {
        'petrol': 'Regular Petrol',
        'diesel': 'Regular Diesel',
        'speed-petrol': 'Speed Petrol',
        'speed-diesel': 'Speed Diesel'
    };
    return names[fuelType] || fuelType;
}
// Update authentication UI
function updateAuthUI() {
    const loginNav = elements.navLogin;
    const signupNav = elements.navSignup;
    const logoutBtn = elements.logoutBtn;
    const authButtons = document.querySelector('.auth-buttons');
    
    if (isLoggedIn) {
        // Hide login/signup, show logout
        if (loginNav) loginNav.style.display = 'none';
        if (signupNav) signupNav.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (authButtons) authButtons.style.display = 'none';
        
        // Update user icon
        if (elements.userIcon && currentUser) {
            elements.userIcon.innerHTML = currentUser.name.charAt(0).toUpperCase();
            elements.userIcon.title = currentUser.name;
        }
        
        // Create logout button in nav if it doesn't exist
        if (!document.getElementById('navLogoutBtn')) {
            const logoutNavItem = document.createElement('li');
            logoutNavItem.className = 'nav-item';
            logoutNavItem.innerHTML = '<a href="#" class="nav-link" id="navLogoutBtn">Logout</a>';
            
            const navMenu = document.getElementById('navMenu');
            if (navMenu) {
                navMenu.appendChild(logoutNavItem);
                
                // Add event listener to the new logout button
                document.getElementById('navLogoutBtn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        }
    } else {
        // Show login/signup, hide logout
        if (loginNav) loginNav.style.display = 'block';
        if (signupNav) signupNav.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (authButtons) authButtons.style.display = 'flex';
        
        // Reset user icon
        if (elements.userIcon) {
            elements.userIcon.innerHTML = '<i class="fas fa-user"></i>';
            elements.userIcon.title = 'User Menu';
        }
        
        // Remove logout button from nav if it exists
        const navLogoutBtn = document.getElementById('navLogoutBtn');
        if (navLogoutBtn) {
            navLogoutBtn.parentElement.remove();
        }
    }
}
// Logout
function logout() {
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem('fuelshot_user');
    
    updateAuthUI();
    showAlert('You have been logged out successfully.', 'info');
    showSection('home');
}
// Load user data
function loadUserData() {
    if (currentUser && elements.profileForm) {
        document.getElementById('profileNameInput').value = currentUser.name || '';
        document.getElementById('profileEmailInput').value = currentUser.email || '';
        document.getElementById('profilePhoneInput').value = currentUser.phone || '';
        document.getElementById('profileAddressInput').value = currentUser.address || '';
    }
}
// Update orders list
function updateOrdersList() {
    const ordersList = document.querySelector('.orders-list');
    if (ordersList) {
        ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-details">
                    <h4>Order #${order.id}</h4>
                    <p>${order.fuelType} • ${order.quantity} liters • ${order.address}</p>
                    <p>Placed on: ${order.date} • ${order.time}</p>
                </div>
                <div class="order-status status-${order.status}">
                    ${order.status === 'delivered' ? 'Delivered' : 'In Transit'}
                </div>
            </div>
        `).join('');
        
        // Update count
        const orderCount = document.querySelector('.orders-list + .text-center p');
        if (orderCount) {
            orderCount.textContent = `Showing ${orders.length} of ${orders.length} orders`;
        }
    }
}
// Handle search
function handleSearch() {
    const searchTerm = document.querySelector('.search-bar input')?.value.toLowerCase();
    if (searchTerm) {
        // Simple search - show relevant section based on search term
        if (searchTerm.includes('fuel') || searchTerm.includes('petrol') || searchTerm.includes('diesel')) {
            showSection('home');
        } else if (searchTerm.includes('about') || searchTerm.includes('company')) {
            showSection('about');
        } else if (searchTerm.includes('rescue') || searchTerm.includes('emergency')) {
            showSection('rescue');
        } else if (searchTerm.includes('support') || searchTerm.includes('help')) {
            showSection('support');
        } else {
            showAlert(`Search results for "${searchTerm}" - showing home page`, 'info');
            showSection('home');
        }
    }
}
// Update UI
function updateUI() {
    // This function is now handled directly in showSection()
}
// Show alert/notification
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    alert.style.backgroundColor = colors[type] || colors.info;
    
    alert.textContent = message;
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 5000);
}
// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .alert {
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
    }
    
    .alert:hover {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);
// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}
function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(new Date(date));
}
// Console log for debugging
console.log('FuelSHOT functionality loaded successfully!');
// Export functions for external use if needed
window.FuelSHOT = {
    showSection,
    showAlert,
    getCurrentUser: () => currentUser,
    isUserLoggedIn: () => isLoggedIn,
    getOrders: () => orders
};