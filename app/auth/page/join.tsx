import type { Route } from "./+types/join";
import { Link } from "react-router";
import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import { X } from "lucide-react";
import { Checkbox } from "~/common/components/ui/checkbox";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Join - LOCALFlOW" },
    { name: "description", content: "Create a new account" },
  ];
}

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneOrEmail: "",
    verificationCode: "",
    username: "",
    country: "",
    language: "",
    interests: [] as string[],
    agreedToTerms: false,
    agreedToPrivacy: false,
    agreedToMarketing: false,
  });
  const [interestInput, setInterestInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // 2단계에서는 약관동의 필수 체크
    if (step === 2) {
      if (!formData.agreedToTerms || !formData.agreedToPrivacy) {
        alert("필수 약관에 동의해주세요.");
        return;
      }
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 조합 중이면 무시
    if (isComposing) return;

    if (e.key === "Enter" && interestInput.trim() && formData.interests.length < 10) {
      e.preventDefault();
      if (!formData.interests.includes(interestInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          interests: [...prev.interests, interestInput.trim()],
        }));
      }
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 계정 생성 로직
    console.log("Account created:", formData);
    // 성공 후 리다이렉트 등 처리
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-4 mb-6">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                stepNum === step
                  ? "bg-primary text-primary-foreground"
                  : stepNum < step
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  stepNum < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            </div>

            {/* 소셜 가입 버튼들 */}
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
                Google로 가입
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black dark:bg-[#FEE500] dark:hover:bg-[#FEE500]/90 dark:text-black"
              >
                Kakao로 가입
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white dark:bg-[#03C75A] dark:hover:bg-[#03C75A]/90 dark:text-white"
              >
                Naver로 가입
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-or-email">핸드폰 또는 이메일</Label>
              <Input
                id="phone-or-email"
                type="text"
                placeholder="010-1234-5678 또는 email@example.com"
                value={formData.phoneOrEmail}
                onChange={(e) => handleInputChange("phoneOrEmail", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verification-code">인증 코드</Label>
              <div className="flex gap-2">
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="인증 코드 입력"
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                  required
                />
                <Button type="button" variant="outline">
                  인증 요청
                </Button>
              </div>
            </div>
            
            {/* 약관동의 섹션 */}
            <div className="space-y-3 pt-4 border-t">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreedToTerms: checked === true }))
                    }
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                    <Link to="/terms" className="text-primary hover:underline" target="_blank">
                      이용약관
                    </Link>
                    {" "}동의 <span className="text-destructive">(필수)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreedToPrivacy}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreedToPrivacy: checked === true }))
                    }
                  />
                  <Label htmlFor="privacy" className="text-sm font-normal cursor-pointer">
                    <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                      개인정보 처리방침
                    </Link>
                    {" "}동의 <span className="text-destructive">(필수)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={formData.agreedToMarketing}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreedToMarketing: checked === true }))
                    }
                  />
                  <Label htmlFor="marketing" className="text-sm font-normal cursor-pointer">
                    마케팅 정보 수신 동의 <span className="text-muted-foreground">(선택)</span>
                  </Label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={formData.agreedToTerms && formData.agreedToPrivacy && formData.agreedToMarketing}
                  onCheckedChange={(checked) => {
                    const isChecked = checked === true;
                    setFormData((prev) => ({
                      ...prev,
                      agreedToTerms: isChecked,
                      agreedToPrivacy: isChecked,
                      agreedToMarketing: isChecked,
                    }));
                  }}
                />
                <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  전체 동의
                </Label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">국가</Label>
              <Input
                id="country"
                type="text"
                placeholder="예: 대한민국"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">언어</Label>
              <Input
                id="language"
                type="text"
                placeholder="예: 한국어"
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interests">관심 테마</Label>
              <Input
                id="interests"
                type="text"
                placeholder="입력 후 Enter를 누르세요 (최대 10개)"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={handleAddInterest}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
              />
              <p className="text-xs text-muted-foreground">
                {formData.interests.length}/10
              </p>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-2 border rounded-md">
              {formData.interests.length === 0 ? (
                <p className="text-sm text-muted-foreground">관심 테마를 추가해주세요</p>
              ) : (
                formData.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 flex items-center gap-1"
                  >
                    #{interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Step {step} of 4
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[500px] flex flex-col">
          {renderStepIndicator()}
          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="flex flex-col flex-1">
            <div className="flex-1 min-h-[300px]">
              {renderStepContent()}
            </div>
            <div className="flex gap-2 mt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              <Button
                type={step === 4 ? "submit" : "button"}
                onClick={step < 4 ? handleNext : undefined}
                className="flex-1"
              >
                {step === 4 ? "Create Account" : "Next"}
              </Button>
            </div>
            {step === 1 && (
              <div className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link to="/" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}