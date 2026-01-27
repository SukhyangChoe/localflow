import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import type { MetaFunction } from "react-router";
import { FilterBar } from "~/common/components/filter";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "~/common/components/ui/pagination";
import { FeedCard } from "../components/feed-card";

export const meta: MetaFunction = () => {
  return [
    { title: "Search - LOCALFLOW" },
    { name: "description", content: "Search travel plans" },
  ];
};

// 임시 더미 데이터 (실제로는 API에서 가져올 데이터)
const generateDummyFeeds = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `feed-${i + 1}`,
    imageUrl: `https://picsum.photos/300/400?random=${i + 1}`,
    title: `Amazing Travel Experience ${i + 1}`,
    location: "Seoul, South Korea",
    creatorImage: `https://i.pravatar.cc/150?img=${i + 1}`,
    creatorId: `user${i + 1}`,
    likes: Math.floor(Math.random() * 1000),
    isLiked: Math.random() > 0.5,
    isBookmarked: Math.random() > 0.7,
  }));
};

export default function BoardListPage() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 35;
  const totalItems = 100; // 실제로는 API에서 받아올 총 개수
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 선택형 홈에서 전달된 데이터 받기
  const searchParams = new URLSearchParams(location.search);
  const initialData = location.state || {
    region: searchParams.get("region") || "",
    city: searchParams.get("city") || "",
    theme: searchParams.get("theme") || "",
    subTheme: searchParams.get("subTheme") || "",
    season: searchParams.get("season") || "",
    groupSize: searchParams.get("groupSize") || "",
    walkingLevel: searchParams.get("walkingLevel") || "",
    travelDates: searchParams.get("travelDates") || "",
  };

  // 현재 페이지의 피드 데이터 (실제로는 API 호출)
  const feeds = generateDummyFeeds(itemsPerPage);

  const handleFilterChange = (filters: any) => {
    // 필터 변경 시 처리 로직
    console.log("Filters changed:", filters);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  };

  const handleLike = (id: string) => {
    console.log("Like feed:", id);
    // 좋아요 처리 로직
  };

  const handleBookmark = (id: string) => {
    console.log("Bookmark feed:", id);
    // 북마크 처리 로직
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Filter Bar */}
      <FilterBar 
        initialFilters={{
          theme: initialData.theme || "",
          subTheme: initialData.subTheme || "",
          season: initialData.season || "",
          groupSize: initialData.groupSize || "",
          walkingLevel: initialData.walkingLevel || "",
        }}
        onFilterChange={handleFilterChange}
      />

      {/* Content Area - Feed Cards */}
      <div className="container mx-auto px-4 py-7">
        <div className="grid grid-cols-7 gap-4">
          {feeds.map((feed) => (
            <FeedCard
              key={feed.id}
              {...feed}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}