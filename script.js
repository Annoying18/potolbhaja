        // Sample product data
        const products = [
            {
                id: 1,
                name: "Premium Wireless Headphones",
                price: 129.99,
                description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
                image: "headphone.jpeg",
                alt: "Black wireless headphones with silver accents and soft ear cushions"
            },
            {
                id: 2,
                name: "Smart Watch Pro",
                price: 199.99,
                description: "Advanced smartwatch with fitness tracking, heart rate monitor, and smartphone notifications.",
                image: "watch.jpeg",
                alt: "Black smartwatch with rectangular display showing fitness metrics"
            },
            {
                id: 3,
                name: "4K Ultra HD Television",
                price: 799.99,
                description: "55-inch 4K UHD Smart TV with HDR and built-in streaming apps.",
                image: "tv.jpeg",
                alt: "Large flat-screen television mounted on a stand in a modern living room"
            },
            {
                id: 4,
                name: "Wireless Bluetooth Speaker",
                price: 89.99,
                description: "Portable waterproof speaker with 20-hour battery life and deep bass.",
                image: "speaker.jpeg",
                alt: "Cylindrical Bluetooth speaker in black with control buttons on top"
            },
            {
                id: 5,
                name: "Laptop Backpack",
                price: 49.99,
                description: "Durable backpack with USB charging port and anti-theft design. Fits up to 15.6\" laptops.",
                image: "bag.jpeg",
                alt: "Black backpack with multiple compartments and USB charging port on the side"
            },
            {
                id: 6,
                name: "Ergonomic Office Chair",
                price: 249.99,
                description: "Comfortable ergonomic chair with adjustable height and lumbar support.",
                image: "chair.jpeg",
                alt: "Modern ergonomic office chair in black with mesh back and adjustable features"
            }
        ];

        // Initialize cart
        let cart = [];
        
        // DOM elements
        const storeSection = document.querySelector('#store .grid');
        const cartSection = document.getElementById('cart');
        const checkoutSection = document.getElementById('checkout');
        const orderConfirmationSection = document.getElementById('order-confirmation');
        const adminSection = document.getElementById('admin');
        const cartCountElement = document.getElementById('cart-count');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const placeOrderBtn = document.getElementById('place-order-btn');
        const backToStoreBtn = document.getElementById('back-to-store');
        const checkoutSubtotalElement = document.getElementById('checkout-subtotal');
        const checkoutTotalElement = document.getElementById('checkout-total');
        const orderNumberElement = document.getElementById('order-number');
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const navLinks = document.querySelectorAll('nav a');
        const themeToggle = document.getElementById('theme-toggle');

        // Initialize the store
        function initializeStore() {
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card bg-white rounded-lg shadow overflow-hidden transition duration-300 hover:shadow-xl';
                productCard.innerHTML = `
                    <div class="product-image h-48 overflow-hidden">
                        <img src="${product.image}" alt="${product.alt}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-4">
                        <h3 class="text-lg font-semibold mb-1">${product.name}</h3>
                        <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xl font-bold">$${product.price.toFixed(2)}</span>
                            <button class="add-to-cart bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition" data-id="${product.id}">
                                <i class="fas fa-cart-plus mr-2"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                storeSection.appendChild(productCard);
            });

            // Add event listeners to Add to Cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
        }

        // Add product to cart
        function addToCart(e) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification(`${product.name} added to cart!`);
        }

        // Remove item from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        // Update cart quantity
        function updateCartQuantity(productId, quantity) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                }
                updateCart();
            }
        }

        // Update cart UI
        function updateCart() {
            const cartItemsContainer = document.querySelector('#cart .divide-y');
            cartItemsContainer.innerHTML = '';
            
            let total = 0;
            
            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item p-4 flex items-center transition';
                cartItem.innerHTML = `
                    <div class="w-16 h-16 overflow-hidden rounded-md mr-4">
                        <img src="${item.image}" alt="${item.alt}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium">${item.name}</h4>
                        <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center">
                        <button class="decrease-quantity text-gray-500 px-2 py-1 rounded-l border border-gray-300" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" min="1" value="${item.quantity}" class="w-12 text-center border-t border-b border-gray-300 py-1 quantity-input" data-id="${item.id}">
                        <button class="increase-quantity text-gray-500 px-2 py-1 rounded-r border border-gray-300" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="ml-6 font-medium">$${subtotal.toFixed(2)}</div>
                    <button class="ml-6 text-red-500 hover:text-red-700 remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Update cart total and count
            cartTotalElement.textContent = total.toFixed(2);
            cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            // Update checkout totals
            checkoutSubtotalElement.textContent = total.toFixed(2);
            checkoutTotalElement.textContent = (total + 5).toFixed(2); // Adding $5 shipping
            
            // Add event listeners to new cart controls
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', e => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    const item = cart.find(item => item.id === id);
                    if (item) {
                        updateCartQuantity(id, item.quantity + 1);
                    }
                });
            });
            
            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', e => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    const item = cart.find(item => item.id === id);
                    if (item) {
                        updateCartQuantity(id, item.quantity - 1);
                    }
                });
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', e => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    updateCartQuantity(id, parseInt(e.target.value));
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', e => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    removeFromCart(id);
                });
            });
        }

        // Show notification
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('animate-fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 3000);
        }

        // Show section and hide others
        function showSection(sectionId) {
            document.querySelectorAll('section[id]').forEach(section => {
                section.classList.add('hidden');
            });
            
            document.getElementById(sectionId).classList.remove('hidden');
            
            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('text-indigo-200');
                if (`#${sectionId}` === link.getAttribute('href')) {
                    link.classList.add('text-indigo-200');
                }
            });
        }

        // Generate random order number
        function generateOrderNumber() {
            return Math.floor(Math.random() * 90000) + 10000;
        }

        // Event listeners
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                showSection('checkout');
                window.scrollTo(0, 0);
            } else {
                showNotification('Your cart is empty!');
            }
        });

        placeOrderBtn.addEventListener('click', () => {
            orderNumberElement.textContent = generateOrderNumber();
            showSection('order-confirmation');
            window.scrollTo(0, 0);
            
            // Clear cart
            cart = [];
            updateCart();
        });

        backToStoreBtn.addEventListener('click', () => {
            showSection('store');
            window.scrollTo(0, 0);
        });

        // Tab switching for admin dashboard
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => {
                    btn.classList.remove('border-indigo-500', 'text-indigo-600');
                    btn.classList.add('border-transparent', 'text-gray-500');
                });
                button.classList.add('border-indigo-500', 'text-indigo-600');
                button.classList.remove('border-transparent', 'text-gray-500');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });

        // Navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                showSection(sectionId);
                window.scrollTo(0, 0);
            });
        });

        // Dark mode toggle
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            
            const icon = themeToggle.querySelector('i');
            if (document.documentElement.classList.contains('dark')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });

        // Initialize the app
        function initApp() {
            initializeStore();
            updateCart();
            showSection('store');
        }

        // Start the app
        initApp();