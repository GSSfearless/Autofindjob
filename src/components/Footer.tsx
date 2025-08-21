const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-display font-bold text-xl">AutoFindJob</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              专业AI模拟面试平台，助力求职者获得心仪工作
            </p>
            <div className="text-sm text-primary-foreground/60">
              © 2024 AutoFindJob. 保留所有权利.
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">产品功能</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">AI智能提问</a></li>
              <li><a href="#" className="hover:text-white transition-colors">实时评估</a></li>
              <li><a href="#" className="hover:text-white transition-colors">详细报告</a></li>
              <li><a href="#" className="hover:text-white transition-colors">改进建议</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">资源中心</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">面试技巧</a></li>
              <li><a href="#" className="hover:text-white transition-colors">行业洞察</a></li>
              <li><a href="#" className="hover:text-white transition-colors">成功案例</a></li>
              <li><a href="#" className="hover:text-white transition-colors">帮助文档</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">客服支持</a></li>
              <li><a href="#" className="hover:text-white transition-colors">商务合作</a></li>
              <li><a href="#" className="hover:text-white transition-colors">意见反馈</a></li>
              <li><a href="#" className="hover:text-white transition-colors">媒体报道</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-primary-foreground/60">
          <p>让AI成为你职业成功路上的最佳伙伴</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;