import "./App.css";
import ContainerTable from "./components/ContainerTable";
import { Box } from "@mui/material";

function App() {
  return (
    <div className="App">
      <h1>Table</h1>
      <Box m={5}>
        <ContainerTable />
      </Box>
    </div>
  );
}

export default App;
