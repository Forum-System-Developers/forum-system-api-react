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
      .get("http://localhost:8000/api/v1/categories/")
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
          navigate(`/category/${newValue.id}`);
        }
        setValue(newValue);
      }}
      filterOptions={(options, params) => {
        return filter(options, params);
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={categories}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
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
      sx={{
        borderRadius: "20px",
        borderColor: "white",
        width: "300px",
        height: "40px",
        padding: "13px",
        marginBottom: "10px",
        marginLeft: "4vh",
        "& .MuiOutlinedInput-root": {
          borderRadius: "25px",
        },
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search categories" />
      )}
    />
  );
}
