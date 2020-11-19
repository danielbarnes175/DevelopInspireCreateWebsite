const nodemailer = require('nodemailer');
const url = require('url');
const fs = require('fs');

module.exports = {
    submitEmail: async function (req, res) {
        if (req.body.body) {
          let result = true;
          try {
            await constructEmail(req.body.user, req.body.body);
          } catch (err) {
            result = false;
          }
          res.redirect(url.format({
            pathname:"/../../contact",
            query: {
               "result": result,
               "attempted": true
             }
          }));
        }
    },
    sendNewsletter: async function (req, res) {
      if (req.body.body) {
        let result = true;
        try {
          await sendMassMessage(req.body.subject, req.body.body);
        } catch (err) {
          result = false;
        }
        res.redirect(url.format({
          pathname:"/newsletter/:" + process.env.ADMIN_AUTHENTICATION_TOKEN,
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
        sendEmail(req.body.email, subject, body);
        result = true;
      }
      else
        result = true;

      res.redirect(url.format({
          pathname:"/../../",
          query: {
             "result": result,
             "attempted": true, 
           }
      }));
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
            if (err) throw err;
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
    if (err) throw err;
  })
  // Send verification email
  let subject = "Please verify your email with DevelopInspireCreate.com!"
  let body = "www.DevelopInspireCreate.com/verify?id=" + id;
  sendEmail(email, subject, body);
  return true;
}
async function constructEmail(sender, body) {
    let email = `Email submitted through form:\n\n`;

    email += `User: ${sender}\n\n`;

    email += `Body:\n${body}\n\n`;

    try {
      await sendEmail(process.env.NODEMAILER_EMAIL, "New Contact Form Reply", email);
    } catch (err) {
      throw err;
    }
}
async function sendMassMessage(subject, email) {
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
    let user = users[i];
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
      throw error;
    }
  }
}
async function sendEmail(recipient, subject, body) {
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
  
      const mailOptions = {
        from: 'DevelopInspireCreate <no-reply@DevelopInspireCreate.com>',
        to: recipient,
        subject: subject,
        html: body,
      };
  
      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        throw error;
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