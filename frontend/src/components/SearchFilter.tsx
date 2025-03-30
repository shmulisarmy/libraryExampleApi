import { categories } from "../data/books";

interface SearchFilterProps {
  setSearch: (value: string) => void;
  setFilterAvailable: (value: boolean) => void;
  setSelectedCategory: (value: string) => void;
}

export default function SearchFilter({ setSearch, setFilterAvailable, setSelectedCategory }: SearchFilterProps) {
  return (
    <div class="mb-4">
      <input
        type="text"
        placeholder="Search books..."
        class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
        onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
      />
      <div class="mt-2 flex items-center space-x-4">
        <select
          class="p-2 rounded bg-gray-800 text-white border border-gray-600"
          onChange={(e) => setSelectedCategory((e.target as HTMLSelectElement).value)}
        >
          {categories.map((category) => (
            <option value={category}>{category}</option>
          ))}
        </select>
        <label class="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            class="w-4 h-4"
            onChange={(e) => setFilterAvailable((e.target as HTMLInputElement).checked)}
          />
          <span>Available Only</span>
        </label>
      </div>
    </div>
  );
}
