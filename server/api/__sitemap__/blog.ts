export default defineSitemapEventHandler(async () => {
  const { public: runtimeConfig } = useRuntimeConfig();

  const result = await db.query.Article.findMany({
    where: (fields, { eq }) => eq(fields.published, true),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
  });

  return result.map((data) => ({
    loc: `/blog/${data.slug}`,
    lastmod: data.createdAt,
    changefreq: "monthly",
    priority: 1,
    images: [
      {
        loc: `${runtimeConfig.assetUrl}/thumbnails/${data.thumbnail}`,
        title: data.title,
      },
    ],
  }));
});
