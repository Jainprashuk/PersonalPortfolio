import matter from "gray-matter";

export function safeMatter(fileContent, slug) {
  try {
    return matter(fileContent);
  } catch {
    const titleMatch = fileContent.match(/^title:\s*(.+)$/m);
    const dateMatch = fileContent.match(/^date:\s*(.+)$/m);
    const descriptionMatch = fileContent.match(/^description:\s*(.+)$/m);
    const content = fileContent.replace(/^---[\s\S]*?---/, "").trim();

    return {
      content,
      data: {
        title: titleMatch ? titleMatch[1].trim() : slug.replaceAll("-", " "),
        date: dateMatch ? dateMatch[1].trim() : null,
        description: descriptionMatch ? descriptionMatch[1].trim() : null,
      },
    };
  }
}

export function estimateReadTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
