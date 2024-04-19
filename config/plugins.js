module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "kartik65361@gmail.com",
          pass: "yeigdjdhzulpbcwe",
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: "kartik@gmail.com",
        defaultReplyTo: "kartik65361@gmail.com",
      }
    }
  }
  // ...
});

