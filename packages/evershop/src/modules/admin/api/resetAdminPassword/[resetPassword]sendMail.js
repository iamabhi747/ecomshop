const {
    INTERNAL_SERVER_ERROR
} = require('@evershop/evershop/src/lib/util/httpStatus');
const { buildUrl } = require('@evershop/evershop/src/lib/router/buildUrl');
const { error } = require('@evershop/evershop/src/lib/log/logger');
const {
  getContextValue
} = require('@evershop/evershop/src/modules/graphql/services/contextHelper');
const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');
const { getEnv } = require('@evershop/evershop/src/lib/util/getEnv');
const nodemailer = require('nodemailer');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  try {
    const {
      $body: { email, token }
    } = response;

    const service = getConfig('mail.service', '');
    const from    = getConfig('mail.from', '');
    const pass    = getEnv('MAIL_PASSWORD', '');

    // Generate the url to reset password page
    const url = buildUrl('updateAdminPasswordPage');
    // Add the token to the url
    const resetPasswordUrl = `${getContextValue(
      request,
      'homeUrl'
    )}${url}?token=${token}`;

    const mailConfig = {
      service,
      auth: {
        user: from,
        pass
      }
    };
    const transporter = nodemailer.createTransport(mailConfig);

    const mailBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
    </head>
    <body>
      <h1>Reset Password</h1>
      <p>Please click the link below to reset your password</p>
      <a href="${resetPasswordUrl}">Reset Password</a>
    </body>
    </html>
    `;

    const message = {
      from,
      to : email,
      subject: "Reset Password",
      html: mailBody
    }

    transporter.sendMail(message).then(() => {
      next();
    }).catch(e => {
      error(e);
      response.status(INTERNAL_SERVER_ERROR);
      response.json({
        error: {
          status: INTERNAL_SERVER_ERROR,
          message: e.message
        }
      });
    });

  } catch (e) {
    error(e);
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
    error: {
        status: INTERNAL_SERVER_ERROR,
        message: e.message
    }
    });
  }
};