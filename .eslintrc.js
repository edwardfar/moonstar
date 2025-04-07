module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disable rule for unused variables
    "@typescript-eslint/no-unused-vars": "off",
    // Disable rule for explicit any temporarily
    "@typescript-eslint/no-explicit-any": "off",
    // Disable the rule that prevents using <a> for internal navigation
    "@next/next/no-html-link-for-pages": "off",
    // You can disable other rules as needed
  },
};
