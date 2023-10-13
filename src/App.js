import logo from './logo.svg';
import {getDatabase , ref,set} from 'firebase/database'
import { app } from './FirebaseConfig/Firebase';
import './App.css';
import Navbar from './components/Navbar'

const db = getDatabase(app);

function App() {


const pushData = ()=>{
  set(ref(db,'user/kishor'),
  {
  id:1,
  name:'Kishor',
  age:22
})
}

  return (


    <div className="App">
      <Navbar/>
      <div className='banner'>

      
      </div>
     
     
    </div>
  );
}

export default App;
