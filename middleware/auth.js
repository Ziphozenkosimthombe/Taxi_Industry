/**
 * Function: ensureAuth
 * Description: Middleware function to ensure that the user is authenticated.
 * Parameters:
 *   - req: The request object.
 *   - res: The response object.
 *   - next: The next middleware function.
 * Returns: None
 */

export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}
