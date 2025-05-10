// Initial State
let walletBalance = 100000;
let holdings = {};
let prices = {};
let tradeHistory = [];
let allCryptoData = [];
let isLoggedIn = false;
let currentUser = null;
let users = {
    'admin': '1234' // Predefined credentials
};
let hasDemoDataLoaded = false; // Flag to load demo data only once

// Demo Data for admin
const demoHoldings = {
    'BTC': 0.5,    // 0.5 Bitcoin
    'ETH': 10,     // 10 Ethereum
    'XRP': 5000    // 5000 Ripple
};

const demoTradeHistory = [
    {
        type: 'Deposit',
        coin: 'USD',
        amount: 50000,
        total: 50000,
        price: 1,
        time: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        method: 'credit-card'
    },
    {
        type: 'Buy',
        coin: 'BTC',
        amount: 0.5,
        total: 25000,
        price: 50000,
        time: Date.now() - 5 * 24 * 60 * 60 * 1000 // 5 days ago
    },
    {
        type: 'Buy',
        coin: 'ETH',
        amount: 10,
        total: 20000,
        price: 2000,
        time: Date.now() - 4 * 24 * 60 * 60 * 1000 // 4 days ago
    },
    {
        type: 'Buy',
        coin: 'XRP',
        amount: 5000,
        total: 2500,
        price: 0.5,
        time: Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago
    },
    {
        type: 'Withdrawal',
        coin: 'USD',
        amount: 10000,
        total: 10000,
        price: 1,
        time: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        method: 'bank-transfer'
    }
];

// Format numbers
function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Show Custom Modal
function showModal(message, title = "Transaction Error") {
    const overlay = $('<div class="modal-overlay"></div>');
    const modal = $(`
        <div class="custom-modal">
            <h4 class="mb-3">${title}</h4>
            <p>${message}</p>
            <button class="modal-close-btn mt-3">Close</button>
        </div>
    `);

    $('body').append(overlay).append(modal);
    
    $('.modal-close-btn').on('click', function() {
        overlay.remove();
        modal.remove();
    });

    overlay.on('click', function() {
        overlay.remove();
        modal.remove();
    });
}

// Show Payment Modal (Add/Withdraw Money)
function showPaymentModal(type) {
    const overlay = $('<div class="modal-overlay"></div>');
    const isAdd = type === 'add';
    const modal = $(`
        <div class="custom-modal">
            <h4 class="mb-3">${isAdd ? 'Add Money' : 'Withdraw Money'}</h4>
            <div class="mb-3">
                <label class="form-label fw-medium">Amount (USD)</label>
                <input type="number" class="form-control" id="paymentAmount" 
                       min="1" step="0.01" placeholder="Enter amount">
            </div>
            <div class="mb-3">
                <label class="form-label fw-medium">Payment Method</label>
                <div class="payment-option" data-method="credit-card">
                    <i class="fas fa-credit-card me-2"></i> Credit Card
                </div>
                <div class="payment-option" data-method="paypal">
                    <i class="fab fa-paypal me-2"></i> PayPal
                </div>
                <div class="payment-option" data-method="bank-transfer">
                    <i class="fas fa-university me-2"></i> Bank Transfer
                </div>
            </div>
            <button class="btn ${isAdd ? 'btn-success' : 'btn-danger'} w-100 mt-3" id="confirmPaymentBtn">
                ${isAdd ? 'Add Funds' : 'Withdraw Funds'}
            </button>
            <button class="modal-close-btn mt-2 w-100">Cancel</button>
        </div>
    `);

    $('body').append(overlay).append(modal);

    let selectedMethod = null;

    $('.payment-option').on('click', function() {
        $('.payment-option').removeClass('selected');
        $(this).addClass('selected');
        selectedMethod = $(this).data('method');
    });

    $('#confirmPaymentBtn').on('click', function() {
        const amount = parseFloat($('#paymentAmount').val() || 0);

        if (isNaN(amount) || amount <= 0) {
            showModal('Please enter a valid amount!');
            return;
        }

        if (!selectedMethod) {
            showModal('Please select a payment method!');
            return;
        }

        if (!isAdd && amount > walletBalance) {
            showModal(`Insufficient funds! You can withdraw up to $${formatNumber(walletBalance)}.`);
            return;
        }

        if (isAdd) {
            walletBalance += amount;
            tradeHistory.push({
                type: 'Deposit',
                coin: 'USD',
                amount: amount,
                total: amount,
                price: 1,
                time: Date.now(),
                method: selectedMethod
            });
            alert(`Successfully added $${formatNumber(amount)} via ${selectedMethod.replace('-', ' ')}!`);
        } else {
            walletBalance -= amount;
            tradeHistory.push({
                type: 'Withdrawal',
                coin: 'USD',
                amount: amount,
                total: amount,
                price: 1,
                time: Date.now(),
                method: selectedMethod
            });
            alert(`Successfully withdrew $${formatNumber(amount)} via ${selectedMethod.replace('-', ' ')}!`);
        }

        updateWallet();
        updateTradeHistory();
        overlay.remove();
        modal.remove();
    });

    $('.modal-close-btn').on('click', function() {
        overlay.remove();
        modal.remove();
    });

    overlay.on('click', function() {
        overlay.remove();
        modal.remove();
    });
}

