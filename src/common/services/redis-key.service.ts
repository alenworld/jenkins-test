export default class RedisKeys {
  public static refreshToken(email: string): string {
    return `refresh_token_${email}`;
  }

  public static verificationToken(userId: string): string {
    return `verification_token_${userId}`;
  }

  public static passwordResetToken(userId: string): string {
    return `password_reset_token_${userId}`;
  }

  public static userSocketId(userId: string): string {
    return `user_${userId}`;
  }
}
