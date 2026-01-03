import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

/**
 * Checks if user is already authenticated
 * @returns {Promise<boolean>} Returns true if user is authenticated
 */
export function checkAuthState() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
}

/**
 * Gets the current authenticated user
 * @returns {Promise<object|null>} Returns the user object if authenticated, null otherwise
 */
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
