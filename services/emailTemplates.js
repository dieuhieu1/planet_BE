const getVerifyEmailTemplate = (link) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
    .header h1 { color: #333; margin: 0; }
    .content { padding: 20px 0; text-align: center; color: #555; }
    .button { display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Welcome to Planet Web! We're excited to have you on board.</p>
      <p>Please click the button below to verify your email address and activate your account.</p>
      <a href="${link}" class="button">Verify Email</a>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Planet Web. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};

const getForgotPasswordTemplate = (link) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
    .header h1 { color: #333; margin: 0; }
    .content { padding: 20px 0; text-align: center; color: #555; }
    .button { display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
    .alert { color: #d9534f; font-size: 14px; margin-top: 10px; }
    .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>You requested a password reset for your Planet Web account.</p>
      <p>Click the button below to set a new password. This link is valid for 15 minutes.</p>
      <a href="${link}" class="button">Reset Password</a>
      <p class="alert">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Planet Web. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};

module.exports = { getVerifyEmailTemplate, getForgotPasswordTemplate };
