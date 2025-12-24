
import React, { useState } from 'react';
import { Check, X, ArrowLeft, Zap, Shield, Globe } from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "OBSERVER",
      description: "基础决策辅助与情绪记录。",
      price: "0",
      features: [
        "每日 50 条对话额度",
        "基础情绪记录 (Log)",
        "3 个思维视角工具",
        "标准响应速度",
        "社区支持"
      ],
      highlight: false,
      icon: <Globe size={18} />
    },
    {
      name: "EVOLVER",
      description: "为寻求成长的决策者设计。",
      price: "0",
      features: [
        "无限对话额度",
        "全套 8 个思维视角",
        "未来情境模拟器 (A/B Path)",
        "人际关系图谱",
        "偏差实时检测",
        "决策热力图",
        "优先模型处理"
      ],
      highlight: true, // Most popular
      tag: "MOST POPULAR",
      icon: <Zap size={18} />
    },
    {
      name: "OMNISCIENT",
      description: "完全掌控人生的终极形态。",
      price: "0",
      features: [
        "包含 EVOLVER 所有功能",
        "深度诊断模式 (Diagnostic Mode)",
        "高压推进指令 (Overdrive)",
        "自定义人格模型",
        "API 数据导出",
        "专属私有化部署支持",
        "7x24 小时 AI 待命"
      ],
      highlight: false,
      icon: <Shield size={18} />
    }
  ];

  const faqs = [
    { q: "真的完全免费吗？", a: "是的。全知进化决策系统旨在增强人类智能，我们目前处于全功能开放阶段，所有高级模块对早期用户完全免费。" },
    { q: "数据隐私如何保障？", a: "所有的对话日志与情绪数据均本地化加密存储或仅在会话期间驻留内存，我们不会将您的个人决策数据用于广告投放。" },
    { q: "我可以随时取消吗？", a: "虽然是免费的，但您随时可以导出数据并删除账户，没有任何绑定条款。" },
    { q: "未来会收费吗？", a: "基础功能将永久免费。未来可能会针对极高算力消耗的特定企业级功能推出付费选项，但那是很久以后的事了。" }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto animate-fade-in relative z-50">
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-neutral-900 z-40 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div className="w-4 h-4 bg-white rotate-45"></div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold">OEDS // PRICING</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Console
        </button>
      </header>

      <div className="pt-32 pb-20 px-4 md:px-0 max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6">
            进化，不需要代价。
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            选择适合你的认知增强方案。在这个版本中，我们将所有高级功能完全解锁。<br/>
            因为智慧应该是普惠的。
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-xs font-bold tracking-wider ${!isAnnual ? 'text-white' : 'text-neutral-500'}`}>MONTHLY</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 bg-neutral-800 rounded-full relative transition-colors hover:bg-neutral-700"
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isAnnual ? 'left-7' : 'left-1'}`}></div>
            </button>
            <span className={`text-xs font-bold tracking-wider ${isAnnual ? 'text-white' : 'text-neutral-500'}`}>YEARLY</span>
            <span className="text-[9px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-900/50 uppercase tracking-wide">
              Save 100%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`
                relative p-8 rounded-xl border flex flex-col h-full transition-all duration-300
                ${plan.highlight 
                  ? 'bg-neutral-900/40 border-white/20 shadow-2xl shadow-white/5 scale-105 z-10' 
                  : 'bg-black border-neutral-800 hover:border-neutral-700'
                }
              `}
            >
              {plan.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  {plan.tag}
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 text-neutral-400">
                  {plan.icon}
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-light">$</span>
                  <span className="text-6xl font-bold tracking-tighter">{plan.price}</span>
                  <span className="text-neutral-500 text-sm font-normal">/ mo</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-neutral-300">{feat}</span>
                  </div>
                ))}
              </div>

              <button className={`
                w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-sm
                ${plan.highlight 
                  ? 'bg-white text-black hover:bg-neutral-200' 
                  : 'bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-600'
                }
              `}>
                Start Evolution
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto border-t border-neutral-900 pt-16">
          <h2 className="text-2xl font-light text-center mb-12">常见问题</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-sm font-bold text-white">{faq.q}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center pb-12">
           <h3 className="text-sm text-neutral-500 mb-6">READY TO UPGRADE YOUR MIND?</h3>
           <div className="inline-flex items-center gap-2 text-white border-b border-white pb-1 cursor-pointer hover:opacity-70 transition-opacity" onClick={onBack}>
             <span className="text-lg font-light">Enter the Console</span>
             <ArrowLeft size={16} className="rotate-180" />
           </div>
        </div>

      </div>
    </div>
  );
};

export default PricingPage;
