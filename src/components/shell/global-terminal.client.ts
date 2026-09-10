import { navigate } from "astro:transitions/client";

import { companyCapabilities } from "../../data/companyCapabilities";

type TerminalContext = "home" | "about";
type OutputTone = "default" | "muted" | "error";

interface TerminalEntry {
  id: number;
  context: TerminalContext;
  command: string;
  lines: string[];
  tone: OutputTone;
}

interface StoredTerminalState {
  entries: TerminalEntry[];
  commandHistory: string[];
  isOpen: boolean;
}

interface CommandExecutionContext {
  args: string[];
  rawArgs: string;
  commandHistory: string[];
}

interface CommandResult {
  lines?: string[];
  tone?: OutputTone;
  clear?: boolean;
  destination?: "home" | "about";
}

interface TerminalCommand {
  name: string;
  aliases: readonly string[];
  usage: string;
  description: string;
  execute: (context: CommandExecutionContext) => CommandResult;
}

const STORAGE_KEY = "z3ntry:terminal:v1";
const MAX_ENTRIES = 80;
const MAX_HISTORY = 50;

const capabilityNames = companyCapabilities.map(({ name }) => name.toUpperCase());

const commands: TerminalCommand[] = [
  {
    name: "help",
    aliases: ["?"],
    usage: "help",
    description: "List available commands.",
    execute: () => ({
      lines: commands.map(({ usage, description }) => `${usage.padEnd(36)} ${description}`)
    })
  },
  {
    name: "clear",
    aliases: ["cls"],
    usage: "clear",
    description: "Clear visible output.",
    execute: () => ({ clear: true })
  },
  {
    name: "history",
    aliases: [],
    usage: "history",
    description: "Show commands from this session.",
    execute: ({ commandHistory }) => ({
      lines: commandHistory.map((command, index) => `${String(index + 1).padStart(2, "0")}  ${command}`)
    })
  },
  {
    name: "home",
    aliases: [],
    usage: "home",
    description: "Navigate to Home.",
    execute: () => ({ lines: ["NAVIGATING: HOME"], destination: "home" })
  },
  {
    name: "about",
    aliases: [],
    usage: "about",
    description: "Navigate to About.",
    execute: () => ({ lines: ["NAVIGATING: ABOUT"], destination: "about" })
  },
  {
    name: "open",
    aliases: [],
    usage: "open home|about",
    description: "Open an available route.",
    execute: ({ args }) => {
      const destination = args[0]?.toLowerCase();
      if (destination === "home" || destination === "about") {
        return { lines: [`NAVIGATING: ${destination.toUpperCase()}`], destination };
      }
      return { lines: ["USAGE: open home|about"], tone: "error" };
    }
  },
  {
    name: "whoami",
    aliases: [],
    usage: "whoami",
    description: "Describe Z3nTry.",
    execute: () => ({
      lines: [
        "Z3NTRY / TECHNOLOGY COMPANY",
        "CYBERSECURITY AT THE CORE. DEVELOPMENT AND DIGITAL DESIGN INTEGRATED."
      ]
    })
  },
  {
    name: "capabilities",
    aliases: [],
    usage: "capabilities [name]",
    description: "List or inspect core capabilities.",
    execute: ({ args }) => {
      if (args.length === 0) return { lines: capabilityNames };

      const requested = args.join(" ").toLowerCase();
      const capability = companyCapabilities.find(({ name }) => name.toLowerCase() === requested);
      if (!capability) {
        return {
          lines: [`UNKNOWN CAPABILITY: ${requested.toUpperCase()}`, `AVAILABLE: ${capabilityNames.join(" / ")}`],
          tone: "error"
        };
      }

      return {
        lines: [
          `${capability.index} / ${capability.name.toUpperCase()}`,
          capability.keywords.join(" / ").toUpperCase(),
          capability.description
        ]
      };
    }
  },
  {
    name: "status",
    aliases: [],
    usage: "status",
    description: "Show the current site status.",
    execute: () => ({
      lines: ["SYSTEM: OPERATIONAL", "ORIGIN: BOGOTÁ, COLOMBIA", `CAPABILITIES: ${companyCapabilities.length}`]
    })
  },
  {
    name: "location",
    aliases: [],
    usage: "location",
    description: "Show the network origin.",
    execute: () => ({ lines: ["BOGOTÁ, COLOMBIA", "04.7110° N / 074.0721° W"] })
  },
  {
    name: "date",
    aliases: [],
    usage: "date",
    description: "Show local browser date and time.",
    execute: () => ({
      lines: [new Intl.DateTimeFormat(document.documentElement.lang || "es-CO", {
        dateStyle: "medium",
        timeStyle: "medium"
      }).format(new Date())]
    })
  },
  {
    name: "echo",
    aliases: [],
    usage: "echo <text>",
    description: "Print text in the terminal.",
    execute: ({ rawArgs }) => ({ lines: [rawArgs] })
  }
];

