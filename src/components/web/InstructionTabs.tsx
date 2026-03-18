import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BrandIcon } from '@/components/web/BrandIcon'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { IconLoader } from '@/components/web/IconLoader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { trackEvent } from '@/lib/analytics'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { siCursor, siClaude, siZedindustries } from 'simple-icons'

type PromptSection =
  | { type: 'paragraph'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }

const PROMPT_CONTENT: PromptSection[] = [
  {
    type: 'paragraph',
    text: 'Role: You are a helpful assistant that helps with coding tasks. Your goal is to help the developer be more productive while preventing the developer from being a passive code reviewer. You do this by completing the majority of the code for the required tasks, and strategically leaving the critical parts of the code for the developer to complete.'
  },
  { type: 'paragraph', text: 'Your methodology:' },
  {
    type: 'ordered-list',
    items: [
      'Identify the critical parts: before coding, identify the most critical logic block in the request. This is where the human understanding and collaboration must happen.',
      'Generate the scaffold: write the surrounding code. Ensure the code is syntactically correct except for the designated critical parts.',
      'The critical parts: insert comment blocks labelled with "HUMANTODO" (e.g. "// HUMANTODO: [description]") just like you would do with a TODO comment.',
      'Describe the intent and the expected outcome of the missing code. Provide the function signature but leave the body empty (or return a "Not Implemented" placeholder).',
      'You can use tests to ensure the overall feature is working as expected. For the missing code, provide mock implementations within the test files. This proves the overall feature works if the developer completes the missing part of the contract.',
      'If possible, the agent should ask about the examples of components and areas the human want to manually complete.'
    ]
  },
  {
    type: 'paragraph',
    text: 'For example, you can apply the 80/20 rule: you write most of the code; reserve the 20% that demands human judgment for HUMANTODO. Examples of what to complete vs. leave:'
  },
  {
    type: 'unordered-list',
    items: [
      'Complete: boilerplate, imports, standard APIs, types, basic CRUD.',
      'Leave for developer: business rules, complex state, security decisions, non-trivial data transforms.',
      'Prefer logic over plumbing, e.g. write the DB connection, leave the “what to persist” logic.',
      'Prefer state over UI, e.g. build the component and styles, leave tricky useEffect or reducer logic.',
      'Prefer security intent over syntax, e.g. write the middleware, leave the concrete permission checks.',
      'Leave suggestions, context, caveats, or anything you think might be important as comments'
    ]
  }
]

function promptToPlainText(sections: PromptSection[]): string {
  return sections
    .map((section) => {
      if (section.type === 'paragraph') return section.text
      if (section.type === 'unordered-list') return section.items.map((item) => `- ${item}`).join('\n')
      if (section.type === 'ordered-list') return section.items.map((item, i) => `${i + 1}. ${item}`).join('\n')
      return ''
    })
    .join('\n\n')
}

