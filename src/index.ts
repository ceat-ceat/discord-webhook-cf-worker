/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const match = url.pathname.match(/^\/(\d+)\/(.+)$/);

		console.log(url);

		const errorText = `
uh oh! you did not provide webhook information correctly!

please do it like this:

https://discord.com/api/webhooks/[CHANNEL_ID]/[TOKEN] -> ${url.origin}/[CHANNEL_ID]/[TOKEN]
`

		if (!match) {
			return new Response(errorText, {
				status: 400,
				headers: {
					"content-type": "text/plain"
				}
			})
		}

		const [, channelId, token] = match;

		const headers = new Headers(request.headers);
		headers.set("host", "discord.com");

		return fetch(`https://discord.com/api/webhooks/${channelId}/${token}`, {
			method: request.method,
			headers: headers,
			body: request.body
		})
	},
} satisfies ExportedHandler<Env>;
