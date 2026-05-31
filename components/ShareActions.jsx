const sharePlatforms = [
  {
    name: "Facebook",
    buildUrl: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.2 8.2V6.6c0-.7.5-.9.9-.9h2.2V2.1L14.2 2c-3.4 0-4.2 2.5-4.2 4.1v2.1H7.3V12H10v10h4.1V12h3.1l.5-3.8h-3.5Z" />
      </svg>
    )
  },
  {
    name: "LinkedIn",
    buildUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.7 8.8H2.8V21h3.9V8.8ZM4.8 3C3.5 3 2.6 3.9 2.6 5.1c0 1.2.9 2.1 2.1 2.1h.1c1.3 0 2.2-.9 2.2-2.1C7 3.9 6.1 3 4.8 3Zm16.6 11c0-3.7-2-5.5-4.7-5.5-2.2 0-3.1 1.2-3.7 2V8.8H9.2c.1 1.1 0 12.2 0 12.2h3.9v-6.8c0-.4 0-.7.1-1 .3-.7.9-1.5 2-1.5 1.4 0 2 1.1 2 2.8V21h3.9v-7Z" />
      </svg>
    )
  },
  {
    name: "WhatsApp",
    buildUrl: (url, title) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a9.8 9.8 0 0 0-8.5 14.7L2.3 22l5.4-1.4A9.8 9.8 0 1 0 12 2Zm0 17.8c-1.4 0-2.8-.4-4-1.1l-.3-.2-3.2.8.9-3.1-.2-.3a8 8 0 1 1 6.8 3.9Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    )
  }
];

export default function ShareActions({ url, title }) {
  return (
    <div className="content-share" aria-label={`Share ${title}`}>
      <span>Share</span>
      {sharePlatforms.map((platform) => (
        <a
          href={platform.buildUrl(url, title)}
          key={platform.name}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${platform.name}`}
          title={`Share on ${platform.name}`}
        >
          {platform.icon}
        </a>
      ))}
    </div>
  );
}
