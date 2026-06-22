import { useAgilityAppSDK } from "@agility/app-sdk"
import "@agility/plenum-ui/lib/tailwind.css"
import FetchJSON from "@/components/FetchJSON"
import Loader from "@/components/Loader"

export default function ContentItemSidebar() {
	const { initializing, instance, locale, contentItem } = useAgilityAppSDK()

	// Wait for the SDK to hand us the instance + the item we're rendering for.
	if (initializing || !instance || !contentItem || !locale) {
		return (
			<div className="flex h-full w-full items-center justify-center p-4">
				<Loader />
			</div>
		)
	}

	return (
		<FetchJSON
			baseUrl={getInstanceBaseUrl(instance)}
			entity="item"
			entityID={contentItem.contentID}
			languageCode={locale}
		/>
	)
}
