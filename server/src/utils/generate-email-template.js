function generateEmailTemplate({ type, token, baseUrl }) {
    let actionUrl = '';
    let heading = '';
    let message = '';
    let buttonLabel = '';

    if (type === 'activate') {
        heading = 'Activate Your Account';
        message = 'Click the button below to activate your account.';
        buttonLabel = 'Activate Account';
        actionUrl = `${baseUrl}/api/v1/auth/activate/${token}`;
    } else if (type === 'reset') {
        heading = 'Reset Your Password';
        message = 'Click the button below to reset your password.';
        buttonLabel = 'Reset Password';
        actionUrl = `${baseUrl}/api/v1/auth/reset-password`;
      } else {
        throw new Error('Unsupported email type.');
    }

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">${heading}</h2>
        <p style="color: #555;">${message}</p>
        <a href="${actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          ${buttonLabel}
        </a>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    `;
}

module.exports = generateEmailTemplate;