// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navbar = document.querySelector('.navbar');

    mobileToggle.addEventListener('click', function () {
        navbar.classList.toggle('nav-mobile-active');
    });

    // Dropdown functionality for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });

    // Tab System for Categories
    initializeCategoryTabs();

    // Product Carousel
    initializeCarousel();

    // Modal functionality
    initializeModal();

    // WhatsApp and Call buttons
    initializeContactButtons();

    // Newsletter form
    initializeNewsletter();

    // Smooth scrolling for anchor links
    initializeSmoothScroll();

    // Lazy loading
    initializeLazyLoading();

    // Category filter functionality
    initializeCategoryFilters();
});

// Category Tabs System
function initializeCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Enhanced Carousel Functionality
function initializeCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    const productCards = document.querySelectorAll('.product-card');

    if (!carouselTrack) return;

    let currentPosition = 0;
    const cardWidth = productCards[0].offsetWidth + 32; // width + gap
    const visibleCards = Math.floor(carouselTrack.parentElement.offsetWidth / cardWidth);
    const maxPosition = carouselTrack.scrollWidth - carouselTrack.parentElement.offsetWidth;

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentPosition}px)`;
        updateNavButtons();
    }

    function updateNavButtons() {
        prevButton.style.opacity = currentPosition <= 0 ? '0.5' : '1';
        nextButton.style.opacity = currentPosition >= maxPosition ? '0.5' : '1';
        prevButton.disabled = currentPosition <= 0;
        nextButton.disabled = currentPosition >= maxPosition;
    }

    nextButton.addEventListener('click', function () {
        currentPosition = Math.min(currentPosition + cardWidth * visibleCards, maxPosition);
        updateCarousel();
    });

    prevButton.addEventListener('click', function () {
        currentPosition = Math.max(currentPosition - cardWidth * visibleCards, 0);
        updateCarousel();
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let currentX = 0;

    carouselTrack.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    });

    carouselTrack.addEventListener('touchmove', function (e) {
        currentX = e.touches[0].clientX;
    });

    carouselTrack.addEventListener('touchend', function () {
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                // Swipe left - next
                currentPosition = Math.min(currentPosition + cardWidth * visibleCards, maxPosition);
            } else {
                // Swipe right - previous
                currentPosition = Math.max(currentPosition - cardWidth * visibleCards, 0);
            }
            updateCarousel();
        }
    });

    // Auto-advance carousel (optional)
    let autoAdvance = setInterval(() => {
        if (currentPosition >= maxPosition) {
            currentPosition = 0;
        } else {
            currentPosition = Math.min(currentPosition + cardWidth * visibleCards, maxPosition);
        }
        updateCarousel();
    }, 5000);

    // Pause auto-advance on hover
    carouselTrack.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    carouselTrack.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => {
            if (currentPosition >= maxPosition) {
                currentPosition = 0;
            } else {
                currentPosition = Math.min(currentPosition + cardWidth * visibleCards, maxPosition);
            }
            updateCarousel();
        }, 5000);
    });

    updateNavButtons();
}

// Enhanced Modal Functionality
function initializeModal() {
    const modal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');
    const viewDetailsButtons = document.querySelectorAll('.view-details');

    if (!modal) return;

    // Enhanced product data for wooden doors
    const products = {
        'royal-teak-entrance-door': {
            title: 'Royal Teak Entrance Door',
            description: 'Premium Burma Teak main entrance door with intricate hand carvings and superior finish. Perfect for luxury homes seeking traditional elegance with modern security features.',
            specs: [
                'Wood Type: Burma Teak',
                'Usage: Main Entrance',
                'Design: Hand Carved Traditional',
                'Thickness: 45mm',
                'Size Options: 3\'x7\', 3.5\'x7\', 4\'x7\'',
                'Finish Options: Matte, Gloss, Natural Polish',
                'Security: Multi-point locking system',
                'Warranty: 10 years'
            ],
            price: '₹45,000 - ₹65,000',
            features: ['Termite Resistant', 'Weather Proof', 'Custom Carvings Available', 'Quick Installation']
        },
        'sheesham-carved-door': {
            title: 'Sheesham Carved Door',
            description: 'Elegant Sheesham wood door with traditional Indian carvings. Known for its durability and rich grain patterns that add warmth to any entrance.',
            specs: [
                'Wood Type: Solid Sheesham',
                'Usage: Main Entrance/Bedroom',
                'Design: Traditional Carved',
                'Thickness: 40mm',
                'Size Options: 2.5\'x7\', 3\'x7\', 3.5\'x7\'',
                'Finish Options: Natural, Dark Walnut, Honey',
                'Security: Standard locking system',
                'Warranty: 7 years'
            ],
            price: '₹38,500 - ₹52,000',
            features: ['Natural Grain Patterns', 'High Durability', 'Eco-friendly', 'Easy Maintenance']
        },
        'modern-sagwan-door': {
            title: 'Modern Sagwan Door',
            description: 'Contemporary Sagwan wood door with minimalist design. Perfect for modern homes and offices seeking clean lines and natural wood beauty.',
            specs: [
                'Wood Type: Sagwan Wood',
                'Usage: Living Room/Office',
                'Design: Modern Minimal',
                'Thickness: 35mm',
                'Size Options: 2\'x7\', 2.5\'x7\', 3\'x7\'',
                'Finish Options: Matte, Satin, Natural',
                'Security: Modern handle with lock',
                'Warranty: 5 years'
            ],
            price: '₹32,000 - ₹45,000',
            features: ['Light Weight', 'Modern Design', 'Cost Effective', 'Quick Delivery']
        }
    };

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
            const productImage = productCard.querySelector('img').src;
            const productPrice = productCard.querySelector('.price').textContent;
            
            const product = products[productName] || {
                title: productCard.querySelector('h3').textContent,
                description: 'Premium quality wooden door crafted with attention to detail and superior materials. Customization options available.',
                specs: [
                    'Wood Type: Premium Hardwood',
                    'Usage: Multi-purpose',
                    'Design: Customizable',
                    'Thickness: 35-45mm',
                    'Size Options: Custom Sizes Available',
                    'Finish Options: Multiple Finishes',
                    'Warranty: Standard 5 years'
                ],
                price: productPrice,
                features: ['Custom Design', 'Quality Assurance', 'Timely Delivery', 'Installation Support']
            };

            // Populate modal with product data
            document.getElementById('modal-title').textContent = product.title;
            document.getElementById('modal-description').textContent = product.description;
            document.getElementById('modal-price').textContent = product.price;

            const specsList = document.getElementById('modal-specs-list');
            specsList.innerHTML = '';
            product.specs.forEach(spec => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${spec}`;
                specsList.appendChild(li);
            });

            const featuresList = document.getElementById('modal-features-list');
            featuresList.innerHTML = '';
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-star"></i> ${feature}`;
                featuresList.appendChild(li);
            });

            // Set product image
            const modalImage = document.querySelector('.modal-image img');
            modalImage.src = productImage;
            modalImage.alt = product.title;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// WhatsApp and Call Buttons
