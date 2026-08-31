
import './App.css'
import Sidebar from "./components/sidebar";
import Chatwindow from "./components/chatwindow";
import Mycontext from "./mycontext";


function App() {
  const providervalue = {};
  return (
    <div className="main">
      <Mycontext.Provider value={providervalue}>
        <Sidebar />
        <Chatwindow />
      </Mycontext.Provider>
    </div>
  )
}

export default App;
