import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, Share2, Linkedin, Twitter, Facebook } from "lucide-react";
import { getPostBySlug, blogPosts } from "@/data/blog";
import { blogCategoryLabels } from "@/types";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug || "");
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <Layout>
        <div className="container-custom section-padding text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Button asChild><Link to="/blog">Back to Blog</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article>
        {/* Header */}
        <section className="bg-gradient-hero py-12">
          <div className="container-custom max-w-4xl">
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
            
            <Badge variant="outline" className="mb-4">{blogCategoryLabels[post.category]}</Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">{post.title}</h1>
            
            <div className="flex items-center gap-4">
              <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-medium text-foreground">{post.author.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.publishedAt}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <div className="container-custom max-w-4xl -mt-4">
          <img src={post.thumbnail} alt={post.title} className="w-full h-64 sm:h-96 object-cover rounded-xl" />
        </div>

        {/* Content */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-muted-foreground whitespace-pre-line">{post.content}</div>
            </div>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share this article:
                </span>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline"><Linkedin className="w-4 h-4" /></Button>
                  <Button size="icon" variant="outline"><Twitter className="w-4 h-4" /></Button>
                  <Button size="icon" variant="outline"><Facebook className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <Card className="bg-card border-border overflow-hidden card-hover group h-full">
                    <img src={relatedPost.thumbnail} alt={relatedPost.title} className="w-full h-40 object-cover" />
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">{relatedPost.readTime}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}