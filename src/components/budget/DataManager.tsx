import React from "react";
import { Button } from "../ui/button";
import { Download, Upload, FileJson } from "lucide-react";
import { getStore, setStore } from "@/lib/store";

interface DataManagerProps {
  onDataChange?: () => void;
}

const DataManager = ({ onDataChange }: DataManagerProps) => {
  const handleExport = () => {
    const data = getStore();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setStore(data);
        onDataChange?.();
      } catch (error) {
        console.error("Error importing data:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleExport}
      >
        <Download className="w-4 h-4" /> Export Data
      </Button>
      <div className="relative">
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-data"
        />
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          asChild
        >
          <label htmlFor="import-data" className="cursor-pointer">
            <Upload className="w-4 h-4" /> Import Data
          </label>
        </Button>
      </div>
    </div>
  );
};

export default DataManager;