function initializeContactButtons() {
    // WhatsApp buttons
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.closest('.product-info') ? 
                this.closest('.product-info').querySelector('h1').textContent : 
                'Wooden Door Inquiry';
            
            const message = `Hello Shree Doors! I'm interested in ${productName}. Please share more details and pricing.`;
            const phoneNumber = '+919876543210'; // Replace with actual number
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappURL, '_blank');
        });
    });

    // Call buttons
    const callButtons = document.querySelectorAll('.btn-call');
    callButtons.forEach(button => {
        button.addEventListener('click', function () {
            const phoneNumber = '+919876543210'; // Replace with actual number
            window.location.href = `tel:${phoneNumber}`;
        });
    });

    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        if (button.href.includes('contact.html')) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                // Track CTA click for analytics
                console.log('CTA clicked:', this.textContent);
                window.location.href = 'contact.html';
            });
        }
    });
}

// Newsletter Form
function initializeNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!this.validateEmail(email)) {
                this.showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate API call
            this.showMessage('Subscribing...', 'loading');
            
            setTimeout(() => {
                this.showMessage('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
                
                // Reset form after success
                setTimeout(() => {
                    this.querySelector('.newsletter-message')?.remove();
                }, 3000);
            }, 1000);
        });
    });
}

// Email validation helper
HTMLFormElement.prototype.validateEmail = function (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Message display helper
HTMLFormElement.prototype.showMessage = function (message, type) {
    // Remove existing messages
    this.querySelector('.newsletter-message')?.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        margin-top: 10px;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
        ${type === 'error' ? 'background: #ffebee; color: #c62828;' : ''}
        ${type === 'success' ? 'background: #e8f5e8; color: #2e7d32;' : ''}
        ${type === 'loading' ? 'background: #e3f2fd; color: #1565c0;' : ''}
    `;
    
    this.appendChild(messageDiv);
};

// Smooth Scrolling
function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Category Filters
function initializeCategoryFilters() {
    const filterSelects = document.querySelectorAll('#woodTypeFilter, #usageFilter, #designFilter');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function () {
            // In real implementation, this would filter products
            console.log('Filter changed:', this.id, this.value);
            applyCategoryFilters();
        });
    });
}

function applyCategoryFilters() {
    const woodType = document.getElementById('woodTypeFilter')?.value;
    const usage = document.getElementById('usageFilter')?.value;
    const design = document.getElementById('designFilter')?.value;
    
    // Show loading state
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div class="loading" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <i class="fas fa-spinner fa-spin"></i> Loading filtered products...
            </div>
        `;
        
        // Simulate API call
        setTimeout(() => {
            loadFilteredProducts(woodType, usage, design);
        }, 800);
    }
}

