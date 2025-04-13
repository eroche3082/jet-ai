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
      <div className="relative group">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full py-4 px-6 pl-14 rounded-full border border-white/30 bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:border-[#ff6b35] focus:shadow-[#ff6b35]/20 transition-all duration-300 text-gray-800 font-medium placeholder:text-gray-500"
        />
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#ff6b35] group-hover:scale-110 transition-transform duration-300">
          <Search className="h-5 w-5" strokeWidth={2.5} />
        </div>
        
        {/* Animated pulse effect when focused */}
        {isFocused && (
          <span className="absolute inset-0 rounded-full bg-[#ff6b35]/5 animate-pulse"></span>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-[#ff6b35] border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {/* Button to clear input */}
        {inputValue && !isLoading && (
          <button 
            onClick={() => {
              setInputValue('');
              onChange('');
              setSuggestions([]);
            }}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto">
          <div className="pt-3 px-4 pb-2 border-b">
            <h3 className="text-sm font-semibold text-gray-500">Suggestions</h3>
          </div>
          <ul className="py-2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="px-4 py-2.5 hover:bg-[#ff6b35]/5 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-[#ff6b35] transition-colors">
                      {suggestion.mainText}
                    </div>
                    {suggestion.secondaryText && (
                      <div className="text-sm text-gray-500">
                        {suggestion.secondaryText}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}