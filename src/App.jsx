import ChatInterface from "./components/ChatInterface";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <ChatInterface />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
