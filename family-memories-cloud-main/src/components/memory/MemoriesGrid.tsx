
import { Memory } from "@/types";
import MemoryGridCard from "./MemoryGridCard";

interface MemoriesGridProps {
  memories: Memory[];
}

const MemoriesGrid = ({ memories }: MemoriesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {memories.map((memory) => (
        <MemoryGridCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
};

export default MemoriesGrid;
