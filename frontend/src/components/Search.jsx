import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const filter = createFilterOptions();

export default function FreeSoloCreateOption() {
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (newValue && typeof newValue !== "string" && newValue.id) {
          // Navigate to the selected category by ID
          navigate(`/category/${newValue.id}`);
        }
        setValue(newValue);
      }}
      filterOptions={(options, params) => {
        // Only filter existing options, don't add a new option
        return filter(options, params);
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={categories}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.name}
          </li>
        );
      }}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search categories"
          sx={{
            borderRadius: "45px",
            marginLeft: "3.5vh",
          }}
        />
      )}
    />
  );
}
