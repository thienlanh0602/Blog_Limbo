import ReactDOM from "react-dom/client";
import "./index.css";
import Routers from "./router/Router";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <Routers />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);