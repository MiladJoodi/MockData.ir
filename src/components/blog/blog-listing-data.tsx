import { BlogListing } from "@/components/blog/blog-listing";
import type { BlogCategory } from "@/lib/blog/categories";
import { BLOG_PAGE_SIZE } from "@/lib/blog/config";
import {
  isValidBlogPage,
  listPublishedPostListItems,
  listPublishedPostListItemsByCategory,
  paginatePosts,
  type BlogPostListItem,
} from "@/lib/blog/posts";

export type BlogListingPageModel = {
  /** Full published catalog — client filters by category without refetch. */
  allItems: BlogPostListItem[];
  page: number;
  totalPages: number;
  total: number;
  activeCategory: BlogCategory | null;
};

export async function loadBlogListingPage(options: {
  page: number;
  category?: BlogCategory | null;
}): Promise<BlogListingPageModel | "not-found"> {
  const category = options.category ?? null;
  const [allItems, scoped] = await Promise.all([
    listPublishedPostListItems(),
    category
      ? listPublishedPostListItemsByCategory(category)
      : null,
  ]);

  const scopedPosts = scoped ?? allItems;
  const paginated = paginatePosts(scopedPosts, options.page, BLOG_PAGE_SIZE);

  if (!isValidBlogPage(options.page, paginated.totalPages)) {
    return "not-found";
  }

  if (paginated.total === 0 && options.page !== 1) {
    return "not-found";
  }

  return {
    allItems,
    page: paginated.page,
    totalPages: paginated.totalPages,
    total: paginated.total,
    activeCategory: category,
  };
}

export function BlogListingView(model: BlogListingPageModel) {
  return (
    <BlogListing
      allItems={model.allItems}
      page={model.page}
      activeCategory={model.activeCategory}
    />
  );
}
