import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Table from "./components/Table/Table";
import StoresTable from "./components/StoresTable/StoresTable";

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/qr-code-app" element={<Table />} />
          <Route path="/stores" element={<StoresTable />} />
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;
