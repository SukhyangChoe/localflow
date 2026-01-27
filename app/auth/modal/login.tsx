import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Separator } from "~/common/components/ui/separator";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 여기에 로그인 로직 추가
      // await login(email, password);
      
      // 성공 시
      onSuccess?.();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      {/* 소셜 로그인 버튼들 */}
      <div className="space-y-3 pt-2">
        <Button type="button" variant="outline" className="w-full">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google로 로그인
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black dark:bg-[#FEE500] dark:hover:bg-[#FEE500]/90 dark:text-black"
        >
          Kakao로 로그인
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white dark:bg-[#03C75A] dark:hover:bg-[#03C75A]/90 dark:text-white"
        >
          Naver로 로그인
        </Button>
      </div>

      {/* 구분선 */}
      <div className="relative py-4">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-2 text-sm text-muted-foreground">또는</span>
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <Button type="button" variant="outline" className="w-full" asChild
      onClick={() => {onSuccess?.();}}>
        <Link to="/auth/join">회원가입</Link>
      </Button>
    </form>
  );
}