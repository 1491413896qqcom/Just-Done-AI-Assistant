
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Sender } from '../types';
import { ExternalLink, Cpu, Zap, GitBranch, Heart } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isSystem = message.sender === Sender.SYSTEM;

  const renderToolCard = () => {
    if (!message.toolCard) return null;
    
    const { type, data } = message.toolCard;

    if (type === 'ACTIONS' && Array.isArray(data)) {
      return (
        <div className="mt-4 bg-neutral-900/80 border border-neutral-800 rounded p-4 max-w-sm">
          <div className="text-[10px] uppercase tracking-widest text-blue-400 mb-3 flex items-center">
             <Zap size={12} className="mr-2" /> 推荐行动路线
          </div>
          <div className="space-y-3">
            {data.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col border-l-2 border-neutral-700 pl-3">
                <div className="flex justify-between">
                  <span className="text-xs text-white font-medium">{item.title}</span>
                  <span className="text-[9px] bg-neutral-800 px-1 rounded text-neutral-400">{item.timeframe}</span>
                </div>
                <div className="text-[9px] text-neutral-500 mt-1">{item.reward}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    // Add other tool cards here if needed inside the chat bubble
    return null;
  };

  return (
    <div className={`w-full flex ${isSystem ? 'justify-start' : 'justify-end'} mb-8 animate-fade-in group`}>
      <div className={`max-w-[90%] md:max-w-[80%] lg:max-w-[70%] flex flex-col ${isSystem ? 'items-start' : 'items-end'}`}>
        
        {/* Label */}
        <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 mb-2 block opacity-0 group-hover:opacity-100 transition-opacity">
          {isSystem ? 'SYSTEM CORE' : 'COMMANDER'}
        </span>

        {/* Bubble / Text Area */}
        <div className={`
          relative p-0 text-base md:text-lg font-light leading-relaxed
          ${isSystem ? 'text-neutral-200 text-left' : 'text-neutral-400 text-right'}
        `}>
           <ReactMarkdown 
            components={{
              p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 text-neutral-400" {...props} />,
              li: ({node, ...props}) => <li className="ml-4" {...props} />,
            }}
           >
             {message.text}
           </ReactMarkdown>

           {/* Tool Card Inserted in Chat */}
           {renderToolCard()}
        </div>

        {/* Grounding / Sources */}
        {isSystem && message.groundingUrls && message.groundingUrls.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-900/50 w-full">
             <div className="flex flex-wrap gap-2">
                {message.groundingUrls.map((url, idx) => {
                  try {
                    const domain = new URL(url).hostname.replace('www.', '');
                    return (
                      <a 
                        key={idx} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[9px] text-neutral-600 hover:text-blue-400 transition-colors uppercase tracking-wider flex items-center bg-neutral-900/50 px-2 py-0.5 rounded"
                      >
                        {domain} <ExternalLink size={8} className="ml-1" />
                      </a>
                    );
                  } catch (e) { return null; }
                })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
