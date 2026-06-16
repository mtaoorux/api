
const ORIGIN = "https://rarestudy.in";
const PROXY_DOMAIN = "https://api.mtaiirus.workers.dev";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const originURL = new URL(url.pathname + url.search, ORIGIN);

    const headers = new Headers(request.headers);
    headers.set("Host", new URL(ORIGIN).hostname);
    headers.delete("cf-connecting-ip");
    headers.delete("cf-ipcountry");
    headers.delete("cf-ray");
    headers.delete("cf-visitor");

    const originResponse = await fetch(originURL.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
      redirect: "follow",
    });

    const responseHeaders = new Headers(originResponse.headers);
    responseHeaders.delete("x-frame-options");
    responseHeaders.delete("content-security-policy");
    responseHeaders.set("x-proxied-by", "api.mtaiirus.workers.dev");

    const contentType = originResponse.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      let body = await originResponse.text();
      body = body
        .replaceAll("https://rarestudy.in", PROXY_DOMAIN)
        .replaceAll("http://rarestudy.in", PROXY_DOMAIN)
        .replaceAll("//rarestudy.in", "//api.mtaiirus.workers.dev");

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
