/**
 * Extend built-in `next-auth` types with some additional fields.
 */
import "next-auth";

declare module "next-auth" {
  // These interfaces will be blended by TS compiler with existing `next-auth` interfaces.
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    username: string;
    image: string;
  }
}
