'use client';

import { type ComponentProps } from 'react';
import { type AgentState, type ReceivedMessage } from '@livekit/components-react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { AgentChatIndicator } from '@/components/agents-ui/agent-chat-indicator';
import { AnimatePresence } from 'motion/react';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the AgentChatTranscript component.
 */
export interface AgentChatTranscriptProps extends ComponentProps<'div'> {
  /**
   * The current state of the agent. When 'thinking', displays a loading indicator.
   */
  agentState?: AgentState;
  /**
   * Array of messages to display in the transcript.
   * @defaultValue []
   */
  messages?: ReceivedMessage[];
  /**
   * Additional CSS class names to apply to the conversation container.
   */
  className?: string;
}

/**
 * A chat transcript component that displays a conversation between the user and agent.
 * Shows messages with timestamps and origin indicators, plus a thinking indicator
 * when the agent is processing.
 *
 * @extends ComponentProps<'div'>
 *
 * @example
 * ```tsx
 * <AgentChatTranscript
 *   agentState={agentState}
 *   messages={chatMessages}
 * />
 * ```
 */
export function AgentChatTranscript({
  agentState,
  messages = [],
  className,
  ...props
}: AgentChatTranscriptProps) {
  return (
    <Conversation className={cn("px-4 bg-transparent", className)} {...props}>
      <ConversationContent className="gap-8 py-8">
        {messages.map((receivedMessage) => {
          const { id, timestamp, from, message } = receivedMessage;
          const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
          const isUser = from?.isLocal;
          const messageOrigin = isUser ? 'user' : 'assistant';
          const time = new Date(timestamp);
          const timeStr = time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

          return (
            <Message key={id} from={messageOrigin} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className={cn(
                "flex items-center gap-2 mb-2 px-1",
                isUser ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-xl flex items-center justify-center border shrink-0 shadow-md",
                  isUser 
                    ? "!bg-[#ffffff] border-[#e2e8f0] !text-[#000000]" 
                    : "!bg-[#000000] border-[#333333] !text-[#ffffff]"
                )}>
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div className={cn(
                  "flex flex-col",
                  isUser ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "flex items-baseline gap-2",
                    isUser ? "flex-row-reverse" : "flex-row"
                  )}>
                    <span className="text-[10px] font-bold text-[var(--d-text-secondary)] uppercase tracking-widest">
                      {isUser ? 'Candidate' : 'AI Interviewer'}
                    </span>
                    <span className="text-[9px] text-[var(--d-text-muted)] font-semibold uppercase">
                      {timeStr}
                    </span>
                  </div>
                </div>
              </div>
              
              <MessageContent className={cn(
                "rounded-2xl shadow-2xl !max-w-[88%] !px-5 !py-3.5 border transition-all duration-200",
                isUser 
                  ? "!bg-[#ffffff] border-[#e2e8f0] !text-[#000000] rounded-tr-none ml-auto" 
                  : "!bg-[#000000] border-[#333333] !text-[#ffffff] rounded-tl-none mr-auto"
              )}>
                <MessageResponse className={cn(
                  "text-[13px] leading-relaxed font-bold tracking-tight",
                  isUser ? "!text-[#000000]" : "!text-[#ffffff]"
                )}>
                  {message}
                </MessageResponse>
              </MessageContent>
            </Message>
          );
        })}
        <AnimatePresence>
          {agentState === 'thinking' && (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <div className="flex items-center gap-2 px-1">
                <div className="w-7 h-7 rounded-xl bg-[#000000] flex items-center justify-center border border-[#333333] shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold text-[var(--d-text-tertiary)] uppercase tracking-widest">
                  AI is processing...
                </span>
              </div>
              <div className="bg-[#000000] border border-[#333333] rounded-2xl rounded-tl-none px-6 py-4 w-fit shadow-2xl">
                <AgentChatIndicator size="sm" className="bg-white/60" />
              </div>
            </div>
          )}
        </AnimatePresence>
      </ConversationContent>
      <ConversationScrollButton className="bg-white dark:bg-zinc-800 backdrop-blur-none border-zinc-200 dark:border-zinc-700 shadow-xl hover:scale-110 transition-transform" />
    </Conversation>
  );
}
