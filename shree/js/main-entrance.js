// Main Entrance Doors Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
    initializeEntrancePage();
});

function initializeEntrancePage() {
    // Initialize all components
    initializeCategoryChips();
    initializeFilters();
    initializeProducts();
    initializeViewToggle();
    initializeSorting();
    initializePriceSlider();
    initializeQuickView();
}

// Category Chips Filter
function initializeCategoryChips() {
    const categoryChips = document.querySelectorAll('.category-chip');
    
    categoryChips.forEach(chip => {
        chip.addEventListener('click', function () {
            // Remove active class from all chips
            categoryChips.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Filter products by category
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
}

// Enhanced Filters
function initializeFilters() {
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Apply Filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function () {
            const selectedFilters = getSelectedFilters();
            applyProductFilters(selectedFilters);
        });
    }
    
    // Clear Filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function () {
            // Uncheck all checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset price slider
            const priceSlider = document.getElementById('priceRange');
            if (priceSlider) {
                priceSlider.value = 50000;
                updatePriceDisplay();
            }
            
            // Reset category chips
            const categoryChips = document.querySelectorAll('.category-chip');
            categoryChips.forEach(chip => chip.classList.remove('active'));
            if (categoryChips[0]) categoryChips[0].classList.add('active');
            
            // Show all products
            filterProductsByCategory('all');
        });
    }
    
    // Real-time filter updates
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const selectedFilters = getSelectedFilters();
            applyProductFilters(selectedFilters);
        });
    });
}

function getSelectedFilters() {
    const filters = {
        woodTypes: [],
        designs: [],
        security: [],
        maxPrice: 100000
    };
    
    // Get price from slider
    const priceSlider = document.getElementById('priceRange');
    if (priceSlider) {
        filters.maxPrice = parseInt(priceSlider.value);
    }
    
    // Get selected wood types
    document.querySelectorAll('input[name="wood-type"]:checked').forEach(checkbox => {
        filters.woodTypes.push(checkbox.value);
    });
    
    // Get selected designs
    document.querySelectorAll('input[name="design"]:checked').forEach(checkbox => {
        filters.designs.push(checkbox.value);
    });
    
    // Get selected security features
    document.querySelectorAll('input[name="security"]:checked').forEach(checkbox => {
        filters.security.push(checkbox.value);
    });
    
    return filters;
}

// Price Slider
function initializePriceSlider() {
    const priceSlider = document.getElementById('priceRange');
    const currentPrice = document.getElementById('currentPrice');
    
    if (priceSlider && currentPrice) {
        priceSlider.addEventListener('input', function () {
            updatePriceDisplay();
            
            // Apply filters in real-time
            const selectedFilters = getSelectedFilters();
            applyProductFilters(selectedFilters);
        });
        
        updatePriceDisplay();
    }
}

function updatePriceDisplay() {
    const priceSlider = document.getElementById('priceRange');
    const currentPrice = document.getElementById('currentPrice');
    
    if (priceSlider && currentPrice) {
        const price = parseInt(priceSlider.value);
        currentPrice.textContent = `₹${price.toLocaleString()}`;
    }
}

// Products Management
function initializeProducts() {
    loadProducts();
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    // Show loading state
    productsGrid.innerHTML = `
        <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #d4af37; margin-bottom: 1rem;"></i>
            <p style="color: #666; font-size: 1.1rem;">Loading premium entrance doors...</p>
        </div>
    `;
    
    // Simulate API call
    setTimeout(() => {
        const products = getSampleProducts();
        displayProducts(products);
        updateResultsCount(products.length);
    }, 1000);
}

