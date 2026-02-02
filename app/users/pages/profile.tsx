import { useState, useEffect } from "react";
import type { Route } from "./+types/profile";
import { useFetcher } from "react-router";
import { makeSSRClient } from "~/supa-client";
import { getFullProfile, updateProfile } from "~/users/queries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/common/components/ui/dialog";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "~/common/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/common/components/ui/select";
import { Checkbox } from "~/common/components/ui/checkbox";
import { 
  CameraIcon, 
  PhoneIcon, 
  MailIcon, 
  GlobeIcon, 
  LanguagesIcon, 
  HeartIcon, 
  FileTextIcon, 
  DollarSignIcon, 
  SettingsIcon,
  ChevronRightIcon,
  UserIcon
} from "lucide-react";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  
  const profile = await getFullProfile(client, { id: user.id });
  return { profile };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  
  const formData = await request.formData();
  const field = formData.get("field") as string;
  const value = formData.get("value") as string;
  
  let updates: any = {};
  
  if (field === "avatar") {
    updates.avatar = value;
  } else if (field === "phone") {
    updates.phone = value;
  } else if (field === "email") {
    updates.email = value;
  } else if (field === "country") {
    updates.country = value;
  } else if (field === "language") {
    updates.language = value;
  } else if (field === "interests") {
    updates.interests = value ? value.split(",").map((i) => i.trim()) : [];
  } else if (field === "bio") {
    updates.bio = value;
  } else if (field === "preferred_currency") {
    updates.preferred_currency = value;
  } else if (field === "settings") {
    // 알림 설정
    const email = formData.get("email_notification") === "on";
    const push = formData.get("push_notification") === "on";
    const marketing = formData.get("marketing_notification") === "on";
    updates.notification_settings = { email, push, marketing };
    
    // 보안 설정
    const profile_visibility = formData.get("profile_visibility") as string;
    const show_email = formData.get("show_email") === "on";
    const show_phone = formData.get("show_phone") === "on";
    updates.privacy_settings = { profile_visibility, show_email, show_phone };
  }
  
  const updatedProfile = await updateProfile(client, { id: user.id, updates });
  return { success: true, profile: updatedProfile };
};

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  onClick: () => void;
}

function ProfileField({ icon, label, value, onClick }: ProfileFieldProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 rounded-lg hover:bg-accent transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-muted-foreground">
            {value || "설정되지 않음"}
          </div>
        </div>
      </div>
      <ChevronRightIcon className="size-4 text-muted-foreground" />
    </button>
  );
}

