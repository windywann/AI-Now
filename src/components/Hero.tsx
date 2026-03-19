export default function Hero() {
  return (
    <div className="py-16 md:py-24 text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        每日<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">AI简报</span>
      </h1>
      <p className="text-lg md:text-xl text-[#86868b] max-w-2xl mx-auto font-medium">
        为您聚合全球最新 AI 资讯、前沿研究与开源趋势。<br className="hidden md:block" />
        保持敏锐，洞见未来。
      </p>
    </div>
  );
}