function getSampleProducts() {
    return [
        {
            id: 1,
            name: "Royal Teak Entrance Door",
            price: "₹45,000 - ₹65,000",
            category: "teak",
            woodType: "Teak Wood",
            design: "carved",
            features: ["Multi-point Locking", "Heavy Duty", "Weather Resistant"],
            description: "Premium Burma Teak main entrance door with intricate hand carvings",
            specs: ["Material: Solid Burma Teak", "Thickness: 45mm", "Finish: Natural Polish", "Warranty: 10 years"],
            badge: "Best Seller"
        },
        {
            id: 2,
            name: "Sheesham Carved Door",
            price: "₹38,500",
            category: "sheesham",
            woodType: "Sheesham Wood",
            design: "carved",
            features: ["Traditional Carvings", "Natural Finish", "Durable"],
            description: "Elegant Sheesham wood door with traditional Indian carvings",
            specs: ["Material: Solid Sheesham", "Thickness: 40mm", "Finish: Dark Walnut", "Warranty: 7 years"],
            badge: "Popular"
        },
        {
            id: 3,
            name: "Modern Sagwan Door",
            price: "₹32,000",
            category: "sagwan",
            woodType: "Sagwan Wood",
            design: "modern",
            features: ["Minimal Design", "Clean Lines", "Cost Effective"],
            description: "Contemporary Sagwan wood door with minimalist design",
            specs: ["Material: Sagwan Wood", "Thickness: 35mm", "Finish: Matte", "Warranty: 5 years"]
        },
        {
            id: 4,
            name: "Double Teak Entrance",
            price: "₹85,000",
            category: "teak",
            woodType: "Teak Wood",
            design: "royal",
            features: ["Double Door", "Grand Entrance", "Enhanced Security"],
            description: "Magnificent double teak wood entrance door for grand homes",
            specs: ["Material: Solid Teak", "Thickness: 50mm", "Finish: Gloss Polish", "Warranty: 12 years"],
            badge: "Premium"
        },
        {
            id: 5,
            name: "Security Focused Door",
            price: "₹55,000",
            category: "security",
            woodType: "Teak Wood",
            design: "modern",
            features: ["Multi-point Locking", "Reinforced Frame", "Peephole"],
            description: "High-security teak wood door with advanced locking systems",
            specs: ["Material: Reinforced Teak", "Thickness: 48mm", "Security: Grade 1", "Warranty: 10 years"]
        },
        {
            id: 6,
            name: "Traditional Jaali Door",
            price: "₹42,000",
            category: "traditional",
            woodType: "Sheesham Wood",
            design: "jaali",
            features: ["Jaali Work", "Ventilation", "Traditional Design"],
            description: "Beautiful sheesham wood door with intricate jaali patterns",
            specs: ["Material: Sheesham Wood", "Thickness: 38mm", "Design: Hand Carved", "Warranty: 7 years"]
        },
        {
            id: 7,
            name: "Classic Panel Door",
            price: "₹28,000",
            category: "modern",
            woodType: "Sagwan Wood",
            design: "modern",
            features: ["Clean Design", "Easy Maintenance", "Modern Look"],
            description: "Simple yet elegant panel door for contemporary homes",
            specs: ["Material: Sagwan Wood", "Thickness: 32mm", "Finish: Satin", "Warranty: 5 years"]
        },
        {
            id: 8,
            name: "Heritage Carved Door",
            price: "₹68,000",
            category: "traditional",
            woodType: "Teak Wood",
            design: "carved",
            features: ["Intricate Carvings", "Heritage Design", "Premium Finish"],
            description: "Traditional heritage door with exquisite hand carvings",
            specs: ["Material: Premium Teak", "Thickness: 46mm", "Finish: Antique", "Warranty: 15 years"],
            badge: "Luxury"
        }
    ];
}