// Fetch all crypto data from CoinGecko
function fetchAllCryptoData() {
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/markets',
        data: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false
        },
        success: function(data) {
            allCryptoData = data;
            updateMarketTable();
            updateTradeOptions();
            updatePrices();
            updatePortfolio();
            updateTradePanel();
        },
        error: function(error) {
            console.error('Error fetching crypto data:', error);
        }
    });
}

// Initialize and Update Market Table with DataTables
function updateMarketTable() {
    const table = $('#marketTable').DataTable({
        destroy: true,
        data: allCryptoData,
        columns: [
            { 
                data: null,
                render: function(data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { 
                data: null,
                render: function(data, type, row) {
                    return `
                        <img src="${row.image}" class="crypto-icon">
                        ${row.name} (${row.symbol.toUpperCase()})
                    `;
                }
            },
            { 
                data: 'current_price',
                render: function(data) {
                    return `$${formatNumber(data)}`;
                }
            },
            { 
                data: 'price_change_percentage_24h',
                render: function(data) {
                    const change = data.toFixed(2);
                    const changeColor = change >= 0 ? '#00c853' : '#d81b60';
                    return `<span style="color: ${changeColor}">${change}%</span>`;
                }
            },
            { 
                data: 'market_cap',
                render: function(data) {
                    return `$${formatNumber(data)}`;
                }
            },
            { 
                data: 'total_volume',
                render: function(data) {
                    return `$${formatNumber(data)}`;
                }
            },
            { 
                data: 'symbol',
                render: function(data) {
                    return `
                        <button class="btn btn-sm btn-outline-secondary trade-btn" 
                                data-coin="${data.toUpperCase()}">
                            Trade
                        </button>
                    `;
                }
            }
        ],
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        order: [[4, 'desc']],
        searching: true,
        paging: true,
        info: true,
        language: {
            search: "Search cryptocurrencies:",
            searchPlaceholder: "Enter name or symbol..."
        },
        drawCallback: function() {
            $('.trade-btn').off('click').on('click', function() {
                const coin = $(this).data('coin');
                const $tradeCoin = $('#tradeCoin');
                $tradeCoin.val(coin);
                $tradeCoin.trigger('change');
            });
        }
    });
}

// Update prices object
function updatePrices() {
    allCryptoData.forEach(coin => {
        prices[coin.symbol.toUpperCase()] = coin.current_price;
        if (!(coin.symbol.toUpperCase() in holdings)) {
            holdings[coin.symbol.toUpperCase()] = 0;
        }
    });
}

// Update trade select options
function updateTradeOptions() {
    const $tradeCoin = $('#tradeCoin');
    const currentValue = $tradeCoin.val();
    $tradeCoin.empty();
    allCryptoData.forEach(coin => {
        $tradeCoin.append(`
            <option value="${coin.symbol.toUpperCase()}">
                ${coin.name} (${coin.symbol.toUpperCase()})
            </option>
        `);
    });
    if (currentValue && prices[currentValue]) {
        $tradeCoin.val(currentValue);
    }
}

// Update Portfolio
function updatePortfolio() {
    const $portfolioList = $('#portfolioList');
    $portfolioList.empty();
    let totalValue = 0;

    for (let coin in holdings) {
        if (holdings[coin] > 0) {
            const value = holdings[coin] * (prices[coin] || 0);
            totalValue += value;
            $portfolioList.append(`
                <div class="portfolio-item">
                    <div class="d-flex justify-content-between">
                        <span>${coin}</span>
                        <span>${holdings[coin].toFixed(4)}</span>
                    </div>
                    <div class="text-muted small mt-1">
                        $${formatNumber(value)}
                    </div>
                </div>
            `);
        }
    }

    $('#portfolioValue').text(`$${formatNumber(totalValue)}`);
}

// Update Wallet
function updateWallet() {
    $('#walletBalance').html(`<i class="fas fa-wallet"></i> $${formatNumber(walletBalance)}`);
}

// Update Trade History
function updateTradeHistory() {
    const $tradeHistory = $('#tradeHistory');
    $tradeHistory.empty();

    tradeHistory.slice(-5).reverse().forEach(trade => {
        const isDepositOrWithdraw = trade.type === 'Deposit' || trade.type === 'Withdrawal';
        $tradeHistory.append(`
            <div class="history-item">
                <div class="d-flex justify-content-between">
                    <span>${trade.type} ${isDepositOrWithdraw ? 'USD' : trade.coin}</span>
                    <span class="${trade.type === 'Buy' || trade.type === 'Withdrawal' ? 'price-down' : 'price-up'}">
                        ${trade.type === 'Buy' || trade.type === 'Withdrawal' ? '-' : '+'}$${formatNumber(trade.total)}
                    </span>
                </div>
                <div class="text-muted small">
                    ${isDepositOrWithdraw ? 
                        `${formatNumber(trade.amount)} USD via ${trade.method.replace('-', ' ')}` : 
                        `${trade.amount} ${trade.coin} @ $${formatNumber(trade.price)}`}
                    <br>${new Date(trade.time).toLocaleTimeString()}
                </div>
            </div>
        `);
    });
}

// Update Trade Panel
function updateTradePanel() {
    const coin = $('#tradeCoin').val();
    const amount = parseFloat($('#tradeAmount').val() || 0);
    const total = amount * (prices[coin] || 0);

    $('#currentPrice').val(`$${formatNumber(prices[coin] || 0)}`);
    $('#totalCost').val(`$${formatNumber(total)}`);
}

// Show/Hide Content
function toggleContent() {
    if (isLoggedIn) {
        $('#authContainer').addClass('hidden');
        $('#mainContent').removeClass('hidden');
    } else {
        $('#authContainer').removeClass('hidden');
        $('#mainContent').addClass('hidden');
    }
}

// Load Demo Data for admin
function loadDemoData() {
    if (currentUser === 'admin' && !hasDemoDataLoaded) {
        // Set initial wallet balance based on demo transactions
        walletBalance = 100000; // Starting balance
        walletBalance += 50000; // Deposit
        walletBalance -= 25000; // Buy BTC
        walletBalance -= 20000; // Buy ETH
        walletBalance -= 2500;  // Buy XRP
        walletBalance -= 10000; // Withdrawal

        // Load demo holdings
        holdings = { ...demoHoldings };

        // Load demo trade history
        tradeHistory = [...demoTradeHistory];

        hasDemoDataLoaded = true; // Prevent reloading demo data
    }
}

// Document Ready
$(document).ready(function() {
    // Initial Setup
    toggleContent();

    // Login Handler
    $('#loginBtn').on('click', function() {
        const username = $('#loginUsername').val().trim();
        const password = $('#loginPassword').val().trim();

        if (!username || !password) {
            showModal('Please enter both username and password!');
            return;
        }

        if (users[username] && users[username] === password) {
            currentUser = username;
            isLoggedIn = true;
            loadDemoData(); // Load demo data if admin
            toggleContent();
            fetchAllCryptoData();
            updateWallet();
            updateTradeHistory();
            alert('Login successful!');
        } else {
            showModal('Invalid username or password!');
        }
    });

    // Register Handler
    $('#registerBtn').on('click', function() {
        const username = $('#registerUsername').val().trim();
        const password = $('#registerPassword').val().trim();

        if (!username || !password) {
            showModal('Please enter both username and password!');
            return;
        }

        if (users[username]) {
            showModal('Username already exists!');
            return;
        }

        users[username] = password;
        alert('Registration successful! Please login.');
        $('#registerUsername').val('');
        $('#registerPassword').val('');
        $('#registerCard').addClass('hidden');
        $('#loginCard').removeClass('hidden');
    });

    // Toggle between Login and Register
    $('#showRegister').on('click', function(e) {
        e.preventDefault();
        $('#loginCard').addClass('hidden');
        $('#registerCard').removeClass('hidden');
    });

    $('#showLogin').on('click', function(e) {
        e.preventDefault();
        $('#registerCard').addClass('hidden');
        $('#loginCard').removeClass('hidden');
    });

    // Logout Handler
    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        isLoggedIn = false;
        currentUser = null;
        toggleContent();
        $('#loginUsername').val('');
        $('#loginPassword').val('');
        alert('Logged out successfully!');
    });

    // Refetch data every minute (only when logged in)
    setInterval(function() {
        if (isLoggedIn) {
            fetchAllCryptoData();
        }
    }, 60000);

    // Add Money Button
    $('#addMoneyBtn').on('click', function(e) {
        e.preventDefault();
        showPaymentModal('add');
    });

    // Withdraw Money Button
    $('#withdrawMoneyBtn').on('click', function(e) {
        e.preventDefault();
        showPaymentModal('withdraw');
    });

    // Trade Input Changes
    $('#tradeCoin, #tradeAmount').on('change input', updateTradePanel);

    // Buy Action
    $('#buyBtn').on('click', function() {
        const coin = $('#tradeCoin').val();
        const amount = parseFloat($('#tradeAmount').val() || 0);
        const total = amount * (prices[coin] || 0);

        if (isNaN(amount) || amount <= 0) {
            showModal('Please enter a valid amount!');
            return;
        }

        if (total > walletBalance) {
            showModal(`Insufficient funds! You need $${formatNumber(total - walletBalance)} more to complete this purchase.`);
            return;
        }

        walletBalance -= total;
        holdings[coin] += amount;

        tradeHistory.push({
            type: 'Buy',
            coin: coin,
            amount: amount,
            total: total,
            price: prices[coin] || 0,
            time: Date.now()
        });

        updateWallet();
        updatePortfolio();
        updateTradeHistory();
        $('#tradeAmount').val('');
        updateTradePanel();

        alert(`Successfully bought ${amount} ${coin} for $${formatNumber(total)}!`);
    });

    // Sell Action
    $('#sellBtn').on('click', function() {
        const coin = $('#tradeCoin').val();
        const amount = parseFloat($('#tradeAmount').val() || 0);
        const total = amount * (prices[coin] || 0);

        if (isNaN(amount) || amount <= 0) {
            showModal('Please enter a valid amount!');
            return;
        }

        if (amount > holdings[coin]) {
            showModal(`Insufficient holdings! You need ${amount - holdings[coin]} more ${coin} to complete this sale.`);
            return;
        }

        walletBalance += total;
        holdings[coin] -= amount;

        tradeHistory.push({
            type: 'Sell',
            coin: coin,
            amount: amount,
            total: total,
            price: prices[coin] || 0,
            time: Date.now()
        });

        updateWallet();
        updatePortfolio();
        updateTradeHistory();
        $('#tradeAmount').val('');
        updateTradePanel();

        alert(`Successfully sold ${amount} ${coin} for $${formatNumber(total)}!`);
    });
});