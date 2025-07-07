export async function fetchArticles(token?: string) {
  const res = await fetch("http://localhost:3333/article", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : data;
}

export async function fetchCategories(token?: string) {
  const res = await fetch("http://localhost:3333/category", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : data;
}
