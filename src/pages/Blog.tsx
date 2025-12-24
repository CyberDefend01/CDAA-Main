import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts, featuredPost } from "@/data/blog";
import { blogCategoryLabels } from "@/types";

export default function Blog() {
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-16">
        <div className="container-custom">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Blog</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Cybersecurity Insights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay updated with the latest in cybersecurity trends, threats, career advice, and best practices from our expert instructors.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* Featured Post */}
          {featuredPost && (
            <Link to={`/blog/${featuredPost.slug}`} className="block mb-12">
              <Card className="bg-card border-border overflow-hidden card-hover group">
                <div className="grid md:grid-cols-2">
                  <div className="relative overflow-hidden">
                    <img
                      src={featuredPost.thumbnail}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured</Badge>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge variant="outline" className="w-fit mb-4">
                      {blogCategoryLabels[featuredPost.category]}
                    </Badge>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{featuredPost.author.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          {featuredPost.publishedAt} · <Clock className="w-3 h-3" /> {featuredPost.readTime}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          )}

          {/* Blog Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="bg-card border-border overflow-hidden card-hover group h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-3 text-xs">
                      {blogCategoryLabels[post.category]}
                    </Badge>
                    <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.publishedAt}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}