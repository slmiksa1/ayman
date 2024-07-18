let userId;
let subscriptionId;
const baseUrl = 'https://slmiksa.herokuapp.com'; // تأكد من تغيير your-app-name إلى اسم تطبيق Heroku الخاص بك

async function register() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  
  if (!name || !phone) {
    alert('الرجاء إدخال الاسم ورقم الجوال');
    return;
  }

  const response = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  });
  
  if (response.ok) {
    const user = await response.json();
    userId = user._id;
    document.getElementById('userName').textContent = user.name;
    createSubscription();
  } else {
    alert('خطأ في التسجيل');
  }
}

async function login() {
  const phone = document.getElementById('phone').value;
  
  if (!phone) {
    alert('الرجاء إدخال رقم الجوال');
    return;
  }

  const response = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  
  if (response.ok) {
    const user = await response.json();
    userId = user._id;
    document.getElementById('userName').textContent = user.name;
    getSubscription();
  } else {
    alert('رقم الجوال غير صحيح');
  }
}

async function createSubscription() {
  const response = await fetch(`${baseUrl}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  
  const subscription = await response.json();
  subscriptionId = subscription._id;
  updateSubscriptionView(subscription);
}

async function getSubscription() {
  const response = await fetch(`${baseUrl}/subscriptions?userId=${userId}`);
  const subscriptions = await response.json();
  
  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];
    subscriptionId = subscription._id;
    updateSubscriptionView(subscription);
  }
}

async function useCup() {
  const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
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
