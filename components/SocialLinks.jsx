import BrandIcon from "@/components/BrandIcon";
import socialLinks from "@/data/socialLinks.json";

const platforms = [
  ["facebook", "Facebook"],
  ["instagram", "Instagram"],
  ["linkedin", "LinkedIn"]
];

export default function SocialLinks({ variant = "footer" }) {
  return (
    <div className={`social-links social-links-${variant}`} aria-label="Cowinmagnet social media links">
      {platforms.map(([key, label]) => (
        <a
          key={key}
          href={socialLinks[key]}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={`Follow Cowinmagnet on ${label}`}
          title={label}
        >
          <BrandIcon name={key} />
        </a>
      ))}
    </div>
  );
}
