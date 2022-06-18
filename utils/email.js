const nodemailer = require('nodemailer');

// new Email(user, url).sendWelcome();

module.exports = class Email {
  // a class needs a constructor function which is besically the function that is gonna be running
  // when a new object created through this class
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `hail hydra ${process.env.EMAIL_FROM}`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // send grid
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  send(template, subject) {
    // send the actual email
    // 1) Render HTML based on pug template
    res.render('');

    // 2) Define email options
    const mailOptions = {
      from: 'hail hydra <hellomoto@neymar.io>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
    };
    // create a transport and send email
  }

  sendWelcome() {
    this.send('welcome', 'welcome to the natours family!');
  }
};

const sendEmail = async (options) => {
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
