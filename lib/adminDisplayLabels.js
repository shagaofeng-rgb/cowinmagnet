const labels = {
  direct: "直接访问",
  organic_search: "自然搜索",
  paid_search: "付费搜索",
  organic_social: "社交媒体",
  paid_social: "付费社交媒体",
  referral: "外部推荐",
  email: "邮件",
  unknown: "未知",
  desktop: "电脑端",
  mobile: "手机端",
  tablet: "平板端"
};

export function displayAdminLabel(value) {
  const text = String(value || "").trim();
  return labels[text.toLowerCase()] || text || "-";
}
