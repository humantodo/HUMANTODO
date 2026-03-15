import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { BrandIcon } from '@/components/web/BrandIcon'

const AGENCY_LEVELS: {
  ranges: number[]
  icons: { src: string; name: string }[]
  label: string
}[] = [
  {
    ranges: [0],
    icons: [
      { src: '/vscode.svg', name: 'VS Code' },
      { src: '/neovim.svg', name: 'Neovim' }
    ],
    label: 'Code Editors'
  },
  {
    ranges: [5, 25],
    icons: [
      { src: '/cursor.svg', name: 'Cursor' },
      { src: '/antigravity.svg', name: 'Antigravity' }
    ],
    label: 'Code Editors (with agents)'
  },
  {
    ranges: [30, 45],
    icons: [
      { src: '/langchain.svg', name: 'LangChain' },
      { src: '/crewai.svg', name: 'CrewAI' },
      { src: '/mastra.svg', name: 'Mastra' }
    ],
    label: 'Modular Agents'
  },
  {
    ranges: [50, 75],
    icons: [
      { src: '/claudecode.png', name: 'Claude Code' },
      { src: '/opencode.svg', name: 'OpenCode' },
      { src: '/codex.svg', name: 'Codex' }
    ],
    label: 'Opinionated Agents'
  },
  {
    ranges: [80, 85],
    icons: [
      { src: '/manus.svg', name: 'Manus' },
      { src: '/deepmind.svg', name: 'DeepMind' }
    ],
    label: 'Deep Agents'
  },
  {
    ranges: [90, 100],
    icons: [{ src: '/openclaw.svg', name: 'OpenClaw' }],
    label: 'Full Autonomous Agents'
  }
]

function TooltipIcon({ src, name }: { src: string; name: string }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<BrandIcon className="h-8 w-8" src={src} alt={name} />} />
      <TooltipContent>
        <p className="text-sm">{name}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function AgencyIcons({ icons, label }: { icons: { src: string; name: string }[]; label: string }) {
  return (
    <>
      <div className="flex items-center gap-2">
        {icons.map((icon) => (
          <TooltipIcon key={icon.name} src={icon.src} name={icon.name} />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </>
  )
}

export function AgencySlider() {
  const [agency, setAgency] = React.useState(50)

  const level = React.useMemo(
    () =>
      AGENCY_LEVELS.find((l) => {
        const [min, max] = l.ranges.length === 1 ? [l.ranges[0], l.ranges[0]] : [l.ranges[0], l.ranges[1]]
        return agency >= min && agency <= max
      }),
    [agency]
  )

  return (
    <TooltipProvider>
      <div className="mx-auto grid w-full gap-3">
        <div className="-mb-8 flex w-full flex-col items-center justify-center gap-1">
          {level && <AgencyIcons icons={level.icons} label={level.label} />}
        </div>

        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="slider-agency">Agency</Label>
          <span className="text-sm text-muted-foreground">{agency}%</span>
        </div>

        <Slider
          id="slider-agency"
          value={agency}
          onValueChange={(value) => setAgency(value as number)}
          min={0}
          max={100}
          step={5}
        />
      </div>
    </TooltipProvider>
  )
}
