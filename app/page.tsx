'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, forwardRef, useState, useEffect, useRef } from "react";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type InputTagsAutocompleteProps = {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  placeholder?: string;
  fetchSuggestions: (query: string) => Promise<string[]>;
  minChars?: number;
};

export default function Page({ 
  value, 
  onChange, 
  placeholder = "Type to search...", 
  fetchSuggestions, 
  minChars = 3 
}: InputTagsAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingDataPoint, setPendingDataPoint] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout>();

  const addDataPoint = (item: string) => {
    if (item) {
      const newDataPoints = new Set([...value, item]);
      onChange(Array.from(newDataPoints));
      setPendingDataPoint("");
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (pendingDataPoint.length >= minChars) {
        setIsLoading(true);
        try {
          const results = await fetchSuggestions(pendingDataPoint);
          setSuggestions(results.filter(item => !value.includes(item)));
          setOpen(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    };

    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(fetchData, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [pendingDataPoint, fetchSuggestions, minChars, value]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex">
            <Input
              value={pendingDataPoint}
              onChange={(e) => setPendingDataPoint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDataPoint(pendingDataPoint);
                }
              }}
              className="rounded-r-none"
              placeholder={placeholder}
              ref={inputRef}
            />
            <Button
              type="button"
              variant="secondary"
              className="rounded-l-none border border-l-0"
              onClick={() => addDataPoint(pendingDataPoint)}
            >
              Add
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--trigger-width] p-0">
          <Command>
            <CommandEmpty>
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-2 px-4">Loading...</p>
              ) : (
                <p className="text-sm text-muted-foreground py-2 px-4">No results found.</p>
              )}
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion}
                  onSelect={() => addDataPoint(suggestion)}
                  className="cursor-pointer"
                >
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {value && value.length > 0 && (
        <div className="rounded-md min-h-[2.5rem] overflow-y-auto py-2 flex gap-2 flex-wrap items-center">
          {value.map((item, idx) => (
            <Badge key={idx} variant="secondary">
              {item}
              <button
                type="button"
                className="w-3 ml-2"
                onClick={() => {
                  onChange(value.filter((i) => i !== item));
                }}
              >
                <Cross2Icon className="w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </>
  );
}