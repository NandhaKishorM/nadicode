// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

require("dotenv").config();

const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Jan",
  tagline: "Run your own AI",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://jan.ai",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "janhq", // Usually your GitHub org/user name.
  projectName: "jan", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  trailingSlash: true,
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
  },

  noIndex: false,

  // Plugins we added
  plugins: [
    "docusaurus-plugin-sass",
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    [
      "posthog-docusaurus",
      {
        apiKey: process.env.POSTHOG_PROJECT_API_KEY || "XXX",
        appUrl: process.env.POSTHOG_APP_URL || "XXX", // optional
        enableInDevelopment: false, // optional
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/troubleshooting/failed-to-fetch",
            to: "/troubleshooting/somethings-amiss",
          },
          {
            from: "/guides/troubleshooting/gpu-not-used/",
            to: "/troubleshooting/gpu-not-used",
          },
        ],
      },
    ],
  ],

  // The classic preset will relay each option entry to the respective sub plugin/theme.
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        // Will be passed to @docusaurus/plugin-content-docs (false to disable)
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/janhq/jan/tree/main/docs",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        // Will be passed to @docusaurus/plugin-content-sitemap (false to disable)
        sitemap: {
          changefreq: "daily",
          priority: 1.0,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        // Will be passed to @docusaurus/plugin-content-blog (false to disable)
        blog: {
          blogSidebarTitle: "All Posts",
          blogSidebarCount: "ALL",
        },
        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: require.resolve("./src/styles/main.scss"),
        },
        // GTM is always inactive in development and only active in production to avoid polluting the analytics statistics.
        googleTagManager: {
          containerId: process.env.GTM_ID || "XXX",
        },
        // Will be passed to @docusaurus/plugin-content-pages (false to disable)
        // pages: {},
      },
    ],
    // Redoc preset
    [
      "redocusaurus",
      {
        specs: [
          {
            spec: "openapi/jan.yaml", // can be local file, url, or parsed json object
            route: "/api-reference/", // path where to render docs
          },
        ],
        theme: {
          primaryColor: "#1a73e8",
          primaryColorDark: "#1a73e8",
          options: {
            requiredPropsFirst: true,
            noAutoAuth: true,
            hideDownloadButton: true,
          },
        },
      },
    ],
  ],

  // Docs: https://docusaurus.io/docs/api/themes/configuration
  themeConfig: {
    image: "img/og-image.png",
    // Only for react live
    liveCodeBlock: {
      playgroundPosition: "bottom",
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
    // Agolia DocSearch
    algolia: {
      appId: process.env.ALGOLIA_APP_ID || "XXX",
      apiKey: process.env.ALGOLIA_API_KEY || "XXX",
      indexName: "jan",
      insights: true,
      debug: false,
    },
    // SEO Docusarus
    metadata: [
      {
        name: "description",
        content:
          "Jan runs 100% offline on your computer, utilizes open-source AI models, prioritizes privacy, and is highly customizable.",
      },
      {
        name: "keywords",
        content:
          "Jan AI,  Jan, ChatGPT alternative, local AI, private AI, conversational AI, no-subscription fee, large language model ",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "Jan | Open-source ChatGPT Alternative",
      },
      {
        property: "og:description",
        content:
          "Jan runs 100% offline on your computer, utilizes open-source AI models, prioritizes privacy, and is highly customizable.",
      },
      {
        property: "og:image",
        content: "https://jan.ai/img/og-image.png",
      },
      { property: "og:type", content: "website" },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:site", content: "@janhq_" },
      {
        property: "twitter:title",
        content: "Jan | Open-source ChatGPT Alternative",
      },
      {
        property: "twitter:description",
        content:
          "Jan runs 100% offline on your computer, utilizes open-source AI models, prioritizes privacy, and is highly customizable.",
      },
      {
        property: "twitter:image",
        content: "https://jan.ai/img/og-image.png",
      },
    ],
    headTags: [
      // Declare a <link> preconnect tag
      {
        tagName: "link",
        attributes: {
          rel: "preconnect",
          href: "https://jan.ai/",
        },
      },
      // Declare some json-ld structured data
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "localAI",
          name: "Jan",
          description:
            "Jan runs 100% offline on your computer, utilizes open-source AI models, prioritizes privacy, and is highly customizable.",
          keywords:
            "Jan AI,  Jan, ChatGPT alternative, local AI, private AI, conversational AI, no-subscription fee, large language model ",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Multiple",
          url: "https://jan.ai/",
        }),
      },
    ],
    navbar: {
      title: "Jan",
      logo: {
        alt: "Jan Logo",
        src: "img/logo.svg",
      },
      items: [
        // Navbar Left
        {
          type: "docSidebar",
          sidebarId: "guidesSidebar",
          position: "left",
          label: "Guides",
        },
        {
          type: "docSidebar",
          sidebarId: "developerSidebar",
          position: "left",
          label: "Developer",
        },
        {
          position: "left",
          to: "/api-reference",
          label: "API Reference",
        },
        {
          type: "docSidebar",
          position: "left",
          sidebarId: "docsSidebar",
          label: "Framework",
        },
        // Navbar right
        {
          type: "docSidebar",
          position: "right",
          sidebarId: "communitySidebar",
          label: "Community",
        },
        {
          to: "blog",
          label: "Blog",
          position: "right",
        },
        {
          type: "docSidebar",
          sidebarId: "aboutSidebar",
          position: "right",
          label: "About",
        },
      ],
    },
    prism: {
      theme: darkCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: [
        "python",
        "powershell",
        "bash",
        "json",
        "javascript",
        "jsx",
      ],
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
  },
  themes: ["@docusaurus/theme-live-codeblock", "@docusaurus/theme-mermaid"],
};

module.exports = config;