function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    const isListView = productsGrid.classList.contains('list-view');
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-door-closed"></i>
                <h3>No doors found</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button class="clear-filters" style="margin-top: 1rem; background: #d4af37; color: #1a1a1a; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Clear All Filters</button>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}" data-wood="${product.woodType.toLowerCase()}" data-design="${product.design}" data-price="${product.price.replace(/[^0-9]/g, '')}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
                ${product.name}
            </div>
            <h3>${product.name}</h3>
            <p class="product-category">${product.woodType}</p>
            <div class="product-features">
                ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <p class="product-price">${product.price}</p>
            <div class="product-actions">
                <button class="view-details" data-product='${JSON.stringify(product).replace(/'/g, "\\'")}'>View Details</button>
                <button class="quick-view" data-product='${JSON.stringify(product).replace(/'/g, "\\'")}'>Quick View</button>
            </div>
        </div>
    `).join('');
    
    // Re-initialize event listeners for new products
    initializeQuickView();
    initializeViewDetails();
}

// Filter Products by Category
function filterProductsByCategory(category) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    updateResultsCount(visibleCount);
}

// Apply Advanced Filters
function applyProductFilters(filters) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        const woodType = product.getAttribute('data-wood');
        const design = product.getAttribute('data-design');
        const price = parseInt(product.getAttribute('data-price'));
        
        const matchesWood = filters.woodTypes.length === 0 || filters.woodTypes.some(type => 
            woodType.includes(type.toLowerCase())
        );
        
        const matchesDesign = filters.designs.length === 0 || filters.designs.includes(design);
        const matchesPrice = price <= parseInt(filters.maxPrice);
        
        if (matchesWood && matchesDesign && matchesPrice) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    updateResultsCount(visibleCount);
}

// View Toggle
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const viewType = this.getAttribute('data-view');
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid view
            if (productsGrid) {
                productsGrid.classList.toggle('list-view', viewType === 'list');
                
                // Refresh products display for new layout
                const products = getSampleProducts();
                displayProducts(products);
            }
        });
    });
}

// Sorting
function initializeSorting() {
    const sortSelect = document.getElementById('sortBy');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            const sortBy = this.value;
            sortProducts(sortBy);
        });
    }
}

function sortProducts(sortBy) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));
        
        switch (sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'popular':
                const badgeA = a.querySelector('.product-badge');
                const badgeB = b.querySelector('.product-badge');
                return (badgeB ? 1 : 0) - (badgeA ? 1 : 0);
            case 'newest':
            default:
                return 0;
        }
    });
    
    // Re-append sorted products
    products.forEach(product => productsGrid.appendChild(product));
}

// Quick View
function initializeQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productData = JSON.parse(this.getAttribute('data-product'));
            openQuickView(productData);
        });
    });
}

function openQuickView(product) {
    // Create a simple alert for demo (in real app, use modal)
    const features = product.features.join(', ');
    const specs = product.specs.join('\n');
    
    alert(`🚪 ${product.name}\n\n💰 Price: ${product.price}\n\n⭐ Features: ${features}\n\n📋 Specifications:\n${specs}\n\n📞 Contact us for more details!`);
}

// View Details
function initializeViewDetails() {
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productData = JSON.parse(this.getAttribute('data-product'));
            // For demo, show alert. In real app, redirect to detail page.
            alert(`Opening details for: ${productData.name}\n\nThis would redirect to a product detail page in the actual website.`);
        });
    });
}

// Update Results Count
function updateResultsCount(count) {
    const showingCount = document.getElementById('showingCount');
    if (showingCount) {
        showingCount.textContent = count;
    }
}

// Load More Products
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('load-more')) {
        const loadMoreBtn = e.target;
        
        // Show loading state
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin loading-spinner"></i> Loading...';
        
        // Simulate loading more products
        setTimeout(() => {
            // Add more sample products
            const newProducts = [
                {
                    id: 9,
                    name: "Executive Office Door",
                    price: "₹35,000",
                    category: "modern",
                    woodType: "Teak Wood",
                    design: "modern",
                    features: ["Professional Look", "Sound Proof", "Elegant Finish"],
                    description: "Executive door perfect for office spaces",
                    specs: ["Material: Teak Wood", "Thickness: 38mm", "Finish: Matte", "Warranty: 8 years"]
                },
                {
                    id: 10,
                    name: "Rustic Farmhouse Door",
                    price: "₹48,000",
                    category: "traditional",
                    woodType: "Sheesham Wood",
                    design: "rustic",
                    features: ["Rustic Finish", "Vintage Look", "Character Grains"],
                    description: "Farmhouse style door with rustic appeal",
                    specs: ["Material: Sheesham Wood", "Thickness: 42mm", "Finish: Rustic", "Warranty: 10 years"]
                }
            ];
            
            // Display new products
            const currentProducts = getSampleProducts();
            const allProducts = [...currentProducts, ...newProducts];
            displayProducts(allProducts);
            updateResultsCount(allProducts.length);
            
            // Reset button
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin loading-spinner"></i> Load More Doors';
            
            alert('2 more doors loaded! In real website, this would load from server.');
        }, 1500);
    }
});

// Make functions globally available
window.MainEntranceDoors = {
    initializeEntrancePage,
    filterProductsByCategory,
    applyProductFilters
};