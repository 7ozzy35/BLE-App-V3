const crypto = require('crypto');
const express = require('express');
const axios = require('axios');
const {PayTRClient} = require('paytr');
const app = express();
var microtime = require('microtime');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const merchant_id = '375752';
const merchant_key = 'Mie1FNgnDcQeoJ3X';
const merchant_salt = 'Muc9pj211Sjdf1Yr';

app.get('/deneme', async (req, res) => {
  {
    var merchant_id = '375752';
    var merchant_key = 'Mie1FNgnDcQeoJ3X';
    var merchant_salt = 'Muc9pj211Sjdf1Yr';
    const paytr = new PayTRClient({
      merchant_id: '375752',
      merchant_key: 'Mie1FNgnDcQeoJ3X',
      merchant_salt: 'Muc9pj211Sjdf1Yr',
      debug_on: true,
      no_installment: true,
      max_installment: 0,
      timeout_limit: 0,
      test_mode: true,
    });

    const response = await paytr.getToken({
      merchant_oid: 'IN' + microtime.now(),
      payment_amount: 100,
      currency: 'TRY',
      email: 'user@domain.tld',
      user_ip: '127.0.0.1',
      user_name: 'John Doe',
      user_phone: '+123456789',
      user_address: 'customer billing address',
      card_number: '4355084355084359',
      user_basket: [
        {
          name: 'Product name',
          price: '10.99',
          quantity: 1,
        },
      ],
      merchant_ok_url: 'https://example.local/success',
      merchant_fail_url: 'https://example.local/fail',
    });

    const paytrUrl = 'https://www.paytr.com/odeme/guvenli/' + response.token;

    res.json({paytrUrl});

    console.log('====================================');
    console.log(paytrUrl);
    console.log('res==>>');
    console.log('====================================');
  }
});

app.post('/deneme1', async (req, res) => {
  console.log('request', req);
  console.log('response', res);
});
app.post('/create', async (req, res) => {
  const {
    name = 'OpenDoorAPP / Uygulama satın alım ',
    price = '1000',
    currency = 'TL',
    max_installment = '12',
    link_type = 'product',
    lang = 'tr',
    min_count = '1',
    expiry_date = '2024-09-23 17:00:00',
    callback_link = '',
    callback_id = '',
    debug_on = '1',
  } = req.body;

  let email = '';
  let min_count_final = '';

  if (link_type === 'product') {
    min_count_final = min_count;
  } else if (link_type === 'collection') {
    email = 'test@example.com';
  }

  const required = `${name}${price}${currency}${max_installment}${link_type}${lang}${min_count_final}${email}`;
  const paytr_token = crypto
    .createHmac('sha256', merchant_key)
    .update(required + merchant_salt)
    .digest('base64');

  const options = {
    method: 'POST',
    url: 'https://www.paytr.com/odeme/api/link/create',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      merchant_id,
      name,
      price,
      currency,
      max_installment,
      link_type,
      lang,
      min_count: min_count_final,
      email,
      expiry_date,
      max_count: '1',
      callback_link,
      callback_id,
      debug_on,
      paytr_token,
    },
  };

  try {
    const response = await axios(options);
    const res_data = response.data;
    if (res_data.status === 'success') {
      res.send(res_data);
    } else {
      res.status(400).send(res_data);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/delete', async (req, res) => {
  const {id} = req.body;
  const debug_on = '1';
  const paytr_token = crypto
    .createHmac('sha256', merchant_key)
    .update(id + merchant_id + merchant_salt)
    .digest('base64');

  const options = {
    method: 'POST',
    url: 'https://www.paytr.com/odeme/api/link/delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      merchant_id,
      id,
      debug_on,
      paytr_token,
    },
  };

  try {
    const response = await axios(options);
    const res_data = response.data;
    if (res_data.status === 'success') {
      res.send(res_data);
    } else {
      res.status(400).send(res_data);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/sendsms', async (req, res) => {
  const {id, cell_phone} = req.body;
  const debug_on = '1';
  const paytr_token = crypto
    .createHmac('sha256', merchant_key)
    .update(id + merchant_id + cell_phone + merchant_salt)
    .digest('base64');

  const options = {
    method: 'POST',
    url: 'https://www.paytr.com/odeme/api/link/send-sms',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      merchant_id,
      id,
      cell_phone,
      debug_on,
      paytr_token,
    },
  };

  try {
    const response = await axios(options);
    const res_data = response.data;
    if (res_data.status === 'success') {
      res.send(res_data);
    } else {
      res.status(400).send(res_data);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/sendmail', async (req, res) => {
  const {id, email} = req.body;
  const debug_on = '1';
  const paytr_token = crypto
    .createHmac('sha256', merchant_key)
    .update(id + merchant_id + email + merchant_salt)
    .digest('base64');

  const options = {
    method: 'POST',
    url: 'https://www.paytr.com/odeme/api/link/send-email',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      merchant_id,
      id,
      email,
      debug_on,
      paytr_token,
    },
  };

  try {
    const response = await axios(options);
    const res_data = response.data;
    if (res_data.status === 'success') {
      res.send(res_data);
    } else {
      res.status(400).send(res_data);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/callback', (req, res) => {
  const callback = req.body;
  const token = `${callback.id}${callback.merchant_oid}${merchant_salt}${callback.status}${callback.total_amount}`;
  const paytr_token = crypto
    .createHmac('sha256', merchant_key)
    .update(token)
    .digest('base64');

  if (paytr_token !== callback.hash) {
    return res.status(400).send('PAYTR notification failed: bad hash');
  }

  if (callback.status === 'success') {
    // Başarılı işlem
  } else {
    // Başarısız işlem
  }

  res.send('OK');
});

const port = 3200;
app.listen(port, () => {
  console.log(`Server is running. Port: ${port}`);
});
