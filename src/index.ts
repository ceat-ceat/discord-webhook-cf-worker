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
		const match = /^\/api\/webhooks\/(\d+)\/(.+)$/.test(url.pathname);

		if (!match) {
			return new Response(JSON.stringify({ no: "die" }), {
				status: 400,
				headers: {
					"content-type": "application/json"
				}
			})
		}

		const headers = new Headers(request.headers);
		headers.set("host", "discord.com");

		return fetch(`https://discord.com${url.pathname}`, {
			method: request.method,
			headers: headers,
			body: request.body
		})
	},
} satisfies ExportedHandler<Env>;
