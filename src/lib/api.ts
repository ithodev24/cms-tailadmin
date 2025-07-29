export async function fetchArticles(token?: string) {
  const res = await fetch(`http://localhost:3333/article`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  const data = await res.json();

  // Jika tidak array, kembalikan array kosong
  if (!Array.isArray(data?.data)) {
    console.warn("fetchArticles expected array but got:", data);
    return [];
  }

  return data.data;
}

export async function fetchArticleBySlug(slug: string, token?: string) {
  const res = await fetch(`http://localhost:3333/article/${slug}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

// export async function fetchCategories(token?: string) {
//   const res = await fetch("http://localhost:3333/category", {
//     headers: token ? { Authorization: `Bearer ${token}` } : {},
//     cache: "no-store",
//   });
//   const data = await res.json();
//   return Array.isArray(data.data) ? data.data : data;
// }

export async function updateArticle(slug: string, formData: FormData, token?: string) {
  const res = await fetch(`http://localhost:3333/article/${slug}`, {
    method: "POST", // Use POST for FormData, backend should handle it as an update
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal memperbarui artikel.");
  }

  return await res.json();
}