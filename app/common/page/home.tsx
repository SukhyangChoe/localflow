import { Input } from "~/common/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {title: "LOCALFLOW"},
    {name: "description", contetn: "Wecome to local-flow"},
  ];
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* 전환 버튼 - 우측 상단 (navigation 바 밑) */}
      <div className="absolute top-20 right-5 md:right-20">
        <Button variant="ghost" className="text-xs border-none shadow-none" asChild>
          <Link to="/select">Selection →</Link>
        </Button>
      </div>
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-semibold text-center mb-30">
          What is your dream trip?
        </h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ex. 4 days in Seoul in April, love coffee & K-pop; avoid hills"
            className="pl-12 pr-24 py-6 text-lg border-2 focus:border-primary"
          />
          <Button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            size="sm"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}