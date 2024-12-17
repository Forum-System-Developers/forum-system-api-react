import * as React from "react";
import SearchAutocomplete from "../common/AutocompleteBar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Header.css";
import SERVER_URL from "../../service/server";

const SearchBarCategories = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`https://${SERVER_URL}/categories/`);
      setCategories(response.data);
    } catch (error) {
      setError(`Error fetching categories: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const redirectCategory = (option) => {
    navigate(`/category/${option.id}`);
  };

  return (
    <>
      <SearchAutocomplete
        options={categories}
        label="Search categories"
        onOptionSelect={(option) => redirectCategory(option)}
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
