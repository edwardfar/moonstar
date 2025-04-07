module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Temporarily disable these rules:
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@next/next/no-html-link-for-pages": "off",
  },
};