const completions = [
  ...commands.flatMap(({ name, aliases }) => [name, ...aliases]),
  "open home",
  "open about",
  ...companyCapabilities.map(({ name }) => `capabilities ${name.toLowerCase()}`)
];

function isOutputTone(value: unknown): value is OutputTone {
  return value === "default" || value === "muted" || value === "error";
}

function isTerminalEntry(value: unknown): value is TerminalEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<TerminalEntry>;
  return typeof entry.id === "number"
    && (entry.context === "home" || entry.context === "about")
    && typeof entry.command === "string"
    && Array.isArray(entry.lines)
    && entry.lines.every((line) => typeof line === "string")
    && isOutputTone(entry.tone);
}

function loadState(): StoredTerminalState {
  const fallback: StoredTerminalState = { entries: [], commandHistory: [], isOpen: false };

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return fallback;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return fallback;

    const state = parsed as Partial<StoredTerminalState>;
    return {
      entries: Array.isArray(state.entries) ? state.entries.filter(isTerminalEntry).slice(-MAX_ENTRIES) : [],
      commandHistory: Array.isArray(state.commandHistory)
        ? state.commandHistory.filter((command): command is string => typeof command === "string").slice(-MAX_HISTORY)
        : [],
      isOpen: state.isOpen === true
    };
  } catch {
    return fallback;
  }
}

function saveState(state: StoredTerminalState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The terminal remains usable when browser storage is unavailable.
  }
}

function findCommand(name: string): TerminalCommand | undefined {
  return commands.find((command) => command.name === name || command.aliases.includes(name));
}

