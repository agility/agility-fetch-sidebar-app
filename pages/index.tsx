import Head from "next/head"
import '@agility/plenum-ui/lib/tailwind.css';

export default function Home() {
	return (
		<>
			<Head>
				<title>Fetch API JSON Viewer for Agility</title>
				<meta name="description" content="View the raw Agility Content Fetch API JSON for a content item." />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="m-10">
				<h1 className="text-3xl font-bold">Fetch API JSON Viewer for Agility</h1>
				<p>This app adds a content item sidebar that shows the raw JSON returned by the Agility Content Fetch API.</p>
				<p>
					See the app definition file{" "}
					<a className="text-blue-500 hover:text-blue-600" href="/.well-known/agility-app.json">
						here
					</a>
					.
				</p>
			</main>
		</>
	)
}
