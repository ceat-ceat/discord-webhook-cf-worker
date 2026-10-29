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
		const match = url.pathname.match(/^\/(\d+)\/([^/]+)\/?$/);

		const errorText = `
uh oh! you did not provide webhook information correctly!

please do it like this:

https://discord.com/api/webhooks/[CHANNEL_ID]/[TOKEN] -> ${url.origin}/[CHANNEL_ID]/[TOKEN]
`;

		if (!match) {
			return new Response(errorText, {
				status: 400,
				headers: { "content-type": "text/plain" }
			});
		}

		const [, channelId, token] = match;

		const discordUrl = `https://discord.com/api/webhooks/${channelId}/${token}`;

		const headers = new Headers(request.headers);
		// host header will be this worker,
		// so remove to make it the upstream host instead (discord)
		headers.delete("host");

		const options: RequestInit = {
			method: request.method,
			headers
		}

		// GET and HEAD requests should not have a body
		if (request.method !== "GET" && request.method !== "HEAD") {
			options.body = request.body;
		}

		try {
			return await fetch(discordUrl, options);
		} catch (e) {
			return new Response("unexpected failure", {
				status: 502,
				headers: { "content-type": "text/plain" }
			});
		}
	},
} satisfies ExportedHandler<Env>;
