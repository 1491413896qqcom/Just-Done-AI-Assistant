
import React from 'react';
import { SystemState, PerspectiveType } from '../types';
import { 
  GitBranch, Zap, Users, BookOpen, Eye, 
  ArrowRight, Target, Clock, AlertOctagon 
} from 'lucide-react';

interface DashboardProps {
  data: SystemState;
  onPerspectiveClick: (type: PerspectiveType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onPerspectiveClick }) => {
  const perspectives: {id: PerspectiveType, label: string}[] = [
    { id: 'REALITY', label: '现实' },
    { id: 'BENEFIT', label: '利益' },
    { id: 'LONG_TERM', label: '长期' },
    { id: 'VALUE', label: '价值' },
    { id: 'RELATIONSHIP', label: '人际' },
    { id: 'RISK', label: '风险' },
    { id: 'EMOTIONAL', label: '感性' },
    { id: 'REVERSE', label: '逆向' },
  ];

  const sectionTitleClass = "text-[10px] uppercase tracking-widest text-neutral-500 mb-3 flex items-center";
  const emptyStateClass = "text-[10px] text-neutral-700 italic";

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-8 animate-fade-in text-neutral-300 pb-20">
      
      {/* 1. Thinking Tools - Perspectives */}
      <section>
        <h3 className={sectionTitleClass}><Eye size={12} className="mr-1" /> 思维工具：换个角度</h3>
        <div className="grid grid-cols-4 gap-2">
          {perspectives.map((p) => (
            <button 
              key={p.id}
              onClick={() => onPerspectiveClick(p.id)}
              className="text-[10px] border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-600 hover:text-white py-2 px-1 rounded transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Thinking Tools - Future */}
      {data.futurePaths.length > 0 && (
        <section>
          <h3 className={sectionTitleClass}><GitBranch size={12} className="mr-1" /> 看看未来</h3>
          <div className="space-y-2">
            {data.futurePaths.map((path, idx) => (
              <div key={idx} className="bg-neutral-900/30 border-l-2 border-neutral-700 p-2">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-bold text-neutral-400">PATH {path.path}: {path.label}</span>
                 </div>
                 <p className="text-[10px] text-neutral-500">{path.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Action Routes */}
      <section>
        <h3 className={sectionTitleClass}><Zap size={12} className="mr-1" /> 行动路线</h3>
        <div className="space-y-3">
          {data.actions.map((action) => (
            <div key={action.id} className="group relative pl-4 border-l border-neutral-800 hover:border-white transition-colors">
              <div className={`absolute -left-[3px] top-1 w-1.5 h-1.5 rounded-full ${
                action.timeframe === 'NOW' ? 'bg-blue-500' : action.timeframe === 'TODAY' ? 'bg-yellow-500' : 'bg-neutral-600'
              }`}></div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-white font-medium">{action.title}</span>
                <span className="text-[9px] uppercase tracking-wider text-neutral-600">{action.timeframe}</span>
              </div>
              <div className="flex gap-2 text-[9px] text-neutral-500">
                <span className={action.risk === 'HIGH' ? 'text-red-500' : ''}>Risk: {action.risk}</span>
                <span>•</span>
                <span>{action.reward}</span>
              </div>
            </div>
          ))}
          {data.actions.length === 0 && <div className={emptyStateClass}>暂无行动建议</div>}
        </div>
      </section>

      {/* 4. Decision Map */}
      <section>
        <h3 className={sectionTitleClass}><Target size={12} className="mr-1" /> 决策图谱 (High Freq)</h3>
        <div className="space-y-2">
          {data.themes.map((theme, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-16 text-[10px] truncate text-neutral-400">{theme.name}</div>
              <div className="flex-1 h-1 bg-neutral-900 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-neutral-600" 
                   style={{ width: `${Math.min(theme.count * 10, 100)}%` }}
                ></div>
              </div>
              <div className="text-[9px] text-neutral-600">x{theme.count}</div>
            </div>
          ))}
          {data.themes.length === 0 && <div className={emptyStateClass}>收集数据中...</div>}
        </div>
      </section>

      {/* 5. Relationship Map */}
      <section>
        <h3 className={sectionTitleClass}><Users size={12} className="mr-1" /> 人际关系图</h3>
        <div className="space-y-3">
          {data.relationships.map((rel, idx) => (
            <div key={idx} className="bg-neutral-900/20 p-2 rounded border border-neutral-900 flex justify-between items-center">
              <div>
                <div className="text-xs text-neutral-300">{rel.name}</div>
                <div className="text-[9px] text-neutral-600 truncate max-w-[120px]">{rel.lastEvent}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-neutral-500 mb-1">消耗指数</div>
                <div className={`text-xs font-mono font-bold ${rel.drainIndex > 60 ? 'text-red-500' : 'text-green-500'}`}>
                  {rel.drainIndex}
                </div>
              </div>
            </div>
          ))}
          {data.relationships.length === 0 && <div className={emptyStateClass}>无人际数据</div>}
        </div>
      </section>

      {/* 6. Daily Log */}
      <section>
        <h3 className={sectionTitleClass}><BookOpen size={12} className="mr-1" /> 自动日志 ({data.log?.date || 'Today'})</h3>
        {data.log ? (
          <div className="bg-neutral-900/40 p-3 text-[10px] text-neutral-400 space-y-2 border border-neutral-800">
            <div>
              <span className="text-neutral-600 uppercase">Tags:</span> {data.log.keywords.join(', ')}
            </div>
            <div>
              <span className="text-neutral-600 uppercase">Main:</span> {data.log.mainIssue}
            </div>
            <div className="pt-2 border-t border-neutral-800 italic text-neutral-500">
              "{data.log.aiSummary}"
            </div>
          </div>
        ) : (
          <div className={emptyStateClass}>等待日志生成...</div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