function promptToJSX(sections: PromptSection[]) {
  return (
    <>
      {sections.map((section, i) => {
        if (section.type === 'paragraph') return <p key={i}>{section.text}</p>
        if (section.type === 'unordered-list')
          return (
            <ul key={i} className="mb-2 list-inside list-disc">
              {section.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )
        if (section.type === 'ordered-list')
          return (
            <ol key={i} className="mb-2 list-inside list-decimal">
              {section.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ol>
          )
        return null
      })}
    </>
  )
}

const INSTRUCTION_TAB_LABELS = {
  cursor: 'Cursor',
  'claude-code': 'Claude Code',
  codex: 'Codex',
  zed: 'Zed',
  'vs-code': 'VS Code'
} as const

export function InstructionTabs() {
  const [activeTab, setActiveTab] = useState<keyof typeof INSTRUCTION_TAB_LABELS>('cursor')
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => trackEvent(`Homepage: Prompt Copied - ${INSTRUCTION_TAB_LABELS[activeTab]}`)
  })

  return (
    <Tabs
      defaultValue="cursor"
      className="w-full"
      onValueChange={(value) => {
        const nextValue = value as keyof typeof INSTRUCTION_TAB_LABELS
        setActiveTab(nextValue)
        trackEvent(`Homepage: Instruction Tab Selected - ${INSTRUCTION_TAB_LABELS[nextValue]}`)
      }}
    >
      <TabsList className="w-full overflow-x-auto">
        <TabsTrigger value="cursor">
          <span className="inline-flex items-center gap-1">
            <IconLoader icon={siCursor} size={16} />
            Cursor
          </span>
        </TabsTrigger>
        <TabsTrigger value="claude-code">
          <span className="inline-flex items-center gap-1">
            <IconLoader icon={siClaude} size={16} />
            Claude Code
          </span>
        </TabsTrigger>
        <TabsTrigger value="codex">
          <span className="inline-flex items-center gap-1">
            <BrandIcon src="/codex.svg" alt="Codex" width={16} height={16} />
            Codex
          </span>
        </TabsTrigger>
        <TabsTrigger value="zed">
          <span className="inline-flex items-center gap-1">
            <IconLoader icon={siZedindustries} size={16} />
            Zed
          </span>
        </TabsTrigger>
        <TabsTrigger value="vs-code">
          <span className="inline-flex items-center gap-1">
            <BrandIcon src="/vscode.svg" alt="VS Code" width={16} height={16} />
            VS Code
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cursor">
        <Card>
          <CardHeader>
            <CardTitle>Project Rule</CardTitle>
            <CardDescription>
              Project rules live in the <code className="rounded bg-muted px-1 py-0.5">.cursor/rules</code> directory as
              markdown files (<code className="rounded bg-muted px-1 py-0.5">.md</code> or{' '}
              <code className="rounded bg-muted px-1 py-0.5">.mdc</code>). Alternatively, use{' '}
              <code className="rounded bg-muted px-1 py-0.5">AGENTS.md</code> in the project root. Paste the prompt in a
              rule file there.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <section className="relative flex flex-col gap-2 rounded-md border bg-muted/30 p-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => copyToClipboard(promptToPlainText(PROMPT_CONTENT))}
                aria-label={isCopied ? 'Copied' : 'Copy prompt'}
              >
                {isCopied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
              <p className="pr-10 font-medium text-foreground">Prompt to use:</p>
              <div className="flex flex-col gap-2">{promptToJSX(PROMPT_CONTENT)}</div>
            </section>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="claude-code">
        <Card>
          <CardHeader>
            <CardTitle>CLAUDE.md</CardTitle>
            <CardDescription>
              Claude Code reads instructions from <code className="rounded bg-muted px-1 py-0.5">CLAUDE.md</code> files
              in your project root (or any directory). Paste the prompt into a{' '}
              <code className="rounded bg-muted px-1 py-0.5">CLAUDE.md</code> file at the root of your repository.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <section className="relative flex flex-col gap-2 rounded-md border bg-muted/30 p-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => copyToClipboard(promptToPlainText(PROMPT_CONTENT))}
                aria-label={isCopied ? 'Copied' : 'Copy prompt'}
              >
                {isCopied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
              <p className="pr-10 font-medium text-foreground">Prompt to use:</p>
              <div className="flex flex-col gap-2">{promptToJSX(PROMPT_CONTENT)}</div>
            </section>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="codex">
        <Card>
          <CardHeader>
            <CardTitle>AGENTS.md</CardTitle>
            <CardDescription>
              Codex automatically discovers and injects <code className="rounded bg-muted px-1 py-0.5">AGENTS.md</code>{' '}
              files into the conversation. Files are pulled from{' '}
              <code className="rounded bg-muted px-1 py-0.5">~/.codex</code> plus each directory from repo root to your
              current working directory, merged in order (later directories override earlier ones). Place the prompt in
              an <code className="rounded bg-muted px-1 py-0.5">AGENTS.md</code> file at the root of your repository.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <section className="relative flex flex-col gap-2 rounded-md border bg-muted/30 p-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => copyToClipboard(promptToPlainText(PROMPT_CONTENT))}
                aria-label={isCopied ? 'Copied' : 'Copy prompt'}
              >
                {isCopied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
              <p className="pr-10 font-medium text-foreground">Prompt to use:</p>
              <div className="flex flex-col gap-2">{promptToJSX(PROMPT_CONTENT)}</div>
            </section>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="zed">
        <Card>
          <CardHeader>
            <CardTitle>Rules File</CardTitle>
            <CardDescription>
              Zed's AI assistant automatically loads the first matching rules file it finds in your project root. It
              checks in priority order: <code className="rounded bg-muted px-1 py-0.5">GEMINI.md</code>,{' '}
              <code className="rounded bg-muted px-1 py-0.5">CLAUDE.md</code>,{' '}
              <code className="rounded bg-muted px-1 py-0.5">AGENTS.md</code>,{' '}
              <code className="rounded bg-muted px-1 py-0.5">.cursorrules</code>,{' '}
              <code className="rounded bg-muted px-1 py-0.5">.rules</code>, and others. Place the prompt in any of these
              files, or use the Rules Library via{' '}
              <code className="rounded bg-muted px-1 py-0.5">agent: open rules library</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <section className="relative flex flex-col gap-2 rounded-md border bg-muted/30 p-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => copyToClipboard(promptToPlainText(PROMPT_CONTENT))}
                aria-label={isCopied ? 'Copied' : 'Copy prompt'}
              >
                {isCopied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
              <p className="pr-10 font-medium text-foreground">Prompt to use:</p>
              <div className="flex flex-col gap-2">{promptToJSX(PROMPT_CONTENT)}</div>
            </section>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="vs-code">
        <Card>
          <CardHeader>
            <CardTitle>copilot-instructions.md</CardTitle>
            <CardDescription>
              VS Code automatically detects a{' '}
              <code className="rounded bg-muted px-1 py-0.5">.github/copilot-instructions.md</code> file in your
              workspace root and applies it to all Copilot chat requests. It also supports{' '}
              <code className="rounded bg-muted px-1 py-0.5">AGENTS.md</code> and{' '}
              <code className="rounded bg-muted px-1 py-0.5">CLAUDE.md</code> files. Paste the prompt into any of these
              files.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <section className="relative flex flex-col gap-2 rounded-md border bg-muted/30 p-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => copyToClipboard(promptToPlainText(PROMPT_CONTENT))}
                aria-label={isCopied ? 'Copied' : 'Copy prompt'}
              >
                {isCopied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
              <p className="pr-10 font-medium text-foreground">Prompt to use:</p>
              <div className="flex flex-col gap-2">{promptToJSX(PROMPT_CONTENT)}</div>
            </section>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
