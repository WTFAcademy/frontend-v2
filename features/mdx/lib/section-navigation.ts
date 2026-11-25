// Runs after HTML sanitization. Only text copied from headings enters the TOC.
type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

function text(node: Node): string {
  return node.value ?? node.children?.map(text).join("") ?? "";
}

export const sectionNavigation = (locale: string) => (tree: Node) => {
  const entries: Node[] = [];
  const ids = new Set<string>();
  for (const node of tree.children ?? []) {
    if (node.tagName !== "h2" && node.tagName !== "h3") continue;
    const title = text(node).trim();
    if (!title) continue;
    const base = "section-" + (title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "heading");
    let id = base;
    for (let i = 2; ids.has(id); i++) id = base + "-" + i;
    ids.add(id);
    node.properties ??= {};
    node.properties.id ??= id;
    entries.push({type: "element", tagName: "li", properties: {}, children: [
      {type: "element", tagName: "a", properties: {href: "#" + node.properties.id}, children: [{type: "text", value: title}]},
    ]});
  }
  if (entries.length > 1) {
    tree.children?.unshift({type: "element", tagName: "details", properties: {}, children: [
      {type: "element", tagName: "summary", properties: {}, children: [{type: "text", value: locale === "zh" ? "本章目录" : "On this page"}]},
      {type: "element", tagName: "ol", properties: {}, children: entries},
    ]});
  }
};
