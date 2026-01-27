import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Heart, Bookmark } from "lucide-react";
import { Link } from "react-router";

interface FeedCardProps {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  creatorImage?: string;
  creatorId: string;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
}

export function FeedCard({
  id,
  imageUrl,
  title,
  location,
  creatorImage,
  creatorId,
  likes,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
}: FeedCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.(id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarked(!bookmarked);
    onBookmark?.(id);
  };

  return (
    <Link to={`/board/feed/${id}`} className="block">
      <div className="flex flex-col bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* 이미지 영역 */}
        <div className="relative w-full aspect-[6/7] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* 스크랩 버튼 */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background hover:scale-110 transition-transform cursor-pointer"
            onClick={handleBookmark}
          >
            <Bookmark
              className={`h-5 w-5 ${bookmarked ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        </div>

        {/* 좋아요 버튼 및 수 */}
        <div className="px-4 pt-3 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 p-0 h-auto hover:bg-transparent hover:scale-110 transition-transform cursor-pointer"
            onClick={handleLike}
          >
            <Heart
              className={`h-5 w-5 hover:scale-110 transition-transform cursor-pointer ${liked ? "fill-destructive text-destructive" : ""}`}
            />
            <span className="text-sm">{likeCount}</span>
          </Button>
        </div>

        {/* 제목 및 위치 */}
        <div className="px-4 pb-2">
          <h3 className="font-semibold text-base line-clamp-2 mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>

        {/* 크리에이터 정보 */}
        <div className="px-4 pb-4 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={creatorImage} alt={creatorId} />
            <AvatarFallback>{creatorId.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{creatorId}</span>
        </div>
      </div>
    </Link>
  );
}