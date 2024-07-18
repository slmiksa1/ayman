let userId;
let subscriptionId;
const baseUrl = 'https://slmiksa-f7b9b18887b7.herokuapp.com';

document.getElementById('registerBtn').addEventListener('click', register);
document.getElementById('loginBtn').addEventListener('click', login);

async function register() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  
  if (!name || !phone) {
    alert('الرجاء إدخال الاسم ورقم الجوال');
    return;
  }

  try {
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
      const errorText = await response.text();
      alert('خطأ في التسجيل: ' + errorText);
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('حدث خطأ أثناء التسجيل: ' + error.message);
  }
}

async function login() {
  const phone = document.getElementById('phone').value;
  
  if (!phone) {
    alert('الرجاء إدخال رقم الجوال');
    return;
  }

  try {
    const response = await fetch(`${baseUrl
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
      const errorText = await response.text();
      alert('رقم الجوال غير صحيح: ' + errorText);
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('حدث خطأ أثناء تسجيل الدخول: ' + error.message);
  }
}

async function createSubscription() {
  try {
    const response = await fetch(`${baseUrl}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (response.ok) {
      const subscription = await response.json();
      subscriptionId = subscription._id;
      updateSubscriptionView(subscription);
    } else {
      const errorText = await response.text();
      alert('خطأ في إنشاء الاشتراك: ' + errorText);
    }
  } catch (error) {
    console.error('Error during subscription creation:', error);
    alert('حدث خطأ أثناء إنشاء الاشتراك: ' + error.message);
  }
}

async function getSubscription() {
  try {
    const response = await fetch(`${baseUrl}/subscriptions?userId=${userId}`);
    if (response.ok) {
      const subscriptions = await response.json();
      
      if (subscriptions.length > 0) {
        const subscription = subscriptions[0];
        subscriptionId = subscription._id;
        updateSubscriptionView(subscription);
      }
    } else {
      const errorText = await response.text();
      alert('خطأ في جلب الاشتراك: ' + errorText);
    }
  } catch (error) {
    console.error('Error during getting subscription:', error);
    alert('حدث خطأ أثناء الحصول على الاشتراك: ' + error.message);
  }
}

async function useCup() {
  try {
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const subscription = await response.json();
      updateSubscriptionView(subscription);
    } else {
      const errorText = await response.text();
      alert('خطأ في استخدام الكوب: ' + errorText);
    }
  } catch (error) {
    console.error('Error during using cup:', error);
    alert('حدث خطأ أثناء استخدام الكوب: ' + error.message);
  }
}

function updateSubscriptionView(subscription) {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('subscription').style.display = 'block';
  document.getElementById('cupsUsed').textContent = subscription.cupsUsed;
  document.getElementById('cupsRemaining').textContent = 40 - subscription.cupsUsed;
}
