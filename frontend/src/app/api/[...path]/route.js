const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handler(request, { params }) {
  const path = (await params).path.join("/");
  const search = new URL(request.url).search;
  const targetUrl = `${BACKEND_URL}/api/${path}${search}`;

  const headers = new Headers(request.headers);
  headers.set("ngrok-skip-browser-warning", "true");
  headers.delete("host");

  const fetchOptions = { method: request.method, headers };

  if (!["GET", "HEAD"].includes(request.method)) {
    fetchOptions.body = await request.text();
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ detail: "Failed to reach backend server." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
