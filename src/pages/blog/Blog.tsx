import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedSearch } from "@/components/ui/enhanced-search";
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  TrendingUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Music,
  Clock,
  User
} from "lucide-react";

const genres = ["All Genres", "Electronic", "Hip-Hop", "Indie Rock", "Folk", "Pop", "Rock", "Jazz", "R&B", "Alternative", "Editorial"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const postsPerPage = 6;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingLoading, setRatingLoading] = useState({});
  const [popularPosts, setPopularPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [errorPopular, setErrorPopular] = useState(null);
  const [errorRecent, setErrorRecent] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/posts')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoadingPopular(true);
    fetch('/api/posts?category=popular&limit=4')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setPopularPosts(data);
        setErrorPopular(null);
        setLoadingPopular(false);
      })
      .catch(() => {
        setErrorPopular('Failed to load popular posts');
        setLoadingPopular(false);
      });
  }, []);

  useEffect(() => {
    setLoadingRecent(true);
    fetch('/api/posts?category=latest&limit=4')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setRecentPosts(data);
        setErrorRecent(null);
        setLoadingRecent(false);
      })
      .catch(() => {
        setErrorRecent('Failed to load recent reviews');
        setLoadingRecent(false);
      });
  }, []);

  // Filter and sort posts (filterBy handled client-side for now)
  let filteredPosts = posts
    .filter(post => {
      // Filter by genre
      if (selectedGenre !== 'All Genres' && post.genre !== selectedGenre) return false;
      // Filter by search term (title, excerpt, author)
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const inTitle = post.title?.toLowerCase().includes(term);
        const inExcerpt = post.excerpt?.toLowerCase().includes(term);
        const inAuthor = post.author?.name?.toLowerCase().includes(term);
        return inTitle || inExcerpt || inAuthor;
      }
      return true;
    })
    .filter(post => {
      // Additional filterBy logic (featured/recent)
      const matchesFilter = filterBy === "all" || 
        (filterBy === "featured" && post.featured) ||
        (filterBy === "recent" && new Date(post.created_at) > new Date(Date.now() - 7*24*60*60*1000));
      return matchesFilter;
    });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (!views) return '0 views';
    if (views >= 10000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const handleSubmitMusicRedirect = async () => {
    try {
      const res = await fetch('/api/auth/settings/submit-redirect-url');
      const data = await res.json();
      const url = data.url || 'https://example.com';
      window.location.href = url;
    } catch {
      window.location.href = 'https://example.com';
    }
  };

  const handleRatePost = async (postId) => {
    setRatingLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      await fetch(`/api/posts/${postId}/rate`, { method: 'POST' });
      setPosts((prev) => prev.map(p => p.id === postId ? { ...p, rating: (p.rating || 0) + 1 } : p));
    } finally {
      setRatingLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div>
      <PublicNavigation />
      
      {/* Header */}
      <section className="py-16 bg-gradient-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-playfair font-bold mb-6">
              Music Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover emerging artists, read in-depth reviews, and stay ahead of music trends
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles, artists, genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowAdvancedSearch(true)}
                onBlur={() => {
                  // Delay hiding to allow clicks on search results
                  setTimeout(() => setShowAdvancedSearch(false), 200);
                }}
                className="pl-12 pr-4 py-3 text-lg"
              />
              {showAdvancedSearch && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                  <EnhancedSearch
                    onSearch={(term) => setSearchTerm(term)}
                    onClose={() => setShowAdvancedSearch(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Filters and Sort */}
            <div className="mb-8 space-y-4 animate-slide-up">
              {/* Genre Filter */}
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedGenre === genre
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border hover:border-primary"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-sm text-muted-foreground">
                  {filteredPosts.length} articles found
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {currentPosts.map((post, index) => (
                <Link key={post.id} to={`/blog/post/${post.id}`} style={{ textDecoration: 'none' }}>
                  <Card className={`article-card group animate-scale-in stagger-${index + 1}`} tabIndex={0} style={{ cursor: 'pointer' }}>
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.hero_image_url || post.image || ''} 
                        alt={post.title}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={e => e.currentTarget.style.display = 'none'}
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {post.featured && (
                          <Badge className="bg-secondary text-secondary-foreground">
                            Featured
                          </Badge>
                        )}
                        <Badge className="genre-tag">
                          {post.genre}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button
                          className="flex items-center bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs focus:outline-none"
                          onClick={e => { e.preventDefault(); e.stopPropagation(); handleRatePost(post.id); }}
                          disabled={ratingLoading[post.id]}
                          title="Rate this post"
                        >
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {post.rating || 0}
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-2">
                          <img
                            src={post.author?.avatar || '/assets/default-avatar.png'}
                            alt={post.author?.name || 'Admin'}
                            className="w-6 h-6 rounded-full object-cover border"
                            style={{ minWidth: 24, minHeight: 24 }}
                          />
                          <span>{post.author?.name || 'Admin'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.created_at || post.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{formatViews(post.views)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 animate-fade-in">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-8">
              {/* Popular Posts */}
              <Card className="p-6 animate-fade-in">
                <h3 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Popular This Week
                </h3>
                <div className="space-y-4">
                  {loadingPopular ? (
                    <div>Loading popular posts...</div>
                  ) : errorPopular ? (
                    <div className="text-red-500">{errorPopular}</div>
                  ) : popularPosts.length === 0 ? (
                    <div className="text-muted-foreground">No popular posts found.</div>
                  ) : (
                    popularPosts.map((post, index) => (
                      <Link key={post.id} to={`/blog/post/${post.id}`}>
                        <div className="group cursor-pointer">
                          <div className="flex space-x-3">
                            <img 
                              src={post.hero_image_url || post.image || ''} 
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                {post.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{post.author?.name || 'Admin'}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {post.genre}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </Card>

              {/* Recent Reviews */}
              <Card className="p-6 animate-slide-up stagger-1">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Recent Reviews
                </h3>
                <div className="space-y-4">
                  {loadingRecent ? (
                    <div>Loading recent reviews...</div>
                  ) : errorRecent ? (
                    <div className="text-red-500">{errorRecent}</div>
                  ) : recentPosts.length === 0 ? (
                    <div className="text-muted-foreground">No recent reviews found.</div>
                  ) : (
                    recentPosts.map((post, index) => (
                      <Link key={post.id} to={`/blog/post/${post.id}`}>
                        <div className="group cursor-pointer">
                          <div className="flex space-x-3">
                            <img 
                              src={post.hero_image_url || post.image || ''} 
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                {post.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{post.author?.name || 'Admin'}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {post.genre}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </Card>

              {/* Genre Categories */}
              <Card className="p-6 animate-slide-up stagger-2">
                <h3 className="font-semibold mb-4">Genre Categories</h3>
                <div className="space-y-2">
                  {genres.slice(1).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedGenre === genre
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Newsletter Subscription */}
              <Card className="p-6 bg-gradient-secondary text-secondary-foreground animate-slide-up stagger-3">
                <h3 className="font-semibold mb-2">Subscribe to Newsletter</h3>
                <p className="text-secondary-foreground/80 text-sm mb-4">
                  Stay updated with the latest music reviews and industry trends
                </p>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    id="newsletter-email"
                  />
                  <Button 
                    className="w-full bg-white text-secondary hover:bg-white/90"
                    onClick={() => {
                      const email = (document.getElementById('newsletter-email') as HTMLInputElement)?.value;
                      if (email && /\S+@\S+\.\S+/.test(email)) {
                        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
                        if (!subscribers.includes(email)) {
                          subscribers.push(email);
                          localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                          localStorage.setItem('subscriberCount', subscribers.length.toString());
                          (document.getElementById('newsletter-email') as HTMLInputElement).value = '';
                          alert('Successfully subscribed to newsletter!');
                        } else {
                          alert('Email already subscribed!');
                        }
                      } else {
                        alert('Please enter a valid email address');
                      }
                    }}
                  >
                    Subscribe
                  </Button>
                </div>
              </Card>

              {/* Call to Action */}
              <Card className="p-6 bg-gradient-primary text-primary-foreground animate-slide-up stagger-4">
                <h3 className="font-semibold mb-2">Share Your Music</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Ready to get your music reviewed by our expert curators?
                </p>
                <Button className="w-full bg-white text-primary hover:bg-white/90" onClick={handleSubmitMusicRedirect}>
                  Submit Your Track
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;