import { getResendClient } from ".";
import { invitationEmailTemplate } from "./templates/invitationtemp"

export async function sendInvitationEmail(from: string, to: string, link: string, toBook?: string) {
    const appName = process.env.APP_NAME || "splitbuddy"

    let invitationEmailTemp = invitationEmailTemplate;

    invitationEmailTemp = invitationEmailTemp.replaceAll("{{APP_NAME}}", "splitbuddy");
    invitationEmailTemp = invitationEmailTemp.replaceAll("{{INVITOR_NAME}}", from);
    invitationEmailTemp = invitationEmailTemp.replaceAll("{{BOOK_NAME}}", toBook || "private_book");
    invitationEmailTemp = invitationEmailTemp.replaceAll("{{INVITE_LINK}}", link);

    const resend = getResendClient();

    await resend.emails.send({
        to,
        from: "noreply@haileabtesfaye.dev",
        html: invitationEmailTemp,
        subject: "You have been invited to a loan book on splitbuddy",
    })
}