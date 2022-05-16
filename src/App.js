import Axios from "axios";
import "./App.css";
import { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(0);

  const [newWage, setNewWage] = useState(0);

  const [boardList, setboardList] = useState([]);

  const [sorted, setSorted] = useState(false);

  const addBoard = () => {
    Axios.post("http://localhost:5000/create", {
      name: name,
      age: age,
      country: country,
      position: position,
      wage: wage,
    }).then(() => {
      getBoards();
    });
  };

  const toggleSort = (sorted) => {
    Axios.get("http://localhost:5000/boardsSorted?order=" + sorted).then(
      (response) => {
        setboardList(response.data);
        setSorted(!sorted);
        console.log(response);
      }
    );
  };

  const getBoards = () => {
    Axios.get("http://localhost:5000/boards").then((response) => {
      setboardList(response.data);
    });
  };

  const updateBoardWage = (id) => {
    Axios.put("http://localhost:5000/update", { wage: newWage, id: id }).then(
      () => {
        setboardList(
          boardList.map((val) => {
            return val.id == id
              ? {
                  id: val.id,
                  name: val.name,
                  country: val.country,
                  age: val.age,
                  position: val.position,
                  wage: newWage,
                }
              : val;
          })
        );
      }
    );
  };

  const deleteBoard = (id) => {
    Axios.delete(`http://localhost:5000/delete/${id}`).then((response) => {
      setboardList(
        boardList.filter((val) => {
          return val.id != id;
        })
      );
    });
  };

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/dashboard">
            <Navbar />
            <Dashboard />
          </Route>
        </Switch>
      </BrowserRouter>

      <div className="App">
        <div className="information">
          <label>Name:</label>
          <input
            type="text"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <label>Age:</label>
          <input
            type="number"
            onChange={(event) => {
              // @ts-ignore
              setAge(event.target.value);
            }}
          />
          <label>Country:</label>
          <input
            type="text"
            onChange={(event) => {
              setCountry(event.target.value);
            }}
          />
          <label>Position:</label>
          <input
            type="text"
            onChange={(event) => {
              setPosition(event.target.value);
            }}
          />
          <label>Wage (year):</label>
          <input
            type="number"
            onChange={(event) => {
              // @ts-ignore
              setWage(event.target.value);
            }}
          />
          <button onClick={addBoard}>Add Boards</button>
        </div>
        <hr />
        <div className="boards">
          <button onClick={getBoards}>Show Boards</button>

          <button
            className="toggle-button"
            onClick={() => {
              toggleSort(sorted);
            }}
          >
            {sorted ? "Ascending Order ▲" : "Descending Order ▼"}
          </button>

          {boardList.map((val, key) => {
            return (
              <div className="board">
                <div>
                  <h3>Name: {val.name}</h3>
                  <h3>Age: {val.age}</h3>
                  <h3>Country: {val.country}</h3>
                  <h3>Position: {val.position}</h3>
                  <h3>Wage: {val.wage}</h3>
                  <h3>Created By: {val.createdByName}</h3>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="20000..."
                    onChange={(event) => {
                      // @ts-ignore
                      setNewWage(event.target.value);
                    }}
                  />
                  <button onClick={() => updateBoardWage(val.id)}>
                    Update
                  </button>

                  <button onClick={() => deleteBoard(val.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
