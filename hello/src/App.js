import "./App.css";
import Empoloyee from "./components/Employee";
import { useState } from "react";
import logo from "./img/a.jpg";
import { v4 } from "uuid";
import AddEmployee from "./components/AddEmployee";

function App() {
  const [role, setRole] = useState("dev");
  const [empoloyees, setEmployees] = useState([
    {
      id: 1,
      name: "A",
      role: "B",
      img: "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA..",
    },
    {
      id: 2,
      name: "C",
      role: "D",
      img: "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA..",
    },
    {
      id: 3,
      name: "E",
      role: "F",
      img: "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA..",
    },
    {
      id: 4,
      name: "G",
      role: "H",
      img: "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA..",
    },
    {
      id: 5,
      name: "J",
      role: "K",
      img: "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA..",
    },
    {
      id: 6,
      name: "L",
      role: "M",
      img: "https://images.pexels.com/photos/7767973/pexels-photo-7767973.jpeg?cs=srgb&dl=pexels-adam-ernster-7767973.jpg&fm=jpg&_gl=1*1wl34fc*_ga*MjIzNjA4NjI0LjE2NjY0NTE2MTg.*_ga_8JE65Q40S6*MTY2NjQ1MTYxOS4xLjEuMTY2NjQ1MTYzNi4wLjAuMA..",
    },
  ]);
  function updateEmployee(id, newName, newRole) {
    let updatedEmployees = empoloyees.map((employe) => {
      if (id == employe.id) {
        return { ...employe, name: newName, role: newRole };
      }
      return employe;
    });
    setEmployees(updatedEmployees);
  }

  function NewEmployee(name, role, img) {
    const NewEmployee = {
      id: v4(),
      name: name,
      role: role,
      img: img,
    };
    setEmployees([...empoloyees, NewEmployee]);
  }

  const a = true;
  return (
    <div>
      {a ? (
        <>
          <input
            type="text"
            onChange={(e) => {
              console.log(e.target.value);
              setRole(e.target.value);
            }}
          />
          <div className="flex flex-wrap">
            {empoloyees.map((e) => {
              return (
                <Empoloyee
                  key={e.id}
                  id={e.id}
                  name={e.name}
                  role={e.role}
                  img={e.img}
                  updateEmployee={updateEmployee}
                />
              );
            })}
          </div>
          <AddEmployee NewEmployee={NewEmployee} />
        </>
      ) : (
        <p>You cannot see emp!</p>
      )}
    </div>
  );
}

export default App;
