export async function getAuthJwtToken() {
  try {
    const res = await fetch("/api/auth/token", {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) {
      return "";
    }

    const data = await res.json();
    return typeof data?.token === "string" ? data.token : "";
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return "";
  }
}
