import cn from "classnames"
import { getAPIKey } from "@agility/app-sdk"
import { FiCopy, FiCheck, FiRefreshCw } from "react-icons/fi"
import { useCallback, useEffect, useMemo, useState } from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import Loader from "@/components/Loader"

type FetchMode = "live" | "preview"

interface Props {
	/** Content Fetch API base url, including the guid (e.g. https://api.aglty.io/{guid}). */
	baseUrl: string
	/** Which Fetch API endpoint to hit. */
	entity: "item" | "page"
	/** The id of the item/page to fetch. */
	entityID: number
	languageCode: string
}

/**
 * Renders the raw JSON returned by the Agility Content Fetch API for a single
 * content item or page, with a Live / Preview toggle, refresh, and copy.
 *
 * The API key is requested from the manager at fetch time via the App SDK's
 * `getAPIKey` message (no key configuration needed on the app), and the region
 * is baked into `baseUrl`.
 */
export default function FetchJSON({ baseUrl, entity, entityID, languageCode }: Props) {
	const [mode, setMode] = useState<FetchMode>("live")
	const [data, setData] = useState<unknown | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [copied, setCopied] = useState<boolean>(false)

	const prettyJSON = useMemo(() => (data !== null ? JSON.stringify(data, null, 2) : ""), [data])

	const handleCopy = useCallback(() => {
		if (!prettyJSON) return
		navigator.clipboard.writeText(prettyJSON)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}, [prettyJSON])

	const fetchJSON = useCallback(async () => {
		setLoading(true)
		setError(null)
		setData(null)

		const apiPath = mode === "preview" ? "preview" : "fetch"
		const apiType = mode === "preview" ? "preview" : "fetch"
		const modeLabel = mode === "preview" ? "Preview" : "Live"

		try {
			//ask the manager for a ready-to-use API key of the right type
			const apiKey = await getAPIKey({ apiType })

			if (!apiKey) {
				setError(`No ${modeLabel} API key is available for this instance.`)
				return
			}

			const url = `${baseUrl}/${apiPath}/${languageCode}/${entity}/${entityID}?contentLinkDepth=1&expandAllContentLinks=false`

			const response = await fetch(url, {
				headers: {
					APIKey: apiKey,
					Accept: "application/json"
				}
			})

			if (!response.ok) {
				if (response.status === 404) {
					setError(
						`This ${entity} was not found on the ${modeLabel} API. It may not be published yet — try the Preview tab.`
					)
					return
				}
				setError(`Could not fetch the JSON (status ${response.status}).`)
				return
			}

			const result = await response.json()
			setData(result)
		} catch (e) {
			console.error("Error fetching JSON", e)
			setError("Could not fetch the JSON. Please try again.")
		} finally {
			setLoading(false)
		}
	}, [baseUrl, entity, entityID, languageCode, mode])

	// Fetch on mount and whenever the mode (or the item/page being viewed) changes.
	useEffect(() => {
		fetchJSON()
	}, [fetchJSON])

	return (
		<div className="flex h-full w-full flex-col gap-3 px-6 pb-4 pt-3">
			<div>
				<p className="text-sm text-gray-500">
					The JSON returned by the Agility Content Fetch API for this {entity}.
				</p>
			</div>

			<div className="flex items-center justify-between gap-2">
				<div className="inline-flex rounded-md border border-gray-200 p-0.5" role="tablist">
					{(["live", "preview"] as const).map((m) => (
						<button
							key={m}
							type="button"
							role="tab"
							aria-selected={mode === m}
							onClick={() => setMode(m)}
							className={cn(
								"rounded px-3 py-1 text-sm font-medium transition-colors",
								mode === m ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
							)}
						>
							{m === "live" ? "Live" : "Preview"}
						</button>
					))}
				</div>

				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => fetchJSON()}
						title="Refresh"
						className="text-gray-400 transition-colors hover:text-gray-600"
					>
						<FiRefreshCw className={cn("h-5 w-5", loading ? "animate-spin" : "")} />
					</button>
					{prettyJSON ? (
						<button
							type="button"
							onClick={handleCopy}
							title="Copy JSON"
							className="flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
						>
							{copied ? <FiCheck className="h-5 w-5" /> : <FiCopy className="h-5 w-5" />}
							{copied ? "Copied" : "Copy JSON"}
						</button>
					) : null}
				</div>
			</div>

			<div className="relative min-h-0 flex-1 overflow-auto rounded-md border border-gray-200 bg-gray-50">
				{loading ? (
					<div className="flex h-full items-center justify-center">
						<Loader />
					</div>
				) : error ? (
					<div className="p-4 text-sm text-red-600">{error}</div>
				) : prettyJSON ? (
					<SyntaxHighlighter
						language="json"
						style={githubGist}
						wrapLongLines
						customStyle={{
							margin: 0,
							padding: "12px",
							background: "none",
							fontSize: "12px"
						}}
					>
						{prettyJSON}
					</SyntaxHighlighter>
				) : (
					<div className="p-4 text-sm text-gray-500">No content was returned.</div>
				)}
			</div>
		</div>
	)
}