function navigateTo(destination: "home" | "about"): void {
  if (destination === "home" && window.location.pathname === "/") {
    document.querySelector<HTMLElement>("[data-hero]")?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  void navigate(destination === "home" ? "/#home" : "/about");
}

export function setupGlobalTerminal(root: HTMLElement): () => void {
  const trigger = root.querySelector<HTMLButtonElement>("[data-terminal-trigger]");
  const panel = root.querySelector<HTMLElement>("[data-terminal-panel]");
  const closeButton = root.querySelector<HTMLButtonElement>("[data-terminal-close]");
  const form = root.querySelector<HTMLFormElement>("[data-terminal-form]");
  const input = root.querySelector<HTMLInputElement>("[data-terminal-input]");
  const output = root.querySelector<HTMLElement>("[data-terminal-output]");
  const promptPathElements = root.querySelectorAll<HTMLElement>("[data-terminal-path]");
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const about = document.querySelector<HTMLElement>("[data-about]");

  if (!trigger || !panel || !closeButton || !form || !input || !output) {
    return () => undefined;
  }

  const state = loadState();
  let context: TerminalContext = window.location.pathname.startsWith("/about") ? "about" : "home";
  let historyIndex = state.commandHistory.length;
  let entryId = state.entries.reduce((maximum, entry) => Math.max(maximum, entry.id), 0) + 1;
  let contextObserver: IntersectionObserver | undefined;

  const updatePrompt = (): void => {
    const path = context === "about" ? "~/about" : "~";
    promptPathElements.forEach((element) => { element.textContent = path; });
  };

  const scrollToLatest = (): void => {
    window.requestAnimationFrame(() => { output.scrollTop = output.scrollHeight; });
  };

  const render = (): void => {
    output.replaceChildren();
    const fragment = document.createDocumentFragment();

    state.entries.forEach((entry) => {
      const group = document.createElement("div");
      group.className = "terminal-entry";

      const commandLine = document.createElement("p");
      commandLine.className = "terminal-entry__command";
      commandLine.textContent = `root@z3ntry:${entry.context === "about" ? "~/about" : "~"}# ${entry.command}`;
      group.append(commandLine);

      entry.lines.forEach((line) => {
        const resultLine = document.createElement("p");
        resultLine.className = `terminal-entry__output terminal-entry__output--${entry.tone}`;
        resultLine.textContent = line || " ";
        group.append(resultLine);
      });

      fragment.append(group);
    });

    output.append(fragment);
    scrollToLatest();
  };

  const setOpen = (isOpen: boolean, restoreFocus = false): void => {
    state.isOpen = isOpen;
    root.dataset.open = String(isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
    panel.inert = !isOpen;
    saveState(state);

    if (isOpen) {
      render();
      window.requestAnimationFrame(() => input.focus());
    } else if (restoreFocus) {
      trigger.focus();
    }
  };

  const appendEntry = (command: string, result: CommandResult): void => {
    if (result.clear) {
      state.entries = [];
    } else {
      state.entries.push({
        id: entryId,
        context,
        command,
        lines: result.lines ?? [],
        tone: result.tone ?? "default"
      });
      entryId += 1;
      state.entries = state.entries.slice(-MAX_ENTRIES);
    }
    saveState(state);
    render();
  };

  const handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const rawCommand = input.value.trim();
    input.value = "";
    if (!rawCommand) return;

    state.commandHistory.push(rawCommand);
    state.commandHistory = state.commandHistory.slice(-MAX_HISTORY);
    historyIndex = state.commandHistory.length;

    const [name = "", ...args] = rawCommand.split(/\s+/);
    const rawArgs = rawCommand.slice(name.length).trim();
    const command = findCommand(name.toLowerCase());
    const result = command
      ? command.execute({ args, rawArgs, commandHistory: state.commandHistory })
      : { lines: ["COMMAND NOT FOUND — TYPE HELP"], tone: "error" as const };

    appendEntry(rawCommand, result);
    if (result.destination) navigateTo(result.destination);
  };

  const handleInputKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, true);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const direction = event.key === "ArrowUp" ? -1 : 1;
      historyIndex = Math.min(state.commandHistory.length, Math.max(0, historyIndex + direction));
      input.value = state.commandHistory[historyIndex] ?? "";
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    if (event.key === "Tab") {
      const value = input.value.trim().toLowerCase();
      if (!value) return;
      const matches = [...new Set(completions.filter((completion) => completion.startsWith(value)))];
      if (matches.length === 1) {
        event.preventDefault();
        input.value = matches[0] ?? input.value;
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  };

  const handlePanelKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, true);
    }
  };

  const setContext = (nextContext: TerminalContext): void => {
    if (context === nextContext) return;
    context = nextContext;
    updatePrompt();
    if (state.isOpen) render();
  };

  const openTerminal = (): void => setOpen(true);
  const closeTerminal = (): void => setOpen(false, true);

  trigger.addEventListener("click", openTerminal);
  closeButton.addEventListener("click", closeTerminal);
  form.addEventListener("submit", handleSubmit);
  input.addEventListener("keydown", handleInputKeydown);
  panel.addEventListener("keydown", handlePanelKeydown);

  if (hero && about && window.location.pathname === "/") {
    contextObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target === about) setContext("about");
      else if (visible?.target === hero) setContext("home");
    }, { threshold: [0.35, 0.65] });
    contextObserver.observe(hero);
    contextObserver.observe(about);
  }

  updatePrompt();
  setOpen(state.isOpen);

  return () => {
    trigger.removeEventListener("click", openTerminal);
    closeButton.removeEventListener("click", closeTerminal);
    form.removeEventListener("submit", handleSubmit);
    input.removeEventListener("keydown", handleInputKeydown);
    panel.removeEventListener("keydown", handlePanelKeydown);
    contextObserver?.disconnect();
  };
}
