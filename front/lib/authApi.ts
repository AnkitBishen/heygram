export async function postForgetResetPassword(payload: {
  actionFrom: 1 | 2;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  token?: string;
}) {
  const response = await fetch("/auth/v1/forgetPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let err = { message: "Request failed" };
    try {
      err = await response.json();
    } catch { /* ignore */ }
    throw new Error(err.message || "Error");
  }
  return response.json();
}