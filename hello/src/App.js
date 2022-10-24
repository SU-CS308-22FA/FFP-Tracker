
import './App.css';
import Empoloyee from './components/Employee';
import { useState } from 'react';
import logo from "/Users/taners/Desktop/react/src/img/a.jpg"
import { v4 } from 'uuid';

function App() {

  const [role,setRole] = useState('dev');
  const [empoloyees,setEmployees] = useState(
    [
          {
            name: "A",
            role: "B",
            img : "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA.."
          },
          {
            name: "C",
            role: "D",
            img : "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA.."
          },
          {
            name: "E",
            role: "F",
            img : "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA.."
          },
          {
            name: "G",
            role: "H",
            img : "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA.."
          },
          {
            name: "J",
            role: "K",
            img : "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA.."
          },
          {
            name: "L",
            role: "M",
            img : "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA.."
          }

    ]

  );

  const a = true;
  return (
    <div >
      {
      a ?
      
        
       ( 
          <>
          <input type="text" onChange={(e) =>{
            console.log(e.target.value);
            setRole(e.target.value);
          } }/>
              <div className='flex flex-wrap'>
              {empoloyees.map((e)=>{
                return(<Empoloyee name ={e.name} role={e.role} img={e.img} key={v4()} />);
                  
              })}
              </div>
          </>
        

          ) : (<p>You cannot see emp!</p>) 
      }
       
    </div>
  );
}

export default App;
