# CryptoVerse - Professional Cryptocurrency Trading Platform

## Overview
CryptoVerse is a modern, web-based cryptocurrency trading platform designed to provide users with a seamless and professional trading experience. It features real-time market data, portfolio management, trading capabilities, and a responsive user interface. Built with HTML, CSS, JavaScript, and leveraging popular libraries like Bootstrap and DataTables, CryptoVerse integrates with the CoinGecko API to fetch live cryptocurrency prices and market information.

![image](https://github.com/user-attachments/assets/b50daf76-8079-42c4-98c6-5d54f9bf206f)

## Features
- **Real-Time Market Data**: Displays up-to-date cryptocurrency prices, 24-hour price changes, market cap, and trading volume using the CoinGecko API.
- **Trading Interface**: Allows users to buy and sell cryptocurrencies with a simulated wallet, including input validation and transaction confirmations.
- **Portfolio Management**: Tracks user holdings and calculates total portfolio value based on current market prices.
- **Trade History**: Logs all transactions (buy, sell, deposit, withdrawal) with details like amount, price, and timestamp.
- **Wallet Operations**: Supports adding and withdrawing funds via simulated payment methods (Credit Card, PayPal, Bank Transfer).
- **Responsive Design**: Built with Bootstrap for a mobile-friendly and visually appealing interface.
- **Interactive Market Table**: Utilizes DataTables for searchable, sortable, and paginated cryptocurrency listings.
- **Custom Modals**: Provides user feedback through custom modal dialogs for errors, confirmations, and payment processing.

![image](https://github.com/user-attachments/assets/6e779e1e-5193-4ca3-914c-10736cbad6c2)

## Technologies Used
- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Bootstrap 5.3.2 for responsive design
  - Font Awesome 6.5.1 for icons
  - DataTables 1.13.6 for interactive tables
  - jQuery 3.7.1 for DOM manipulation and AJAX requests
- **API**:
  - CoinGecko API for real-time cryptocurrency data
- **Fonts**:
  - Google Fonts (Roboto)
- **Other**:
  - Cloudflare for email protection and challenge scripts

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, etc.)
- Internet connection for API calls and CDN-hosted dependencies

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ArkaKarmoker/CryptoVerse.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CryptoVerse
   ```
3. Open `CryptoVerse.html` in a web browser:
   - You can double-click the file or serve it using a local server (e.g., `python -m http.server` for Python 3.x).

### Usage
- **Market Overview**: View real-time cryptocurrency data in the interactive table. Click "Trade" to select a coin for trading.
- **Trading**: Select a coin, enter an amount, and click "Buy" or "Sell". The platform validates funds and holdings before processing.
- **Portfolio**: Monitor your holdings and total portfolio value, updated with live prices.
- **Wallet**: Add or withdraw funds via the wallet dropdown, selecting a payment method and amount.
- **Trade History**: Review recent transactions, including buys, sells, deposits, and withdrawals.

### Login Information
- **Username**: `admin`
- **Password**: `1234`

## Project Structure
- `CryptoVerse.html`: The main HTML file containing the structure, styles, and JavaScript logic.
- **External Dependencies** (loaded via CDN):
  - Bootstrap CSS and JS
  - Font Awesome
  - jQuery
  - DataTables
  - Google Fonts
  - CoinGecko API
- **Key JavaScript Functions**:
  - `fetchAllCryptoData()`: Fetches market data from CoinGecko.
  - `updateMarketTable()`: Populates the DataTables-powered market table.
  - `updatePortfolio()`: Updates user holdings and portfolio value.
  - `updateTradeHistory()`: Displays recent transactions.
  - `showPaymentModal()`: Handles fund addition/withdrawal with payment method selection.
  - `buyBtn`/`sellBtn` handlers: Process buy/sell transactions with validation.

## Limitations
- **Simulated Wallet**: The wallet and transactions are simulated and not connected to real financial systems.
- **API Dependency**: Relies on CoinGecko API for market data, which may have rate limits or downtime.
- **No Persistence**: User data (wallet balance, holdings, trade history) is stored in memory and resets on page refresh.
- **Single File**: All logic is contained in one HTML file, which may limit scalability for larger applications.

## Future Improvements
- Add local storage or a backend to persist user data.
- Implement user authentication for personalized accounts.
- Enhance security with proper input sanitization and API key management.
- Integrate charting libraries (e.g., Chart.js) for price history visualization.
- Support additional APIs for more comprehensive market data.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, please contact:
- Email: karmokerarka@gmail.com
- GitHub Issues: [Create an Issue](https://github.com/ArkKarmoker/CryptoVerse/issues)

---

© 2025 CryptoVerse. All Rights Reserved.
