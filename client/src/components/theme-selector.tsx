import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export function ThemeSelector() {
  const { currentTheme, setTheme, themeOptions } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-zinc-700 hover:border-primary text-zinc-200 hover:text-primary"
          title="Change theme color"
        >
          <Palette className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-700">
        <div className="p-2">
          <p className="text-xs font-medium text-zinc-400 pb-2">Theme Colors</p>
          <div className="grid grid-cols-5 gap-2">
            {themeOptions.map((theme) => (
              <button
                key={theme.name}
                className={`w-full aspect-square rounded-full flex items-center justify-center transition ${
                  currentTheme.name === theme.name
                    ? "ring-2 ring-zinc-200 scale-110"
                    : "hover:scale-110"
                }`}
                style={{ backgroundColor: theme.primary }}
                onClick={() => setTheme(theme)}
                title={`${theme.name} theme`}
              />
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}