export default function ProfilePage({ loaderData, actionData }: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>();
  const [profile, setProfile] = useState(loaderData.profile);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [currencyValue, setCurrencyValue] = useState<string>("KRW");
  const [profileVisibility, setProfileVisibility] = useState<string>("public");
  const [phoneFormattedValue, setPhoneFormattedValue] = useState<string>("");
  
  // 핸드폰 번호 포맷팅 함수 (숫자만 추출하고 3-4-4 형식으로)
  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, ""); // 숫자만 추출
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };
  
  useEffect(() => {
    // actionData 또는 fetcher.data에서 성공 응답 확인
    const response = actionData || fetcher.data;
    if (response?.success && response?.profile) {
      setProfile(response.profile);
      setOpenModal(null);
      // 모달이 닫힐 때 formData 초기화
      setFormData({});
      setPhoneFormattedValue("");
    }
  }, [actionData, fetcher.data]);
  
  useEffect(() => {
    if (loaderData.profile) {
      setProfile(loaderData.profile);
    }
  }, [loaderData]);
  
  const handleOpenModal = (field: string) => {
    setOpenModal(field);
    // 현재 값으로 폼 초기화
    if (field === "avatar") {
      setFormData({ avatar: profile?.avatar || "" });
    } else if (field === "phone") {
      const phone = profile?.phone || "";
      setFormData({ phone });
      setPhoneFormattedValue(formatPhoneNumber(phone));
    } else if (field === "email") {
      setFormData({ email: profile?.email || "" });
    } else if (field === "country") {
      setFormData({ country: profile?.country || "" });
    } else if (field === "language") {
      setFormData({ language: profile?.language || "" });
    } else if (field === "interests") {
      setFormData({ interests: profile?.interests?.join(", ") || "" });
    } else if (field === "bio") {
      setFormData({ bio: profile?.bio || "" });
    } else if (field === "preferred_currency") {
      const currency = profile?.preferred_currency || "KRW";
      setFormData({ preferred_currency: currency });
      setCurrencyValue(currency);
    } else if (field === "notification_settings") {
      const notificationSettings = profile?.notification_settings as { email?: boolean; push?: boolean; marketing?: boolean } | null | undefined;
      setFormData({
        email_notification: notificationSettings?.email || false,
        push_notification: notificationSettings?.push || false,
        marketing_notification: notificationSettings?.marketing || false,
      });
    } else if (field === "settings") {
      const notificationSettings = profile?.notification_settings as { email?: boolean; push?: boolean; marketing?: boolean } | null | undefined;
      const privacySettings = profile?.privacy_settings as { profile_visibility?: "public" | "private" | "friends"; show_email?: boolean; show_phone?: boolean } | null | undefined;
      const visibility = privacySettings?.profile_visibility || "public";
      setFormData({
        email_notification: notificationSettings?.email || false,
        push_notification: notificationSettings?.push || false,
        marketing_notification: notificationSettings?.marketing || false,
        profile_visibility: visibility,
        show_email: privacySettings?.show_email || false,
        show_phone: privacySettings?.show_phone || false,
      });
      setProfileVisibility(visibility);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formDataObj = new FormData(form);
    const field = openModal || "";
    formDataObj.append("field", field);
    
    // 핸드폰 번호인 경우 숫자만 추출해서 저장
    if (field === "phone") {
      const phoneValue = formDataObj.get("value") as string;
      const numbersOnly = phoneValue.replace(/\D/g, "");
      formDataObj.set("value", numbersOnly);
    }
    
    fetcher.submit(formDataObj, { method: "post" });
  };
  
  if (!profile) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pt-24">
      
      {/* 프로필 이미지 및 이름 */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <Avatar className="size-24">
            <AvatarImage src={profile.avatar || undefined} alt={profile.username || "Profile"} />
            <AvatarFallback>
              <UserIcon className="size-12" />
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full"
            onClick={() => handleOpenModal("avatar")}
          >
            <CameraIcon className="size-4" />
          </Button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{profile.username || "사용자"}</h2>
        </div>
      </div>
      
      {/* 프로필 필드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 왼쪽 열 */}
        <div className="space-y-4">
          <ProfileField
            icon={<PhoneIcon className="size-5" />}
            label="핸드폰"
            value={profile.phone ? formatPhoneNumber(profile.phone) : undefined}
            onClick={() => handleOpenModal("phone")}
          />
          <ProfileField
            icon={<MailIcon className="size-5" />}
            label="이메일"
            value={profile.email}
            onClick={() => handleOpenModal("email")}
          />
          <ProfileField
            icon={<GlobeIcon className="size-5" />}
            label="국가"
            value={profile.country}
            onClick={() => handleOpenModal("country")}
          />
          <ProfileField
            icon={<LanguagesIcon className="size-5" />}
            label="언어"
            value={profile.language}
            onClick={() => handleOpenModal("language")}
          />
          <ProfileField
            icon={<HeartIcon className="size-5" />}
            label="관심테마"
            value={profile.interests?.join(", ") || undefined}
            onClick={() => handleOpenModal("interests")}
          />
        </div>
        
        {/* 오른쪽 열 */}
        <div className="space-y-4">
          <ProfileField
            icon={<FileTextIcon className="size-5" />}
            label="자기소개"
            value={profile.bio}
            onClick={() => handleOpenModal("bio")}
          />
          <ProfileField
            icon={<DollarSignIcon className="size-5" />}
            label="선호 통화"
            value={profile.preferred_currency || "KRW"}
            onClick={() => handleOpenModal("preferred_currency")}
          />
          <ProfileField
            icon={<SettingsIcon className="size-5" />}
            label="기타 설정"
            value="알림 및 보안 설정"
            onClick={() => handleOpenModal("settings")}
          />
        </div>
      </div>
      
      {/* 모달들 */}
      {/* 프로필 이미지 모달 */}
      <Dialog open={openModal === "avatar"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로필 이미지 수정</DialogTitle>
            <DialogDescription>
              프로필 이미지 URL을 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatar">이미지 URL</Label>
                <Input
                  id="avatar"
                  name="value"
                  type="url"
                  defaultValue={formData.avatar}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 핸드폰번호 모달 */}
      <Dialog open={openModal === "phone"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>핸드폰번호 수정</DialogTitle>
            <DialogDescription>
              핸드폰번호를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">핸드폰번호</Label>
                <Input
                  id="phone"
                  name="value"
                  type="tel"
                  value={phoneFormattedValue}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setPhoneFormattedValue(formatted);
                  }}
                  placeholder="010-1234-5678"
                  maxLength={13}
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 이메일 모달 */}
      <Dialog open={openModal === "email"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이메일 수정</DialogTitle>
            <DialogDescription>
              이메일 주소를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="value"
                  type="email"
                  defaultValue={formData.email}
                  placeholder="example@email.com"
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 국가 모달 */}
      <Dialog open={openModal === "country"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>국가 수정</DialogTitle>
            <DialogDescription>
              거주 국가를 선택하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">국가</Label>
                <Input
                  id="country"
                  name="value"
                  type="text"
                  defaultValue={formData.country}
                  placeholder="대한민국"
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 언어 모달 */}
      <Dialog open={openModal === "language"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>언어 수정</DialogTitle>
            <DialogDescription>
              구사 가능한 언어를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">언어</Label>
                <Input
                  id="language"
                  name="value"
                  type="text"
                  defaultValue={formData.language}
                  placeholder="한국어, 영어"
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 관심테마 모달 */}
      <Dialog open={openModal === "interests"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관심테마 수정</DialogTitle>
            <DialogDescription>
              관심있는 테마를 쉼표로 구분하여 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interests">관심테마</Label>
                <Input
                  id="interests"
                  name="value"
                  type="text"
                  defaultValue={formData.interests}
                  placeholder="여행, 음식, 문화"
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 자기소개멘트 모달 */}
      <Dialog open={openModal === "bio"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>자기소개멘트 수정</DialogTitle>
            <DialogDescription>
              자신을 소개하는 멘트를 작성하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">자기소개</Label>
                <textarea
                  id="bio"
                  name="value"
                  className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  defaultValue={formData.bio}
                  placeholder="자신을 소개해주세요..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 선호 통화 모달 */}
      <Dialog open={openModal === "preferred_currency"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>선호 통화 수정</DialogTitle>
            <DialogDescription>
              선호하는 통화를 선택하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferred_currency">통화</Label>
                <Select value={currencyValue} onValueChange={setCurrencyValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="통화 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KRW">KRW (원)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="CNY">CNY (¥)</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="value" value={currencyValue} />
              </div>
              <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 기타 설정 모달 */}
      <Dialog open={openModal === "settings"} onOpenChange={(open) => !open && setOpenModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>기타 설정</DialogTitle>
            <DialogDescription>
              알림 및 보안 설정을 관리하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 알림 설정 */}
            <div className="space-y-4">
              <h3 className="font-semibold">알림 설정</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email_notification"
                    name="email_notification"
                    defaultChecked={formData.email_notification}
                  />
                  <Label htmlFor="email_notification" className="cursor-pointer">
                    이메일 알림
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="push_notification"
                    name="push_notification"
                    defaultChecked={formData.push_notification}
                  />
                  <Label htmlFor="push_notification" className="cursor-pointer">
                    푸시 알림
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing_notification"
                    name="marketing_notification"
                    defaultChecked={formData.marketing_notification}
                  />
                  <Label htmlFor="marketing_notification" className="cursor-pointer">
                    마케팅 알림
                  </Label>
                </div>
              </div>
            </div>
            
            {/* 보안 설정 */}
            <div className="space-y-4">
              <h3 className="font-semibold">보안 설정</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="profile_visibility">프로필 공개 범위</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">공개</SelectItem>
                      <SelectItem value="private">비공개</SelectItem>
                      <SelectItem value="friends">친구만</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="profile_visibility" value={profileVisibility} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show_email"
                    name="show_email"
                    defaultChecked={formData.show_email}
                  />
                  <Label htmlFor="show_email" className="cursor-pointer">
                    이메일 주소 공개
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show_phone"
                    name="show_phone"
                    defaultChecked={formData.show_phone}
                  />
                  <Label htmlFor="show_phone" className="cursor-pointer">
                    핸드폰번호 공개
                  </Label>
                </div>
              </div>
            </div>
            
            <input type="hidden" name="field" value="settings" />
            <Button type="submit" className="w-full" disabled={fetcher.state === "submitting"}>
              {fetcher.state === "submitting" ? "저장 중..." : "저장"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
