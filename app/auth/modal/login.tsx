import { z } from "zod";
import { useEffect } from "react";
import { Link, type ActionFunctionArgs, redirect, useFetcher, useNavigate } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Separator } from "~/common/components/ui/separator";
import { makeSSRClient } from "~/supa-client";

interface LoginFormProps {
  onSuccess?: () => void;
}

const formSchema = z.object({
  email: z.string({ message: "Email is required" }).email("Invalid email address"),
  password: z.string({ message: "Password is required" }).min(8, {message: "Password must be at least 8 characters long"}),
});

type ActionData = 
  | { loginErrors: null; formErrors: { email?: string[]; password?: string[] } }
  | { loginErrors: string; formErrors: null }
  | { success: true }
  | undefined;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  try {
    const parseResult = formSchema.safeParse(Object.fromEntries(formData));
    
    if (!parseResult.success) {
      return {
        loginErrors: null,
        formErrors: parseResult.error.flatten().fieldErrors,
      };
    }
    
    const { email, password } = parseResult.data;
    const { client, headers } = makeSSRClient(request);
    const { error: loginError } = await client.auth.signInWithPassword({
      email,
      password
    });
    
    if (loginError) {
      return {
        loginErrors: loginError.message,
        formErrors: null,
      };
    }

    // 성공 응답을 먼저 반환 (모달을 닫을 수 있게 함)
    // headers는 Response에 포함시켜 쿠키가 설정되도록 함
    const response = new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Set-Cookie 헤더들을 Response에 추가
    headers.forEach((value, key) => {
      response.headers.append(key, value);
    });
    return response;
  } catch (error) {
    // ZodError를 catch하여 안전하게 처리
    if (error instanceof z.ZodError) {
      return {
        loginErrors: null,
        formErrors: error.flatten().fieldErrors,
      };
    }
    throw error;
  }
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const actionData = fetcher.data as ActionData | undefined;
  const isSubmitting = fetcher.state === "submitting";

  // 로그인 성공 시 모달 닫기 및 리다이렉트
  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      onSuccess?.(); // 모달 닫기
      window.location.href = "/";
    }
  }, [actionData, onSuccess]);

  return (
    <fetcher.Form method="post" action="/auth/login" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          //value={email}
          //onChange={(e) => setEmail(e.target.value)}
          required
        />
        {actionData && "formErrors" in actionData && actionData.formErrors?.email && (
          <p className="text-sm text-destructive">
            {actionData.formErrors.email.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          //value={password}
          //onChange={(e) => setPassword(e.target.value)}
          required
        />
        {actionData && "formErrors" in actionData && actionData.formErrors?.password && (
          <p className="text-sm text-destructive">
            {actionData.formErrors.password.join(", ")}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
      {actionData && "loginErrors" in actionData && actionData.loginErrors && (
        <p className="text-sm text-destructive">{actionData.loginErrors}</p>
      )}

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
    </fetcher.Form>
  );
}