import { CredentialsSignin } from "next-auth";

export class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";

  constructor(message = "The email or password you entered is incorrect.") {
    super(message);
  }
}

export class PendingApprovalError extends CredentialsSignin {
  code = "account_pending";

  constructor(
    message = "Your account is awaiting approval. You will gain access once our team verifies your request.",
  ) {
    super(message);
  }
}

export class RejectedAccountError extends CredentialsSignin {
  code = "account_rejected";

  constructor(
    message = "Your access request was rejected. Contact support if you believe this is a mistake.",
  ) {
    super(message);
  }
}
