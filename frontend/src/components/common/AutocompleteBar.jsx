import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";

export default function SearchAutocomplete({
  options = [],
  label = "Search",
  getOptionLabel = (option) => option.name,
  onOptionSelect,
  optionValuePath = "id",
  sx = {},
  textColour = "",
}) {
  const [value, setValue] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleOptionSelect = (selectedOption) => {
    // setLoading(true);
    setError("");
    if (onOptionSelect) {
      onOptionSelect(selectedOption);
    } else {
      setError("Unknown error occurred.");
    }
    // setLoading(false);
  };

  // if (loading) return <div>Loading...</div>;

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (
          newValue &&
          typeof newValue !== "string" &&
          newValue[optionValuePath]
        ) {
          setValue(newValue);
          handleOptionSelect(newValue);
        }
        setValue(null);
      }}
      freeSolo={false}
      selectOnFocus
      clearOnBlur
      clearOnEscape
      autoHighlight
      handleHomeEndKeys
      id="reusable-autocomplete"
      options={options}
      getOptionLabel={getOptionLabel}
      renderOption={(props, option) => (
        <li {...props}>{getOptionLabel(option)}</li>
      )}
      sx={sx}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputLabelProps={{
            style: { color: textColour },
          }}
          inputProps={{
            ...params.inputProps,
            style: { color: "#1A1A1A" },
          }}
        />
      )}
    />
  );
}
