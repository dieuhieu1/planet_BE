const getVerifyEmailTemplate = (link) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; background:#0f172a; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background:#111827; border-radius:12px; padding:32px;">
          
          <tr>
            <td align="center" style="font-size:40px;">🪐</td>
          </tr>

          <tr>
            <td align="center" style="padding:16px 0;">
              <h2 style="margin:0; color:#ffffff;">Xác thực email</h2>
            </td>
          </tr>

          <tr>
            <td style="color:#9ca3af; font-size:14px; line-height:1.6; text-align:center;">
              Cảm ơn bạn đã đăng ký <strong style="color:#ffffff;">Planet Web</strong>.<br/>
              Vui lòng xác nhận email để kích hoạt tài khoản.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:28px 0;">
              <a href="${link}"
                 style="display:inline-block; padding:14px 28px; background:#3b82f6; color:#ffffff;
                        text-decoration:none; border-radius:8px; font-weight:600;">
                Xác nhận Email
              </a>
            </td>
          </tr>

          <tr>
            <td style="color:#6b7280; font-size:12px; text-align:center; line-height:1.5;">
              Link có hiệu lực trong 24 giờ.<br/>
              Nếu bạn không đăng ký, hãy bỏ qua email này.
            </td>
          </tr>

        </table>

        <p style="margin-top:20px; font-size:12px; color:#475569;">
          © ${new Date().getFullYear()} Planet Web
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getForgotPasswordTemplate = (link) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset password</title>
</head>
<body style="margin:0; padding:0; background:#0f172a; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background:#111827; border-radius:12px; padding:32px;">
          
          <tr>
            <td align="center" style="font-size:36px;">🔐</td>
          </tr>

          <tr>
            <td align="center" style="padding:16px 0;">
              <h2 style="margin:0; color:#ffffff;">Đặt lại mật khẩu</h2>
            </td>
          </tr>

          <tr>
            <td style="color:#9ca3af; font-size:14px; line-height:1.6; text-align:center;">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:28px 0;">
              <a href="${link}"
                 style="display:inline-block; padding:14px 28px; background:#ef4444; color:#ffffff;
                        text-decoration:none; border-radius:8px; font-weight:600;">
                Đặt lại mật khẩu
              </a>
            </td>
          </tr>

          <tr>
            <td style="color:#fbbf24; font-size:13px; text-align:center;">
              ⚠️ Link chỉ có hiệu lực trong 15 phút
            </td>
          </tr>

          <tr>
            <td style="padding-top:16px; color:#6b7280; font-size:12px; text-align:center; line-height:1.5;">
              Nếu bạn không yêu cầu đặt lại mật khẩu,<br/>
              vui lòng bỏ qua email này.
            </td>
          </tr>

        </table>

        <p style="margin-top:20px; font-size:12px; color:#475569;">
          © ${new Date().getFullYear()} Planet Web
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;


module.exports = { getVerifyEmailTemplate, getForgotPasswordTemplate };