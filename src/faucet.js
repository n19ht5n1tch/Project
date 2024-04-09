// Initialize Web3 using MetaMask provider
let web3;

async function connect1() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);

            // Set default account
            const accounts = await web3.eth.getAccounts();
            web3.eth.defaultAccount = accounts[0];

            console.log('Wallet Connected:', web3.eth.defaultAccount);
            alert('Wallet connected');
        } catch (error) {
            console.error('User denied account access or an error occurred:', error);
        }
    } else {
        console.error('No web3 provider detected');
    }
}

let claimedAddresses = {}; // Object to track claimed addresses and their claim time

async function claim() {
    try {
        if (!web3) {
            console.error('Web3 is not initialized');
            return;
        }

        const amountToSend = web3.utils.toWei('0.01', 'ether'); // Amount in native Matic tokens
        const recipientAddress = await web3.eth.getCoinbase(); // Get the connected wallet address

        // Check if the address has claimed within the last 5 minutes
        if (claimedAddresses[recipientAddress] && Date.now() - claimedAddresses[recipientAddress] < 5 * 60 * 1000) {
            console.error('Address has already claimed within the last 5 minutes.');
            return;
        }

        const txObject = {
            from: web3.eth.defaultAccount,
            to: recipientAddress,
            value: amountToSend,
            gas: 3000000, // Adjust the gas limit as needed
            gasPrice: web3.utils.toWei('10', 'gwei'), // Adjust the gas price as needed
        };

        const signedTx = await web3.eth.accounts.signTransaction(txObject, '0xd3081b13754371cde298658892e61600de23aaf930141bf494251e188a038bc5'); // Replace 'PRIVATE_KEY_HERE' with your private key
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log('Transaction Hash:', receipt.transactionHash);
        console.log('Transaction Receipt:', receipt);

        // Update the claimedAddresses object with the current time for the recipientAddress
        claimedAddresses[recipientAddress] = Date.now();

        // Set a timeout to clear the claimed address after 5 minutes
        setTimeout(() => {
            delete claimedAddresses[recipientAddress];
            console.log('5 minutes timeout completed for', recipientAddress);
            // Add any post-timeout logic here
        }, 5 * 60 * 1000); // 5 minutes in milliseconds
    } catch (error) {
        console.error('Transaction Error:', error);
    }
}


