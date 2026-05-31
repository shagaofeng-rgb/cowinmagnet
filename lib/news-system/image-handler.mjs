function safeImagePrompt(item, productMatch) {
  return [
    "Professional B2B industrial website image, documentary style, no logos, no readable text.",
    `Scene: ${productMatch.category} used in ${item.industry || "mining, recycling or bulk material handling"}.`,
    "Show conveyor belts, material flow, magnetic separator equipment, realistic factory lighting, clean composition.",
    "Avoid accident exploitation, injured people, copyrighted brand marks, political imagery."
  ].join(" ");
}

export async function buildImagePlan(item, productMatch) {
  return {
    originalImageUrl: "",
    copyrightNote:
      "Use only licensed source images, embedded source previews, owned product photos, or AI-generated visuals. Do not copy news-site images without permission.",
    suggestedImages: [
      {
        purpose: "News context hero image",
        placement: "Top of article",
        caption: "Magnetic separation equipment can support safer bulk material handling when ferrous contamination is a concern.",
        alt: `${productMatch.category} for industrial material handling`,
        aiPrompt: safeImagePrompt(item, productMatch)
      },
      {
        purpose: "Product viewpoint image",
        placement: "Cowinmagnet viewpoint section",
        caption: "Product selection should consider belt width, burden depth, material type and cleaning method.",
        alt: "Overband magnetic separator selection for conveyor protection",
        aiPrompt:
          "Close-up industrial product photo of a suspended overband magnetic separator above a conveyor belt, black and yellow technology style, realistic lighting, no text, no logos."
      }
    ]
  };
}
