const PROXY_BASE_URL = "https://api.tempolabs.ai/proxy";

export async function proxyFetch(url: string, options: RequestInit) {
  const proxyUrl = `${PROXY_BASE_URL}?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response;
}