function loadFilteredProducts(woodType, usage, design) {
    const productsGrid = document.querySelector('.products-grid');
    
    // Sample filtered products - in real app, this comes from backend
    const filteredProducts = [
        {
            name: 'Filtered Teak Door',
            image: 'images/main-doors/filtered-1.jpg',
            price: '₹42,000',
            category: 'Teak Wood | Main Entrance'
        },
        {
            name: 'Modern Sheesham Door',
            image: 'images/main-doors/filtered-2.jpg',
            price: '₹35,000',
            category: 'Sheesham Wood | Modern'
        }
    ];
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p class="category">${product.category}</p>
            <p class="price">${product.price}</p>
            <button class="view-details">View Details</button>
        </div>
    `).join('');
    
    // Re-initialize modal for new products
    initializeModal();
}

// Enhanced Lazy Loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    
                    // Load image
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    
                    // Load background image
                    if (lazyImage.dataset.bg) {
                        lazyImage.style.backgroundImage = `url(${lazyImage.dataset.bg})`;
                    }
                    
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        // Observe images with data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });

        // Observe elements with data-bg (for background images)
        const lazyBackgrounds = document.querySelectorAll('[data-bg]');
        lazyBackgrounds.forEach(function (lazyBackground) {
            lazyImageObserver.observe(lazyBackground);
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function (lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
        });
    }
}

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Lazy load images when they come into view
        initializeLazyLoading();
    }, 100);
});

// Add loading animation for better UX
function showLoadingAnimation(element) {
    element.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading...</span>
        </div>
    `;
}

function hideLoadingAnimation(element, content) {
    element.innerHTML = content;
}

// Export functions for global access (if needed)
window.ShreeDoors = {
    initializeCarousel,
    initializeModal,
    initializeCategoryTabs,
    initializeContactButtons
};