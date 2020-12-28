import React, {Suspense} from 'react';
// import Dashboard  from "./Dashboard";
import CircularProgress from '@material-ui/core/CircularProgress';
const Dashboard = React.lazy(() => import('./Dashboard'));
function App() {
  return (
    <div>
       <Suspense fallback={
        <CircularProgress 
          justify="center"
          style={{marginTop: "25%",marginBottom: "30%", marginLeft: "50%"}} 
          color="inherit"/>}>
        <Dashboard/>
      </Suspense>
    </div>
  );
}

export default App;
