const ORIGIN = "https://rarestudy.in";
const PROXY_DOMAIN = "https://api.mtaiirus.workers.dev";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Build origin URL
    const originURL = new URL(url.pathname + url.search, ORIGIN);

    // Rewrite request headers
    const headers = new Headers(request.headers);
    headers.set("Host", new URL(ORIGIN).hostname);
    headers.set("X-Forwarded-Host", url.hostname);
    headers.set("X-Forwarded-For", request.headers.get("cf-connecting-ip") || "");
    headers.delete("cf-connecting-ip");
    headers.delete("cf-ipcountry");
    headers.delete("cf-ray");
    headers.delete("cf-visitor");

    // Forward request to origin
    const originResponse = await fetch(originURL.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
      redirect: "follow",
    });

    // Rewrite response headers
    const responseHeaders = new Headers(originResponse.headers);
    responseHeaders.delete("x-frame-options");
    responseHeaders.delete("content-security-policy");
    responseHeaders.delete("x-content-type-options");
    responseHeaders.set("x-proxied-by", "api.mtaiirus.workers.dev");

    // Rewrite HTML body — replace origin domain with proxy domain
    const contentType = originResponse.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      let body = await originResponse.text();
      body = body
        .replaceAll("https://rarestudy.in", PROXY_DOMAIN)
        .replaceAll("http://rarestudy.in", PROXY_DOMAIN)
        .replaceAll("//rarestudy.in", "//api.mtaiirus.workers.dev");

      responseHeaders.set("content-type", "text/html; charset=utf-8");

      return new Response(body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: responseHeaders,
      });
    }

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers: responseHeaders,
    });
  },
};
