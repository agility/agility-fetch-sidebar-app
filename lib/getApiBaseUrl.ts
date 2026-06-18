/**
 * Builds the Content Fetch API base url (including the guid) for an instance,
 * mirroring the region-detection logic in @agility/content-fetch's buildBaseUrl.
 *
 * The region is derived from the guid suffix, so no manual configuration is
 * needed in the common case:
 *   -u   → https://api.aglty.io/{guid}       (USA)
 *   -c   → https://api-ca.aglty.io/{guid}    (Canada)
 *   -e   → https://api-eu.aglty.io/{guid}    (Europe)
 *   -a   → https://api-aus.aglty.io/{guid}   (Australia)
 *   -d   → https://api-dev.aglty.io/{guid}   (Dev)
 *   -us2 → https://api-usa2.aglty.io/{guid}  (USA 2)
 * Anything else falls back to the legacy host https://{guid}-api.agilitycms.cloud.
 *
 * Returns the base url with the guid already appended, so callers append only
 * the `/{fetch|preview}/{locale}/item/{contentID}` portion.
 */
const BASE_URL_SUFFIXES: { [env: string]: string } = {
	u: "",
	c: "-ca",
	e: "-eu",
	a: "-aus",
	d: "-dev",
	us2: "-usa2"
}

export function getApiBaseUrl(guid: string): string {
	const match = guid.match(/-(us2|[ucead])$/)

	if (match) {
		const env = match[1]
		if (Object.prototype.hasOwnProperty.call(BASE_URL_SUFFIXES, env)) {
			return `https://api${BASE_URL_SUFFIXES[env]}.aglty.io/${guid}`
		}
	}

	return `https://${guid}-api.agilitycms.cloud`
}
