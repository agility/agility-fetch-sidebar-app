import { useAgilityAppSDK, pageMethods, IPageItem } from "@agility/app-sdk"
import "@agility/plenum-ui/lib/tailwind.css"
import { useEffect, useState } from "react"
import FetchJSON from "@/components/FetchJSON"
import Loader from "@/components/Loader"
import { getApiBaseUrl } from "@/lib/getApiBaseUrl"

export default function PageSidebar() {
	const { initializing, instance, locale } = useAgilityAppSDK()
	const [pageItem, setPageItem] = useState<IPageItem | null>(null)

	// The SDK doesn't surface the page item on the context, so request it explicitly.
	useEffect(() => {
		if (initializing) return
		let cancelled = false
		Promise.resolve(pageMethods.getPageItem()).then((p) => {
			if (!cancelled) setPageItem(p ?? null)
		})
		return () => {
			cancelled = true
		}
	}, [initializing])

	if (initializing || !instance || !pageItem || !locale) {
		return (
			<div className="flex h-full w-full items-center justify-center p-4">
				<Loader />
			</div>
		)
	}

	return (
		<FetchJSON
			baseUrl={getApiBaseUrl(instance.guid)}
			entity="page"
			// ItemContainerID is the page id used by the Content Fetch API (matches the manager's pageID).
			entityID={pageItem.ItemContainerID}
			languageCode={pageItem.LanguageCode || locale}
		/>
	)
}
