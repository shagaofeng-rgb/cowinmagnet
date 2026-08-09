import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".tools/**",
      ".data/**",
      ".backups/**",
      ".logs/**",
      ".visual-check/**",
      "node_modules/**",
      "reports/**",
      "skill-export/**",
      "docs/final-audit/runtime/**"
    ]
  },
  ...nextVitals,
  {
    rules: {
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react/no-unescaped-entities": "warn"
    }
  }
];

export default eslintConfig;
