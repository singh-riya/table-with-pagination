import React from "react";
import { Icon, InputBase, Paper, Toolbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const EnhancedTableToolbar = ({ handleSearch }) => {
  return (
    <Toolbar
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper>
        <InputBase
          sx={{ ml: 1, pb: "10px", width: "400px" }}
          placeholder="Search Passenger"
          inputProps={{ "aria-label": "search passenger" }}
          type="search"
          onChange={handleSearch}
          onEmptied={handleSearch}
        />
        <Icon sx={{ pt: "10px", pr: "10px" }} aria-label="search">
          <SearchIcon />
        </Icon>
      </Paper>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
