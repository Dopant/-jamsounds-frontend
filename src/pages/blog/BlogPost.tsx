import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PublicNavigation from "@/components/layout/PublicNavigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MusicPlayer } from "@/components/ui/music-player";
import { MediaPlayer } from "@/components/ui/media-player";
import { SocialShare } from "@/components/ui/social-share";
import { 
  Calendar, 
  Clock, 
  Star, 
  Share2, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Heart,
  Play,
  Pause,
  Volume2,
  SkipBack,
  SkipForward,
  User,
  Eye,
  ThumbsUp,
  Music,
  TrendingUp
} from "lucide-react";
import { FaXTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa6';

// Utility to convert plain text to HTML with paragraphs and line breaks
function plainTextToHtml(text: string) {
  // If it looks like HTML, return as is
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  // Split by double newlines for paragraphs, single newline for <br>
  return text
    .split(/\n{2,}/)
    .map(paragraph =>
      `<p>${paragraph.replace(/\n/g, '<br />')}</p>`
    )
    .join('');
}

const BlogPost = () => {
  const { id } = useParams();
  console.log('BlogPost: id param', id);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    console.log('Fetching post with id:', id);
    fetch(`/api/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then(data => {
        console.log('Fetched post data:', data);
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch('/api/auth/settings/social-links');
        if (!res.ok) return;
        const data = await res.json();
        setSocialLinks(data);
      } catch {}
    }
    fetchSocialLinks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-muted-foreground">Loading post...</span>
      </div>
    );
  }
  if (error) {
    console.log('Error state:', error);
    return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link to="/blog">
          <Button>Return to Blog</Button>
        </Link>
      </div>
    </div>
  );
  }
  console.log('Rendering post:', post);

  // Use hero_image_url for the main image
  const heroImage = post.hero_image_url || post.image || '';
  // Split tags string into array
  const tags = typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : Array.isArray(post.tags) ? post.tags : [];
  // Use media array from backend
  const mediaItems = Array.isArray(post.media) ? post.media : [];
  // Use author object from backend
  const authorName = post.author?.name || 'Admin';
  const authorAvatar = post.author?.avatar || '';
  const authorBio = post.author?.bio || '';
  const postDate = post.created_at || post.date || '';
  const readTime = post.read_time || post.readTime || '—';

  // Add a fallback for relatedArticles to avoid linter/runtime errors
  const relatedArticles = [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleRatePost = async () => {
    setRatingLoading(true);
    try {
      await fetch(`/api/posts/${id}/rate`, { method: 'POST' });
      setPost((prev) => ({ ...prev, rating: (prev.rating || 0) + 1 }));
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      
      {/* Hero Image */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        {heroImage ? (
          <img 
            src={heroImage} 
            alt={post.title}
            className="w-full h-full object-cover"
            onError={e => e.currentTarget.style.display = 'none'}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.featured && (
                  <Badge className="bg-secondary text-secondary-foreground">Featured</Badge>
                )}
                <Badge className="bg-primary/20 text-primary border-primary">
                  {post.genre}
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <article className="lg:w-2/3">
              {/* Article Meta */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={authorAvatar || '/assets/default-avatar.png'} alt={authorName} />
                    <AvatarFallback>
                      {authorName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{authorName}</p>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(postDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{((post.views || 0) / 1000).toFixed(1)}K views</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full focus:outline-none"
                    onClick={handleRatePost}
                    disabled={ratingLoading}
                    title="Rate this post"
                  >
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium ml-1">{post.rating || 0}</span>
                  </button>
                </div>
              </div>

              {/* Audio Player */}
              {post.audioTrack && (
                <Card className="audio-player mb-8 animate-fade-in">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{post.audioTrack.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.audioTrack.artist}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {post.audioTrack.duration}
                    </div>
                  </div>
                </Card>
              )}

              {/* Media Items */}
              {mediaItems.length > 0 && (
                <div className="mb-8 space-y-4">
                  <h3 className="text-lg font-semibold">Featured Media</h3>
                  {mediaItems.map((item, index) => (
                    <MediaPlayer
                      key={index}
                      type={item.type}
                      mediaType={item.media_type}
                      platform={item.platform}
                      url={item.type === 'local' ? item.file_url : item.url}
                      title={item.title}
                      artist={item.artist}
                    />
                  ))}
                </div>
              )}

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert animate-fade-in"
                dangerouslySetInnerHTML={{ __html: plainTextToHtml(post.content) }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  )) : <span className="text-muted-foreground">No tags</span>}
                </div>
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <div className="flex items-center space-x-4">
                  
                 
                </div>
                
                <SocialShare
                  url={window.location.href}
                  title={post.title}
                  excerpt={post.excerpt}
                />
              </div>

              {/* Comments Section */}
              {commentsVisible && (
                <div className="mt-8 animate-fade-in">
                  <h3 className="text-xl font-semibold mb-6">Comments</h3>
                  <div className="space-y-6">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="flex space-x-4">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={comment.avatar} alt={comment.author} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(comment.date)}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{comment.content}</p>
                          <Button size="sm" variant="ghost" className="text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/3">
              <div className="sticky top-24 space-y-8">
                {/* Author Bio */}
                <Card className="p-6 animate-fade-in">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    About the Author
                  </h3>
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16 flex-shrink-0">
                      <AvatarImage src={authorAvatar} alt={authorName} />
                      <AvatarFallback>
                        {authorName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{authorName}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {authorBio}
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Twitter className="w-3 h-3 mr-1" />
                          Follow
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Related Articles */}
                <Card className="p-6 animate-slide-up stagger-1">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((article) => (
                      <Link key={article.id} to={`/blog/post/${article.id}`}>
                        <div className="group cursor-pointer">
                          <div className="flex space-x-3">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                {article.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{article.author}</span>
                                <span>•</span>
                                <span>{article.readTime}</span>
                              </div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {article.genre}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>

                {/* Newsletter Signup */}
                <Card className="p-6 bg-gradient-primary text-primary-foreground animate-slide-up stagger-2">
                  <h3 className="font-semibold mb-2">Never Miss a Beat</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Get the latest music reviews and industry insights delivered to your inbox.
                  </p>
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    Subscribe to Newsletter
                  </Button>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;