import React from 'react';
import { Tool, ToolId } from '../types';
import { 
  Sparkles, ScanSearch, FileSearch, RefreshCw, 
  FileText, SpellCheck 
} from 'lucide-react';

interface ToolsGridProps {
  onSelectTool: (id: ToolId) => void;
}

const tools: Tool[] = [
  {
    id: ToolId.HUMANIZER,
    name: 'AI 人性化改写',
    description: '通过中和机器指纹，绕过主流 AI 检测算法，让文本更具生命力。',
    icon: <Sparkles className="w-6 h-6 text-white" />
  },
  {
    id: ToolId.DETECTOR,
    name: 'AI 内容检测',
    description: '基于概率分析，精准识别机器生成的模式，提供权威判定结论。',
    icon: <ScanSearch className="w-6 h-6 text-white" />
  },
  {
    id: ToolId.PLAGIARISM,
    name: '论文查重审计',
    description: '交叉引用全球数据库索引，验证内容原创性，确保学术诚信。',
    icon: <FileSearch className="w-6 h-6 text-white" />
  },
  {
    id: ToolId.PARAPHRASER,
    name: '语义重构引擎',
    description: '进阶语义索引，优化文本流畅度与逻辑结构，提升可读性。',
    icon: <RefreshCw className="w-6 h-6 text-white" />
  },
  {
    id: ToolId.SUMMARIZER,
    name: '信息降熵工具',
    description: '将复杂的数据集提炼为核心情报模块，节省您的认知资源。',
    icon: <FileText className="w-6 h-6 text-white" />
  },
  {
    id: ToolId.GRAMMAR,
    name: '语法结构检查',
    description: '实时检测语言资产的结构完整性，修正拼写与语法偏差。',
    icon: <SpellCheck className="w-6 h-6 text-white" />
  }
];

const ToolsGrid: React.FC<ToolsGridProps> = ({ onSelectTool }) => {
  return (
    <section className="py-20 bg-gray-50" id="tools">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            全能 AI 协议
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            选择合适的接口，开始处理您的数据流。
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {tool.description}
              </p>
              <div className="mt-6 flex items-center text-primary font-bold text-sm">
                 立即启动 <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ToolsGrid;