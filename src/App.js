import './App.css';
import 'antd/dist/antd.css'
import { ProjectProvider } from './Project/ProjectContext';
import Routes from './Routes/Routes';

function App() {
  return (
    <>
      <ProjectProvider>
        <Routes/>
      </ProjectProvider>
    </>
  );
}

export default App;
