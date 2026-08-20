export function hasDirectCowinNewsScopeSignal(value = "") {
  const text = String(value);
  if (/\b(magnetic separation|magnetic separator|tramp iron|ferrous|nonferrous|metal sorting|metal recovery|metal detection|conveyor|crusher|mineral processing|tailings|waste processing|food processing)\b/i.test(text)) return true;
  // Broad sectors such as recycling and cement are not enough on their own. They must
  // be tied to a process or operating decision before they can support a News article.
  return /\b(recycling|ore|cement|aggregate|food|waste)\b/i.test(text)
    && /\b(sort|separat|recover|process|plant|conveyor|crusher|contamin|metal|material handling|tailings)\b/i.test(text);
}
