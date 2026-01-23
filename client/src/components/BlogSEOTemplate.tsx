import { SEOHead } from './SEOHead';
// AdvancedSEO component removed for optimization

interface BlogSEOTemplateProps {
  title: string;
  description: string;
  content: string;
  author?: string;
  publishDate: string;
  modifiedDate?: string;
  category: string;
  tags: string[];
  slug: string;
  image?: string;
  readingTime?: string;
  wordCount?: number;
}

export function BlogSEOTemplate({
  title,
  description,
  content,
  author = 'PlantRx Medical Team',
  publishDate,
  modifiedDate,
  category,
  tags,
  slug,
  image = 'https://plantrxapp.com/images/thumbnail.jpg',
  readingTime,
  wordCount
}: BlogSEOTemplateProps) {
  
  // Auto-generate enhanced meta description if not provided
  const enhancedDescription = description || 
    `${content.slice(0, 150).replace(/<[^>]*>/g, '').trim()}... | Expert PlantRx health guide with natural remedies and wellness tips.`;
  
  // Auto-generate SEO-optimized title
  const seoTitle = title.includes('PlantRx') ? title : `${title} | PlantRx Articles`;
  
  // Auto-generate keywords from tags and category
  const autoKeywords = [
    ...tags,
    category,
    'natural remedies',
    'herbal medicine', 
    'plant based health',
    'organic supplements',
    'PlantRx'
  ].join(', ');
  
  // Auto-calculate reading time if not provided
  const estimatedReadingTime = readingTime || 
    `${Math.max(1, Math.ceil((content.replace(/<[^>]*>/g, '').split(' ').length) / 200))} min read`;
  
  // Auto-calculate word count if not provided  
  const estimatedWordCount = wordCount || 
    content.replace(/<[^>]*>/g, '').split(' ').length;
  
  // Create breadcrumb navigation for SEO
  const breadcrumbs = [
    { name: 'Home', url: 'https://plantrxapp.com' },
    { name: 'Articles', url: 'https://plantrxapp.com/blog' },
    { name: category, url: `https://plantrxapp.com/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: title, url: `https://plantrxapp.com/blog/${slug}` }
  ];
  
  return (
    <>
      {/* Core SEO Meta Tags */}
      <SEOHead
        title={seoTitle}
        description={enhancedDescription}
        keywords={autoKeywords}
        canonical={`https://plantrxapp.com/blog/${slug}`}
        ogImage={image}
        ogType="article"
        author={author}
        publishedTime={publishDate}
        modifiedTime={modifiedDate}
        articleSection={category}
        articleTags={tags}
      />
      
      {/* Advanced Schema Markup for Articles - component removed for optimization */}
    </>
  );
}

// Simplified version for quick blog post SEO
export function QuickBlogSEO({
  title,
  description,
  tags = [],
  category = 'Health & Wellness',
  slug,
  author = 'PlantRx'
}: {
  title: string;
  description: string;
  tags?: string[];
  category?: string;
  slug: string;
  author?: string;
}) {
  const currentDate = new Date().toISOString();
  
  return (
    <BlogSEOTemplate
      title={title}
      description={description}
      content={description} // Use description as content for word count estimation
      author={author}
      publishDate={currentDate}
      category={category}
      tags={tags}
      slug={slug}
    />
  );
}