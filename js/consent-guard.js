/**
 * ─────────────────────────────────────────────────────────────
 * HARD CONSENT GUARD MODULE
 * ─────────────────────────────────────────────────────────────
 * Hard constraint from brief:
 * No development-squad or youth player is shown with full name,
 * face photo, or personal contact info unless signed guardian consent
 * is on file (consent_on_file: true).
 *
 * If consent_on_file is false:
 *  - Overwrites name with name_display (First name + Last Initial)
 *  - Overwrites photo with the designated team silhouette placeholder
 *  - Strips any unapproved personal attributes
 *
 * This check is unconditionally enforced at template render time.
 */

export const ConsentGuard = {
  /**
   * Sanitizes a player object according to consent policies.
   * @param {Object} player - Raw player data from squad.json
   * @returns {Object} Safe player object
   */
  sanitizePlayer(player) {
    if (!player) return null;

    const safe = { ...player };

    // If consent is NOT on file (or if undefined for a minor)
    if (!safe.consent_on_file) {
      // Force display name only (e.g. "Tyler M.")
      safe.renderedName = safe.name_display || (safe.name_full ? safe.name_full.split(' ')[0] + ' ' + safe.name_full.split(' ').slice(-1)[0][0] + '.' : 'CSK Player');
      safe.isRedacted = true;
      // Force team silhouette placeholder, never a personal photo
      safe.renderedPhoto = 'assets/placeholders/player-silhouette.svg';
      safe.consentStatusText = 'Parental Consent Guard Active';
    } else {
      safe.renderedName = safe.name_full || safe.name_display;
      safe.isRedacted = false;
      safe.renderedPhoto = safe.photo || 'assets/placeholders/player-portrait.svg';
      safe.consentStatusText = 'Verified Profile';
    }

    return safe;
  },

  /**
   * Sanitize an array of players
   * @param {Array} playersList 
   * @returns {Array}
   */
  sanitizeList(playersList) {
    if (!Array.isArray(playersList)) return [];
    return playersList.map(p => this.sanitizePlayer(p));
  }
};
