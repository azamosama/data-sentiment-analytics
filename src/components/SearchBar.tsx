
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search or ask a question...", 
  className = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`search-bar ${className}`}>
      <Search className="w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground"
        aria-label="Search"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      )}
    </form>
  );
};

export default SearchBar;
