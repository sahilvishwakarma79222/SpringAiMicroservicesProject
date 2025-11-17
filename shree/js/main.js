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

    // Product Carousel
    initializeCarousel();

    // Modal functionality
    initializeModal();

    // Filter functionality
    initializeFilters();

    // Contact form
    initializeContactForm();

    // Lazy loading
    initializeLazyLoading();
});

// Carousel Functionality
function initializeCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    const productCards = document.querySelectorAll('.product-card');

    if (!carouselTrack) return;

    let currentPosition = 0;
    const cardWidth = productCards[0].offsetWidth + 32; // width + gap

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentPosition}px)`;
    }

    nextButton.addEventListener('click', function () {
        const maxPosition = carouselTrack.scrollWidth - carouselTrack.parentElement.offsetWidth;
        currentPosition = Math.min(currentPosition + cardWidth * 3, maxPosition);
        updateCarousel();
    });

    prevButton.addEventListener('click', function () {
        currentPosition = Math.max(currentPosition - cardWidth * 3, 0);
        updateCarousel();
    });
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');
    const viewDetailsButtons = document.querySelectorAll('.view-details');

    if (!modal) return;

    // Sample product data - in real implementation, this would come from a database
    const products = {
        'pratap-door-01': {
            title: 'Pratap Door -01',
            description: 'Premium main door with exquisite craftsmanship and durable materials.',
            specs: ['Material: Solid Wood', 'Finish: Dark Walnut', 'Size: 84" x 36"', 'Type: Main Door']
        },
        'cunningham-door-2': {
            title: 'Cunningham Door 2',
            description: 'Elegant door design with glass panels for modern homes.',
            specs: ['Material: Wood & Glass', 'Finish: Cream', 'Size: 80" x 32"', 'Type: Main Door']
        }
        // Add more products as needed
    };

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.closest('.product-card, .product-item').querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
            const product = products[productName] || {
                title: 'Product Details',
                description: 'Detailed information about this product.',
                specs: ['Specification 1', 'Specification 2', 'Specification 3']
            };

            document.getElementById('modal-title').textContent = product.title;
            document.getElementById('modal-description').textContent = product.description;

            const specsList = document.getElementById('modal-specs-list');
            specsList.innerHTML = '';
            product.specs.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                specsList.appendChild(li);
            });

            // Set image - in real implementation, use actual product image
            const modalImage = document.querySelector('.modal-image img');
            const productImage = this.closest('.product-card, .product-item').querySelector('img').src;
            modalImage.src = productImage;

            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Filter Functionality
function initializeFilters() {
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const resetFiltersBtn = document.querySelector('.reset-filters');

    if (!applyFiltersBtn) return;

    applyFiltersBtn.addEventListener('click', function () {
        // Get selected filters
        const selectedCollections = getSelectedValues('collection');
        const selectedMaterials = getSelectedValues('material');
        const selectedFinishes = getSelectedValues('finish');

        // In real implementation, this would filter products from database/API
        console.log('Applied filters:', {
            collections: selectedCollections,
            materials: selectedMaterials,
            finishes: selectedFinishes
        });

        // Show loading state
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = '<div class="loading">Loading products...</div>';

            // Simulate API call
            setTimeout(() => {
                // This would be replaced with actual filtered products
                loadFilteredProducts(selectedCollections, selectedMaterials, selectedFinishes);
            }, 1000);
        }
    });

    resetFiltersBtn.addEventListener('click', function () {
        // Reset all checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reload all products
        if (document.querySelector('.products-grid')) {
            loadAllProducts();
        }
    });
}

function getSelectedValues(filterName) {
    const checkboxes = document.querySelectorAll(`input[name="${filterName}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function loadFilteredProducts(collections, materials, finishes) {
    // In real implementation, this would make an API call
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '<div class="loading">Filtered products would load here</div>';

    // Simulate filtered results
    setTimeout(() => {
        productsGrid.innerHTML = `
            <div class="product-item">
                <img src="images/main-doors/filtered-product-1.jpg" alt="Filtered Product 1" loading="lazy">
                <h3>Filtered Product 1</h3>
                <button class="view-details">View Details</button>
            </div>
            <div class="product-item">
                <img src="images/main-doors/filtered-product-2.jpg" alt="Filtered Product 2" loading="lazy">
                <h3>Filtered Product 2</h3>
                <button class="view-details">View Details</button>
            </div>
        `;

        // Re-initialize modal for new products
        initializeModal();
    }, 500);
}

function loadAllProducts() {
    // In real implementation, this would load all products
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '<div class="loading">Loading all products...</div>';

    setTimeout(() => {
        // This would be replaced with actual product loading
        productsGrid.innerHTML = `
            <div class="product-item">
                <img src="images/main-doors/jodhpur-risala-12.jpg" alt="Jodhpur Risala 12" loading="lazy">
                <h3>Jodhpur Risala 12</h3>
                <button class="view-details">View Details</button>
            </div>
            <div class="product-item">
                <img src="images/main-doors/jodhpur-risala-10.jpg" alt="Jodhpur Risala 10" loading="lazy">
                <h3>Jodhpur Risala 10</h3>
                <button class="view-details">View Details</button>
            </div>
        `;

        // Re-initialize modal for new products
        initializeModal();
    }, 500);
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // In real implementation, this would send data to server
            console.log('Form submitted:', { name, email, message });

            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
}

// Lazy Loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

// Load More Products
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('load-more')) {
        e.target.textContent = 'Loading...';
        e.target.disabled = true;

        // In real implementation, this would load more products from server
        setTimeout(() => {
            const productsGrid = document.querySelector('.products-grid');
            // Add more products to grid
            productsGrid.innerHTML += `
                <div class="product-item">
                    <img src="images/main-doors/loaded-product-1.jpg" alt="Loaded Product 1" loading="lazy">
                    <h3>Loaded Product 1</h3>
                    <button class="view-details">View Details</button>
                </div>
                <div class="product-item">
                    <img src="images/main-doors/loaded-product-2.jpg" alt="Loaded Product 2" loading="lazy">
                    <h3>Loaded Product 2</h3>
                    <button class="view-details">View Details</button>
                </div>
            `;

            e.target.textContent = 'Load more products';
            e.target.disabled = false;

            // Re-initialize modal for new products
            initializeModal();
        }, 1000);
    }
});