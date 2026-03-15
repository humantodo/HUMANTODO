import { Button } from '@/components/ui/button';
import { BrandIcon } from '@/components/web/BrandIcon';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { siVercel } from 'simple-icons';
import { Highlight, themes } from 'prism-react-renderer';
import { IconLoader } from './IconLoader';

const AI_SDK_CODE = `import { ToolLoopAgent } from "ai";

const humantodoAgent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.6",
  instructions: \`
You are a senior software engineer pairing with a human developer.

Write production-quality code, but leave judgment-heavy or product-specific sections as
inline "// HUMANTODO:" comments.

Rules:
- Write the majority of the code (scaffolding, simple logic, plumbing, etc)
- Leave any important code for the human to complete
- Return:
  1. One \`\`\`ts\`\`\` block with the code
  2. For each HUMANTODO comment, explain what the expected outcomes should be
\`,
});

const result = await humantodoAgent.generate({
  prompt: "Build a React auth hook with login, logout, and session refresh.",
});

console.log(result.text);`;

const MASTRA_CODE = `import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";

const humantodoAgent = new Agent({
  name: "HUMANTODO Coding Agent",
  instructions: \`
You are a senior software engineer pairing with a human developer.

Write production-quality code, but leave judgment-heavy or product-specific sections as
inline "// HUMANTODO:" comments.

Rules:
- Write the majority of the code (scaffolding, simple logic, plumbing, etc)
- Leave any important code for the human to complete
- Return:
  1. One \`\`\`ts\`\`\` block with the code
  2. For each HUMANTODO comment, explain what the expected outcomes should be
\`,
  model: anthropic("claude-sonnet-4.6"),
});

const result = await humantodoAgent.generate(
  "Build a React auth hook with login, logout, and session refresh.",
);

console.log(result.text);`;

function CodeBlock({ code, onCopy, isCopied }: { code: string; onCopy: () => void; isCopied: boolean }) {
  return (
    <div className="relative rounded-lg border border-zinc-800">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        onClick={onCopy}
        aria-label={isCopied ? 'Copied' : 'Copy code'}
      >
        {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
      </Button>
      <Highlight theme={themes.vsDark} code={code} language="typescript">
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre className="m-0! overflow-x-auto rounded-lg p-4 pr-12 text-[13px] leading-relaxed" style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export function AgenticFrameworkTabs() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Tabs defaultValue="ai-sdk">
      <TabsList className="w-full overflow-x-auto">
        <TabsTrigger value="ai-sdk">
          <span className="inline-flex items-center gap-1">
            <IconLoader icon={siVercel} size={16} />
            AI SDK
          </span>
        </TabsTrigger>
        <TabsTrigger value="mastra">
          <span className="inline-flex items-center gap-1.5">
            <BrandIcon src="/mastra.svg" alt="Mastra" className="h-4 w-auto" />
            Mastra
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ai-sdk">
        <CodeBlock code={AI_SDK_CODE} onCopy={() => copyToClipboard(AI_SDK_CODE)} isCopied={isCopied} />
      </TabsContent>

      <TabsContent value="mastra">
        <CodeBlock code={MASTRA_CODE} onCopy={() => copyToClipboard(MASTRA_CODE)} isCopied={isCopied} />
      </TabsContent>
    </Tabs>
  );
}
