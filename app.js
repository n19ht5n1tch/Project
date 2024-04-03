
async function connect() {
  if (window.ethereum) {
    try {
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      const address = accounts[0];
      displayWalletAddress(address); // Display the connected account
      hideConnectButton(); // Hide the connect button
      localStorage.setItem('walletAddress', address); // Store wallet address in local storage
      alert("Wallet connected");
      initializeContract();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("No wallet available");
  }
}

function displayWalletAddress(address) {
  const walletInfoDiv = document.getElementById('walletInfo');
  walletInfoDiv.innerHTML = `Connected Wallet Address: ${address}`;
}

function hideConnectButton() {
  const connectButton = document.getElementById('connectButton');
  connectButton.style.display = 'none';
}

function handleAccountsChanged(newAccounts) {
  if (newAccounts.length === 0) {
    // User disconnected from MetaMask
    web3 = null;
    accounts = null;
    clearWalletAddress(); // Clear the displayed address
    displayConnectButton(); // Display the connect button
    localStorage.removeItem('walletAddress'); // Remove stored address from local storage
    alert("Wallet disconnected");
  } else {
    accounts = newAccounts;
    const address = accounts[0];
    displayWalletAddress(address); // Display the new connected account
    localStorage.setItem('walletAddress', address); // Update stored address in local storage
    alert("Wallet connected");
    initializeContract();
  }
}

function clearWalletAddress() {
  const walletInfoDiv = document.getElementById('walletInfo');
  walletInfoDiv.innerHTML = ''; // Clear the displayed address
}

function displayConnectButton() {
  const connectButton = document.getElementById('connectButton');
  connectButton.style.display = 'block'; // Display the connect button
}

// Check if wallet address is stored in local storage on page load
document.addEventListener('DOMContentLoaded', async () => {
  const storedAddress = localStorage.getItem('walletAddress');
  if (storedAddress) {
    displayWalletAddress(storedAddress);
    hideConnectButton();
  }

  // Listen for accountsChanged event
  window.ethereum.on('accountsChanged', handleAccountsChanged);
});
