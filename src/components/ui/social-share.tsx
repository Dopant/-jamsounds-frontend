import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Copy,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
  excerpt?: string;
  className?: string;
}

export function SocialShare({ url, title, excerpt, className }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    if (platform === "instagram") {
      toast({
        title: "Instagram sharing",
        description: "Please share manually on Instagram by copying the link.",
      });
      return;
    }

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Share:</span>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare("twitter")}
        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
      >
        <Twitter className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare("facebook")}
        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
      >
        <Facebook className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare("linkedin")}
        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
      >
        <Linkedin className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare("instagram")}
        className="hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600"
      >
        <Instagram className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={copyToClipboard}
        className="hover:bg-green-50 hover:border-green-300 hover:text-green-600"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}