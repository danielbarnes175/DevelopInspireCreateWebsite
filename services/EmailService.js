const nodemailer = require('nodemailer');
const url = require('url');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const axios = require('axios');
const requireHtml = relativePath => fs.readFileSync(path.resolve(__dirname, relativePath), 'utf8');
const emailTemplate = requireHtml('../views/partials/email.hbs');
const { logError } = require('./services/LoggingService.js');

module.exports = {
  submitEmail: async function (req, res) {
    let successful = false;
    let attempted = false;

    // Verify recaptcha token to see if spam
    if (req.body['g-recaptcha-response']) {
      let botResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: req.body['g-recaptcha-response'],
        }
      });

      if (botResponse.data.score > 0.65 && req.body.body) {
        try {
          attempted = true;
          await constructEmail(req.body);
          successful = true;
        } catch (err) {
          successful = false;
        }
      }
    }

    res.redirect(url.format({
      pathname: "/../../contact",
      query: {
        "result": successful,
        "attempted": attempted
      }
    }));
  },
  sendNewsletter: async function (req, res) {
    if (req.body.body) {
      let result = true;
      try {
        await sendMassMessage(req.body.subject, req.body.body);
      } catch (err) {
        console.log(err);
        result = false;
      }
      res.redirect(url.format({
        pathname: "/newsletter/:" + process.env.ADMIN_AUTHENTICATION_TOKEN,
        query: {
          "result": result,
          "attempted": true
        }
      }));
    }
  },
  registerEmail: async function (req, res) {
    let maillist, result;
    if (process.env.DEPLOYMENT === "PRODUCTION") {
      maillist = JSON.parse(fs.readFileSync('resources/prodMailList.json', 'utf8'))
    } else {
      maillist = JSON.parse(fs.readFileSync('resources/devMailList.json', 'utf8'))
    }

    if (!maillist.users[req.body.email])
      result = await addUser(req.body.email, maillist);
    else if (!maillist.users[req.body.email].verified) {
      let subject = "Please verify your email with DevelopInspireCreate.com!"
      let body = "www.DevelopInspireCreate.com/verify?id=" + maillist.users[req.body.email].id;
      let heading = "Please verify your email:";
      sendEmail(req.body.email, subject, body, heading);
      result = true;
    }
    else
      result = true;

    res.redirect(url.format({
      pathname: "/../../",
      query: {
        "result": result,
        "attempted": true,
      }
    }));
  },
  unregisterEmail: async function (req, res) {
    let filename = process.env.DEPLOYMENT === "PRODUCTION" ? 'resources/prodMailList.json' : 'resources/devMailList.json';
    let maillist = JSON.parse(fs.readFileSync(filename, 'utf8'));

    if (maillist.users[req.query.email])
      delete maillist.users[req.query.email];

    await fs.writeFile(filename, JSON.stringify(maillist, null, 2), err => {
      if (err) logError(err);
    })
  },
  verifyId: async function (id) {
    if (process.env.DEPLOYMENT === "PRODUCTION") {
      maillist = JSON.parse(fs.readFileSync('resources/prodMailList.json', 'utf8'))
    } else {
      maillist = JSON.parse(fs.readFileSync('resources/devMailList.json', 'utf8'))
    }

    let numUsers = Object.keys(maillist.users).length;
    let users = Object.keys(maillist.users);
    for (let i = 0; i < numUsers; i++) {
      let user = users[i];
      user = maillist.users[user]; // such a hacky way to do this because I don't know the keys

      if (user.id != id) continue;

      user.verified = true;

      let filename = process.env.DEPLOYMENT === "PRODUCTION" ? 'resources/prodMailList.json' : 'resources/devMailList.json';
      await fs.writeFile(filename, JSON.stringify(maillist, null, 2), err => {
        if (err) logError(err);
      })

      break;
    }
  }
}
async function addUser(email, list) {
  let id = generateId();
  list.users[email] = {
    "id": id,
    "verified": false
  };

  let filename = process.env.DEPLOYMENT === "PRODUCTION" ? 'resources/prodMailList.json' : 'resources/devMailList.json';
  await fs.writeFile(filename, JSON.stringify(list, null, 2), err => {
    if (err) logError(err);
  })
  // Send verification email
  let subject = "Please verify your email with DevelopInspireCreate.com!"
  let body = "www.DevelopInspireCreate.com/verify?id=" + id;
  let heading = "Please verify your email:"
  sendEmail(email, subject, body, heading);
  return true;
}
async function constructEmail({ user, userEmail, body }) {
  let email = `Email submitted through form:\n\n`;

  email += `User: ${user}\n\n`;
  email += `Contact Email: ${userEmail}\n\n`;
  email += `Body:\n${body}\n\n`;

  email = sanitize(email);

  try {
    await sendEmail(process.env.NODEMAILER_EMAIL, "New Contact Form Reply", email);
  } catch (err) {
    console.log(err);
  }
}
async function sendMassMessage(subject, body) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // Temporary account credentials for testing.
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let maillist;
  if (process.env.DEPLOYMENT === "PRODUCTION") {
    maillist = JSON.parse(fs.readFileSync('resources/prodMailList.json', 'utf8'))
  } else {
    maillist = JSON.parse(fs.readFileSync('resources/devMailList.json', 'utf8'))
  }

  let numUsers = Object.keys(maillist.users).length;
  let users = Object.keys(maillist.users);
  for (let i = 0; i < numUsers; i++) {
    let user = users[i]
    let context = {
      heading: subject,
      body: body,
      user: user
    }

    let email = Handlebars.compile(emailTemplate)(context);

    if (!maillist.users[user].verified) continue;
    const mailOptions = {
      from: 'DevelopInspireCreate <no-reply@DevelopInspireCreate.com>',
      to: user,
      subject: subject,
      html: email,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
  }
}
async function sendEmail(recipient, subject, body, heading) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // Temporary account credentials for testing.
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let context = {
    heading: heading || subject,
    user: recipient,
    body: body
  }

  let email = Handlebars.compile(emailTemplate)(context);

  const mailOptions = {
    from: 'DevelopInspireCreate <no-reply@DevelopInspireCreate.com>',
    to: recipient,
    subject: subject,
    html: email,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}

function generateId() {
  let arr = "1234567890abcdefghijklmnopqrstuvwxyz"
  let len = 36;
  let ans = '';
  for (var i = len; i > 0; i--) {
    ans +=
      arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}

function sanitize(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match) => (map[match]));
}