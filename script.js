let userId;
let subscriptionId;

async function register() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  
  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  });
  
  const user = await response.json();
  userId = user._id;
  document.getElementById('userName').textContent = user.name;
  createSubscription();
}

async function login() {
  const phone = document.getElementById('phone').value;
  
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  
  const user = await response.json();
  userId = user._id;
  document.getElementById('userName').textContent = user.name;
  getSubscription();
}

async function createSubscription() {
  const response = await fetch('/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  
  const subscription = await response.json();
  subscriptionId = subscription._id;
  updateSubscriptionView(subscription);
}

async function getSubscription() {
  const response = await fetch(`/subscriptions?userId=${userId}`);
  const subscriptions = await response.json();
  
  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];
    subscriptionId = subscription._id;
    updateSubscriptionView(subscription);
  }
}

async function useCup() {
  const response = await fetch(`/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const subscription = await response.json();
  updateSubscriptionView(subscription);
}

function updateSubscriptionView(subscription) {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('subscription').style.display = 'block';
  document.getElementById('cupsUsed').textContent = subscription.cupsUsed;
  document.getElementById('cupsRemaining').textContent = 40 - subscription.cupsUsed;
}
