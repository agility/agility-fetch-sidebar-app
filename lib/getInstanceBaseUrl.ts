import { getApiBaseUrl } from "./getApiBaseUrl"

interface InstanceLike {
	guid: string
	/** Provided by newer manager builds via the SDK; falls back to guid-based derivation. */
	baseUrl?: string
}

/**
 * Resolves the Content Fetch API base url (including the guid) for an instance.
 *
 * Prefers the `baseUrl` the manager sends through the SDK (authoritative,
 * region-aware), and falls back to deriving it from the guid suffix so the app
 * still works against managers that don't yet send it.
 */
export function getInstanceBaseUrl(instance: InstanceLike | null): string {
	if (!instance) return ""
	return (instance.baseUrl || getApiBaseUrl(instance.guid)).replace(/\/+$/, "")
}
