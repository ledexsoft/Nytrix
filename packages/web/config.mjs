const stage = process.env.SST_STAGE || "dev"

export default {
  url: process.env.NYTRIX_SITE_URL,
  console: stage === "production" ? "https://opencode.ai/auth" : `https://${stage}.opencode.ai/auth`,
  contact: "https://github.com/ledexsoft/Nytrix/discussions",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/ledexsoft/Nytrix",
  discord: "https://github.com/ledexsoft/Nytrix/discussions",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
