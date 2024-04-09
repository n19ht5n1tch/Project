let web3;
let contract;

async function loadWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return true;
    } catch (error) {
      console.error('User denied account access:', error);
      return false;
    }
  } else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask.');
    return false;
  }
}

async function loadContract() {
  contract = new web3.eth.Contract(abi, contractAddress);
}

async function createCandidatesUI() {
  const candidatesContainer = document.getElementById('candidatesContainer');
  candidatesContainer.innerHTML = ''; // Clear previous list before updating

  const candidatesCount = await contract.methods.candidatesCount().call();
  let totalVotes = 0; // Variable to store total votes count

  for (let i = 1; i <= candidatesCount; i++) {
    const candidate = await contract.methods.candidates(i).call();
    totalVotes += parseInt(candidate.voteCount);

    const candidateDiv = document.createElement('div');
    candidateDiv.classList.add('candidate');
    candidateDiv.innerHTML = `
      <span>${candidate.name} - Votes: ${candidate.voteCount}</span>
      <button onclick="vote(${candidate.id})">Vote</button>
        
    `;
    candidatesContainer.appendChild(candidateDiv);
  }

  // Display total votes count
  document.getElementById('totalVotesCount').textContent = totalVotes;
}

async function vote(candidateId) {
  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.castVote(candidateId).send({ from: accounts[0] });
    alert('Vote casted successfully!');
    createCandidatesUI(); // Update UI after voting
  } catch (error) {
    console.error('Error while casting vote:', error);
    alert('Failed to cast vote. Please try again.');
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const web3Loaded = await loadWeb3();
  if (web3Loaded) {
    await loadContract();
    createCandidatesUI();
  }
});



// Function to show the loading overlay
function showLoadingOverlay() {
  const overlay = document.querySelector('.loading-overlay');
  overlay.style.display = 'block';
}

// Function to hide the loading overlay
function hideLoadingOverlay() {
  const overlay = document.querySelector('.loading-overlay');
  overlay.style.display = 'none';
}

// Call the showLoadingOverlay function before any asynchronous operation
showLoadingOverlay();

// Example asynchronous operation (simulated delay for demonstration)
setTimeout(() => {
  hideLoadingOverlay();
  // Additional code after loading is complete
}, 2000); // Simulated delay of 2 seconds (replace with actual loading process)
