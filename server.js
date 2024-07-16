const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// اتصال بقاعدة البيانات
mongoose.connect('mongodb://localhost/coffee_subscription', { useNewUrlParser: true, useUnifiedTopology: true });

// تعريف نماذج البيانات
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  phone: String
}));

const Subscription = mongoose.model('Subscription', new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  startDate: { type: Date, default: Date.now },
  cupsUsed: { type: Number, default: 0 },
  endDate: { type: Date, default: () => new Date(+new Date() + 20*24*60*60*1000) }
}));

// مسارات التطبيق
app.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ phone: req.body.phone });
  if (user) {
    res.send(user);
  } else {
    res.status(401).send('رقم الجوال غير صحيح');
  }
});

app.post('/subscriptions', async (req, res) => {
  const subscription = new Subscription(req.body);
  await subscription.save();
  res.send(subscription);
});

app.get('/subscriptions', async (req, res) => {
  const subscriptions = await Subscription.find({ userId: req.query.userId });
  res.send(subscriptions);
});

app.put('/subscriptions/:id', async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  subscription.cupsUsed += 1;
  await subscription.save();
  res.send(subscription);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
