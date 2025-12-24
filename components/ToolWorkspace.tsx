
import React, { useState, useEffect } from 'react';
import { ToolId, ToolResult, JobStatus } from '../types';
import { processToolRequest, mockFileUpload, detectLanguage } from '../services/geminiService';
import { ArrowLeft, Play, Copy, Check, Sparkles, ExternalLink, Globe, Download, AlertTriangle, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import FileUploader from './FileUploader';
import ProcessingStatus from './ProcessingStatus';

interface ToolWorkspaceProps {
  toolId: ToolId;
  onBack: () => void;
}

const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ toolId, onBack }) => {
  const [input, setInput] = useState('');
  const [jobStatus, setJobStatus] = useState<JobStatus>(JobStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string>('English');

  // Real-time language detection
  useEffect(() => {
    if (input.length > 5) {
      setDetectedLang(detectLanguage(input));
    }
  }, [input]);

  const handleFileUpload = async (file: File) => {
    setJobStatus(JobStatus.UPLOADING);
    setProgress(10);
    
    try {
      // 1. Upload & Parse (Simulated)
      const content = await mockFileUpload(file);
      setProgress(40);
      setInput(content); // Populate editor with parsed text
      setJobStatus(JobStatus.IDLE); // Reset to IDLE so user can review/edit before running
    } catch (e) {
      setJobStatus(JobStatus.FAILED);
      alert("Failed to parse file.");
    }
  };

  const handleRun = async () => {
    if (!input.trim()) return;
    
    setJobStatus(JobStatus.QUEUED);
    setProgress(50);
    setResult(null);

    // Simulate Job Queue delay
    setTimeout(async () => {
      setJobStatus(JobStatus.PROCESSING);
      setProgress(70);
      
      try {
        const res = await processToolRequest(toolId, input, detectedLang);
        setProgress(100);
        setResult(res);
        setJobStatus(JobStatus.COMPLETED);
      } catch (e) {
        setJobStatus(JobStatus.FAILED);
        setResult({ text: "Error processing request. Please try again." });
      }
    }, 1500); // 1.5s simulated queue time
  };

  const copyToClipboard = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadResult = () => {
    if (!result?.text) return;
    const blob = new Blob([result.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JustDone_Result_${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getToolTitle = () => {
    switch (toolId) {
      case ToolId.HUMANIZER: return "AI Humanizer";
      case ToolId.DETECTOR: return "AI Detector";
      case ToolId.PLAGIARISM: return "Plagiarism Checker";
      case ToolId.PARAPHRASER: return "AI Paraphraser";
      case ToolId.SUMMARIZER: return "AI Summarizer";
      case ToolId.GRAMMAR: return "Grammar Checker";
      case ToolId.FACT: return "Fact Checker";
      case ToolId.CITATION: return "Citation Generator";
      case ToolId.IMAGE: return "Image Generator (Prompt)";
      default: return "AI Tool";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 animate-fade-in">
      
      {/* Workspace Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-16 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {getToolTitle()}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {jobStatus === JobStatus.PROCESSING && <span className="text-xs font-mono text-teal animate-pulse">Processing Job #8291...</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
        
        {/* Input Column */}
        <div className="flex flex-col gap-4 h-full overflow-y-auto pr-2">
          
          {/* File Uploader */}
          <FileUploader onFileSelect={handleFileUpload} isProcessing={jobStatus !== JobStatus.IDLE && jobStatus !== JobStatus.COMPLETED} />

          {/* Text Editor */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Input Text</span>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-teal/10 text-teal rounded border border-teal/20 normal-case tracking-normal transition-all">
                <Globe size={12} />
                <span>Detected: {detectedLang}</span>
              </div>
            </div>
            <textarea
              className="flex-1 p-6 resize-none focus:outline-none text-gray-700 text-lg leading-relaxed placeholder:text-gray-300 font-sans"
              placeholder="Type, paste text, or upload a document..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={jobStatus === JobStatus.UPLOADING || jobStatus === JobStatus.QUEUED || jobStatus === JobStatus.PROCESSING}
            />
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs text-gray-400">{input.length} characters</span>
              <button 
                onClick={handleRun}
                disabled={jobStatus === JobStatus.UPLOADING || jobStatus === JobStatus.PROCESSING || !input.trim()}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all
                  ${jobStatus === JobStatus.PROCESSING || !input.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-gradient hover:shadow-xl hover:-translate-y-0.5'}
                `}
              >
                {jobStatus === JobStatus.PROCESSING ? (
                  <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Running...</div>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" /> Process
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Compliance Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 border border-blue-100">
             <ShieldCheck size={14} className="mt-0.5 shrink-0" />
             <p>Data Privacy: Your text is processed securely. We support GDPR compliance. <br/>Files are temporarily stored for processing and deleted automatically after 24 hours.</p>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
          
          {/* Job Status Indicator */}
          <ProcessingStatus status={jobStatus} progress={progress} />

          {/* Result Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden relative min-h-[400px]">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Analysis Result</span>
              <div className="flex items-center gap-3">
                 {result && (
                  <button onClick={downloadResult} className="text-gray-500 hover:text-primary transition-colors" title="Export as TXT">
                    <Download size={16} />
                  </button>
                 )}
                 {result && (
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-white">
              {result ? (
                <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
                  <ReactMarkdown>{result.text}</ReactMarkdown>

                  {/* Grounding Sources */}
                  {result.groundingUrls && result.groundingUrls.length > 0 && (
                     <div className="mt-8 pt-4 border-t border-gray-200 bg-gray-50 -mx-6 px-6 pb-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Verified Sources</h4>
                        <div className="flex flex-col gap-2">
                           {result.groundingUrls.map((url, i) => (
                             <a key={i} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs bg-white border border-gray-200 p-2 rounded hover:border-primary hover:text-primary transition-colors text-gray-600">
                               <ExternalLink size={12} className="shrink-0" /> <span className="truncate">{url}</span>
                             </a>
                           ))}
                        </div>
                     </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                  <Sparkles size={48} className="mb-4 text-gray-200" />
                  <p>Ready to process</p>
                </div>
              )}
            </div>

            {/* AI Disclaimer */}
            <div className="p-3 bg-yellow-50 border-t border-yellow-100 flex items-start gap-2 text-[10px] text-yellow-800">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <p>
                <strong>Disclaimer:</strong> AI Detectors and Plagiarism checkers provide probabilistic results, not definitive proof. 
                Always verify critical findings manually. Scores indicate likelihood, not certainty.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ToolWorkspace;
