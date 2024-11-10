import * as React from "react";
import SearchAutocomplete from "../common/AutocompleteBar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/header.css";

const SearchBarCategories = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/categories/"
      );
      setCategories(response.data);
    } catch (error) {
      setError(`Error fetching categories: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {/* {error && <p className="error">{error}</p>} */}
      <SearchAutocomplete
        options={categories}
        label="Search categories"
        onOptionSelect={(option) => navigate(`/category/${option.id}`)}
        sx={{
          width: "300px",
          height: "40px",
          padding: "13px",
          marginBottom: "10px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "25px",
            "& fieldset": {
              borderColor: "#f0f0f0",
            },
            "&:hover fieldset": {
              borderColor: "lightgray",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        }}
        textColour="#f0f0f0"
      />
    </>
  );
};

export default SearchBarCategories;
