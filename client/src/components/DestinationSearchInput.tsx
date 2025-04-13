import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { getPlaceAutocomplete, type PlacePrediction } from "@/lib/googlePlaces";
import { useDebounce } from "@/hooks/use-debounce";

interface DestinationSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: PlacePrediction) => void;
  placeholder?: string;
  className?: string;
}

export default function DestinationSearchInput({
  value,
  onChange,
  onSelect,
  placeholder = "Search destinations or countries...",
  className = "",
}: DestinationSearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedValue = useDebounce(inputValue, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedValue.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const places = await getPlaceAutocomplete(debouncedValue);
        setSuggestions(places);
      } catch (error) {
        console.error("Error fetching places:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: PlacePrediction) => {
    setInputValue(suggestion.description);
    onChange(suggestion.description);
    setSuggestions([]);
    setIsFocused(false);
    
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full py-3 px-5 pl-12 rounded-full border border-gray-200 focus:outline-none focus:border-[#3a55e7]"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3a55e7]">
          <Search className="h-5 w-5" />
        </div>
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-[#3a55e7] border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border overflow-hidden max-h-72 overflow-y-auto">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="font-medium">{suggestion.mainText}</div>
                {suggestion.secondaryText && (
                  <div className="text-sm text-gray-500">
                    {suggestion.secondaryText}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}