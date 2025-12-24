
import React from 'react';
import { Tool, ToolId } from '../types';
import { 
  Sparkles, ScanSearch, FileSearch, RefreshCw, 
  FileText, SpellCheck, CheckCircle, Quote, Image 
} from 'lucide-react';

interface ToolsGridProps {
  onSelectTool: (id: ToolId) => void;
}

const tools: Tool[] = [
  {
    id: ToolId.HUMANIZER,
    name: 'AI Humanizer',
    description: 'Transform AI-generated text into natural, human-like writing instantly.',
    icon: <Sparkles className="w-6 h-6 text-teal" />
  },
  {
    id: ToolId.DETECTOR,
    name: 'AI Detector',
    description: 'Detect AI-generated content with high accuracy and detailed risk analysis.',
    icon: <ScanSearch className="w-6 h-6 text-secondary" />
  },
  {
    id: ToolId.PLAGIARISM,
    name: 'Plagiarism Checker',
    description: 'Ensure originality by scanning your text against billions of web pages.',
    icon: <FileSearch className="w-6 h-6 text-primary" />
  },
  {
    id: ToolId.PARAPHRASER,
    name: 'AI Paraphraser',
    description: 'Rephrase sentences and paragraphs to improve flow and clarity.',
    icon: <RefreshCw className="w-6 h-6 text-purple-500" />
  },
  {
    id: ToolId.SUMMARIZER,
    name: 'AI Summarizer',
    description: 'Condense long articles and documents into concise summaries.',
    icon: <FileText className="w-6 h-6 text-orange-500" />
  },
  {
    id: ToolId.GRAMMAR,
    name: 'Grammar Checker',
    description: 'Fix grammar, spelling, and punctuation errors in real-time.',
    icon: <SpellCheck className="w-6 h-6 text-red-500" />
  },
  {
    id: ToolId.FACT,
    name: 'Fact Checker',
    description: 'Verify claims and ensure the accuracy of your content automatically.',
    icon: <CheckCircle className="w-6 h-6 text-green-500" />
  },
  {
    id: ToolId.CITATION,
    name: 'Citation Generator',
    description: 'Generate accurate citations in APA, MLA, Chicago, and more styles.',
    icon: <Quote className="w-6 h-6 text-pink-500" />
  },
  {
    id: ToolId.IMAGE,
    name: 'Image Generator',
    description: 'Create stunning unique visuals from text prompts in seconds.',
    icon: <Image className="w-6 h-6 text-blue-400" />
  }
];

const ToolsGrid: React.FC<ToolsGridProps> = ({ onSelectTool }) => {
  return (
    <section className="py-20 bg-gray-50/50" id="tools">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need <br /> to create perfect content.
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Access our comprehensive suite of AI-powered tools designed to enhance every stage of your writing process.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-secondary transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {tool.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ToolsGrid;
