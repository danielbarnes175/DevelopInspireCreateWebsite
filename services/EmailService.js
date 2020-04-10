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
    registerEmail: async function (req, res) {
      let maillist, result;
      if (process.env.DEPLOYMENT === "PRODUCTION") {
        maillist = JSON.parse(fs.readFileSync('resources/prodMailList.json', 'utf8'))
      } else {
        maillist = JSON.parse(fs.readFileSync('resources/devMailList.json', 'utf8'))
      }
      
      if (!maillist.users[req.body.email])
        result = await addUser(req.body.email, maillist);
      else
        result = true;

      res.redirect(url.format({
          pathname:"/../../",
          query: {
             "result": result,
             "attempted": true
           }
      }));
    }
}
async function addUser(email, list) {
  list.users[email] = true;

  let filename = process.env.DEPLOYMENT === "PRODUCTION" ? 'resources/prodMailList.json' : 'resources/devMailList.json';
  await fs.writeFile(filename, JSON.stringify(list, null, 2), err => {
    if (err) throw err;
  })

  return true;
}
async function constructEmail(sender, body) {
    let email = `Email submitted through form:\n\n`;

    email += `User: ${sender}\n\n`;

    email += `Body:\n${body}\n\n`;

    try {
      await sendEmail(email);
    } catch (err) {
      throw err;
    }
}

async function sendEmail(email) {
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
        to: 'danny.cow3@yahoo.com',
        subject: 'New Contact Form Reply',
        html: email,
      };
  
      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        throw error;
      }
}