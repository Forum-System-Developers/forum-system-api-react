import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
// import ".../styles/autocomplete.css";

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
  const [error, setError] = useState(null);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (
          newValue &&
          typeof newValue !== "string" &&
          newValue[optionValuePath]
        ) {
          if (onOptionSelect) {
            onOptionSelect(newValue);
          } else {
            setError("Unknown error occurred.");
          }
        }
        setValue(null);
      }}
      freeSolo={false}
      selectOnFocus
      clearOnBlur
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
