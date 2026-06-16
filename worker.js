
const ORIGIN = "https://rarestudy.in";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Build the origin URL
    const originURL = new URL(url.pathname + url.search, ORIGIN);

    // Clone request headers and update Host
    const headers = new Headers(request.headers);
    headers.set("Host", new URL(ORIGIN).hostname);
    headers.delete("cf-connecting-ip");
    headers.delete("cf-ipcountry");
    headers.delete("cf-ray");
    headers.delete("cf-visitor");

    // Forward the request to the origin
    const originRequest = new Request(originURL.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
      redirect: "follow",
    });

    let response = await fetch(originRequest);

    // Rewrite response headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("x-frame-options");
    responseHeaders.delete("content-security-policy");
    responseHeaders.set("x-proxied-by", "api.mtaiirus.workers.dev");

    // Rewrite HTML links so they stay on your domain
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      let body = await response.text();

      // Replace absolute URLs pointing to the origin
      body = body.replaceAll(
        /https?:\/\/rarestudy\.in/g,
        "https://api.mtaiirus.workers.dev"
      );

      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};
