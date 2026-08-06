export const invitationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitation</title>
</head>
<body style="margin:0;padding:32px 16px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table
          role="presentation"
          width="600"
          cellspacing="0"
          cellpadding="0"
          style="max-width:600px;background:#fff;border-radius:12px;padding:40px;"
        >
          <tr>
            <td align="center">
              <div
                style="
                  font-size:40px;
                  font-weight:800;
                  color:#16a34a;
                  letter-spacing:1px;
                  margin-bottom:32px;
                "
              >
                {{APP_NAME}}
              </div>

              <h1
                style="
                  margin:0;
                  font-size:28px;
                  color:#111827;
                  font-weight:700;
                "
              >
                You're Invited
              </h1>

              <p
                style="
                  margin:24px 0 12px;
                  font-size:16px;
                  color:#374151;
                  line-height:1.6;
                "
              >
                <strong>{{INVITOR_NAME}}</strong> has invited you to join
                <strong>{{BOOK_NAME}}</strong> on <strong>{{APP_NAME}}</strong>.
              </p>

              <p
                style="
                  margin:0 0 32px;
                  font-size:15px;
                  color:#6b7280;
                  line-height:1.6;
                "
              >
                Click the button below to accept your invitation.
              </p>

              <a
                href="{{INVITE_LINK}}"
                style="
                  display:inline-block;
                  background:#16a34a;
                  color:#fff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  font-size:16px;
                  font-weight:600;
                "
              >
                Accept Invitation
              </a>

              <p
                style="
                  margin:36px 0 8px;
                  font-size:13px;
                  color:#9ca3af;
                "
              >
                Or copy and paste this link into your browser:
              </p>

              <p
                style="
                  margin:0;
                  font-size:13px;
                  color:#16a34a;
                  word-break:break-all;
                "
              >
                {{INVITE_LINK}}
              </p>

              <p
                style="
                  margin-top:40px;
                  font-size:12px;
                  color:#9ca3af;
                "
              >
                If you weren't expecting this invitation, you can safely ignore
                this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`