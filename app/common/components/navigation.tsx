import { Link, useLocation } from "react-router";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search as SearchIcon, BellIcon, LogOutIcon, MessageCircleIcon, SunIcon, MoonIcon, UserIcon, UserRoundIcon } from "lucide-react";
import { useTheme } from "~/hook/use-theme";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { LoginForm } from "~/auth/modal/login";
import { DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenu, 
    DropdownMenuLabel, 
    DropdownMenuSeparator,
    DropdownMenuGroup} from "./ui/dropdown-menu";

export default function Navigation({
    username, avatar, isLoggedIn, hasNotifications, hasMessages
}: {
    username: string;
    avatar: string;
    isLoggedIn: boolean;
    hasNotifications: boolean;
    hasMessages: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const isJoinPage = location.pathname === "/auth/join";
  const isBoardListPage = location.pathname === "/board/search";
  
  // board_list 페이지에서 전달된 검색 정보 가져오기
  const searchText = location.state?.region && location.state?.city 
    ? `${location.state.region}, ${location.state.city}`
    : "";

  const handleSearch = () => {
    // 검색 로직 (필요시 추가)
    console.log("Search clicked");
  };

  return (
    <>
    <nav className="flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/80 border-b">
        <div className="flex items-center gap-4">
            <Link to="/" className="font-bold tracking-tighter text-lg">LOCALFLOW</Link>
            <Separator orientation="vertical" className="h-6 mx-4"/>
            
            {/* board_list 페이지일 때만 검색창 표시 */}
            {isBoardListPage && searchText && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <div className="relative w-full max-w-md">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchText}
                    readOnly
                    className="pl-12 pr-12 py-2"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={handleSearch}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
        </div>
        
        {isLoggedIn ? 
        <div className="flex items-center gap-2">
            {/* 다크모드 토글 버튼 */}
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={toggleTheme}
              className="relative"
            >
              {theme === "dark" ? (
                <SunIcon className="size-4" />
              ) : (
                <MoonIcon className="size-4" />
              )}
            </Button>
            <Button size="icon" variant="ghost" asChild className="relative">
                <Link to="/my/notifications">
                <BellIcon className="size-4"/>
                {hasNotifications && (
                    <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"></div>
                )}
                </Link>
            </Button>
            <Button size="icon" variant="ghost" asChild className="relative">
                <Link to="/my/messages">
                <MessageCircleIcon className="size-4"/>
                {hasMessages && (
                    <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"></div>
                )}
                </Link>
            </Button>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button size="icon" variant="ghost" className="relative cursor-pointer">
                    <UserRoundIcon className="size-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                    <span className="font-medium">Sukhyang Choe</span>
                    <span className="text-xs text-muted-foreground">@username</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/my/profile">
                        <UserIcon className="size-4 mr-2"/>Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/auth/logout">
                        <LogOutIcon className="size-4 mr-2"/>Logout
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
        : (
            <div className="flex items-center gap-4">
                {/* 다크모드 토글 버튼 */}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <SunIcon className="size-4" />
                  ) : (
                    <MoonIcon className="size-4" />
                  )}
                </Button>

                {/* Login 버튼 - 모달 열기 */}
                <Button variant="outline" className={`text-xs cursor-pointer ${isJoinPage ? "hidden" : ""}`}
                    onClick={() => setIsLoginModalOpen(true)}>Login
                </Button>
            </div>
        )}
    </nav>

    {/* Login 모달 */}
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Enter your credentials to access your account.
        </DialogDescription>
      </DialogHeader>
      <LoginForm onSuccess={() => setIsLoginModalOpen(false)} />
    </DialogContent>
  </Dialog>
  </>
  );
}