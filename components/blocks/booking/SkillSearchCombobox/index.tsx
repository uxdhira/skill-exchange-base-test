"use client";

import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { getSkillOwnerDocumentId } from "@/lib/utility";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function SkillSearchCombobox({
  allSkills,
  profileDocumentId,
  selectedRequestedSkillId,
  setSelectedRequestedSkillId,
  setMode,
  setLocation,
  normalizeMode,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const ownerId = getSkillOwnerDocumentId(skill);
      const isOwnSkill = ownerId === profileDocumentId;

      if (isOwnSkill) return false;

      if (!search.trim()) return true;

      return skill.title.toLowerCase().includes(search.trim().toLowerCase());
    });
  }, [allSkills, profileDocumentId, search]);

  return (
    <div className="relative">
      {/* Input trigger */}
      <div
        className="flex items-center rounded-md border px-3 py-2 cursor-text"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 text-slate-400" />
        <input
          placeholder="Search skill (e.g. Python, Guitar...)"
          className="w-full outline-none text-sm"
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={setSearch}
              className="hidden"
            />

            <CommandList className="max-h-56 overflow-y-auto">
              <CommandEmpty className="p-3 text-xs text-slate-500">
                No skills found
              </CommandEmpty>

              <CommandGroup>
                {filteredSkills.map((skill) => {
                  const isSelected =
                    skill.documentId === selectedRequestedSkillId;

                  return (
                    <CommandItem
                      key={skill.documentId}
                      value={skill.title}
                      onSelect={() => {
                        setSelectedRequestedSkillId(skill.documentId);
                        setMode(normalizeMode(skill.mode));

                        if (skill.location) {
                          setLocation(skill.location);
                        }

                        setSearch(skill.title);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">{skill.title}</span>
                        <span className="text-xs text-slate-500">
                          {[skill.owner?.firstName, skill.owner?.lastName]
                            .filter(Boolean)
                            .join(" ") || "Unknown"}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 text-emerald-600" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

export default SkillSearchCombobox;
