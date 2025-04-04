import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { toast } from '../hooks/use-toast';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
}

const ShareButton = ({ url, title, description, compact = false }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Make sure we have the full URL
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  
  const shareContent = {
    title,
    text: description || title,
    url: fullUrl,
  };
  
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(shareContent);
        toast({
          title: "Shared successfully",
          duration: 2000,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Error sharing content:", error);
        }
      }
    } else {
      setIsOpen(true);
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      toast({
        title: "Link copied to clipboard",
        duration: 2000,
      });
      setIsOpen(false);
    });
  };
  
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank');
    setIsOpen(false);
  };
  
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(facebookUrl, '_blank');
    setIsOpen(false);
  };
  
  // If the browser supports native share API and we're on mobile, show a simple button
  if (typeof navigator !== 'undefined' && 'share' in navigator && window.innerWidth < 768) {
    return (
      <Button 
        variant="ghost" 
        size={compact ? "sm" : "default"}
        onClick={handleShare}
        className={compact ? "p-1 h-auto" : ""}
      >
        <Share2 className={compact ? "h-4 w-4" : "h-5 w-5 mr-2"} />
        {!compact && <span>Share</span>}
      </Button>
    );
  }
  
  // Otherwise, show a dropdown with various share options
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={compact ? "sm" : "default"}
          className={compact ? "p-1 h-auto" : ""}
        >
          <Share2 className={compact ? "h-4 w-4" : "h-5 w-5 mr-2"} />
          {!compact && <span>Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-2 text-[#4267B2]" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;