import { Resend } from "resend";
import { serverEnv } from "../env";

let resendClient: Resend | undefined;

export function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(serverEnv.resendKey);
  }
  return resendClient;
}
