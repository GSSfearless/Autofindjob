import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold text-xl text-primary">AutoFindJob</span>
          </div>
          
          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">功能特色</a>
            <a href="#process" className="text-foreground/80 hover:text-primary transition-colors">使用流程</a>
            <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors">价格方案</a>
            <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">关于我们</a>
          </nav>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">
              登录
            </Button>
            <Button variant="default">
              开始体验
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;