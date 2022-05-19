import Axios from "axios";
import "./App.css";
import { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");

  const [isActive, setActive] = useState(false);

  const [boardList, setboardList] = useState([]);

  const [sorted, setSorted] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  const addBoard = () => {
    if (firstName === "") {
      alert("Name required");
      return 0;
    } 
    else if (title === "") {
      alert("Title required");
      return 0;
    }

    Axios.post("http://localhost:5000/create", {
      firstName: firstName,
      lastName: lastName,
      title: title,
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

  // const updateBoardWage = (id) => {
  //   Axios.put("http://localhost:5000/update", { wage: newWage, id: id }).then(
  //     () => {
  //       setboardList(
  //         boardList.map((val) => {
  //           return val.id === id
  //             ? {
  //                 id: val.id,
  //                 name: val.name,
  //                 country: val.country,
  //                 age: val.age,
  //                 position: val.position,
  //                 wage: newWage,
  //               }
  //             : val;
  //         })
  //       );
  //     }
  //   );
  // };

  const deleteBoard = (id) => {
    Axios.delete(`http://localhost:5000/delete/${id}`).then((response) => {
      setboardList(
        boardList.filter((val) => {
          return val.id !== id;
        })
      );
    });
  };

  const formateDate = (date) => {
    return date.split("T")[0];
  };

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/dashboard">
            <Navbar signedIn={true} />
            <Dashboard isActive={isActive} toggleClass={toggleClass} />
          </Route>
        </Switch>
      </BrowserRouter>

      <div className={isActive ? "hero-body hide" : "hero-body"}>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-desktop">
              <form onSubmit={null} className="box">
                <article className="message is-white">
                  <div className="message-header" style={{ padding: "0" }}>
                    <h2>Create new board</h2>
                    <button
                      className="delete"
                      onClick={(e) => {
                        e.preventDefault();

                        toggleClass();
                      }}
                    ></button>
                  </div>
                </article>
                <p className="has-text-centered">{null}</p>
                <div className="field is-hotizontal mt-5">
                  <label className="label">Who is this board for?</label>
                  <div className="field is-horizontal">
                    <div className="field-body">
                      <div className="field">
                        <p className="control is-expanded left">
                          <input
                            className="input"
                            type="text"
                            placeholder="First name"
                            onChange={(event) => {
                              setFirstName(event.target.value);
                            }}
                            required
                          />
                        </p>
                      </div>
                      <div className="field">
                        <p className="control is-expanded right">
                          <input
                            className="input"
                            type="text"
                            placeholder="Last name"
                            onChange={(event) => {
                              setLastName(event.target.value);
                            }}
                            required
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* title section */}
                  <label className="label">
                    What title would you like on top of the board?
                  </label>
                  <div className="field-body">
                    <div className="field">
                      <p className="control is-expanded left">
                        <input
                          className="input"
                          type="text"
                          placeholder="Happy Bday, Get Well Soon, You're Amazing, etc."
                          onChange={(event) => {
                            setTitle(event.target.value);
                          }}
                          required
                        />
                      </p>
                    </div>
                  </div>

                  {/* next button */}
                  <div className="field mt-4">
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded">
                          <button
                            className="button is-fullwidth is-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              addBoard();
                            }}
                          >
                            Create board
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* check if we are logged in  */}
      {(window.location.href === "http://localhost:3000/dashboard") === true ? (
        <div className="App">
          <div className="information">
            <button
              className="new-board-btn"
              onClick={(e) => {
                e.preventDefault();
                if (isActive) toggleClass();
              }}
            >
              New Board
            </button>

            {/* <label>Name:</label>
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
            /> */}
          </div>
          <hr />
          <div className="boards">
            {/* <button onClick={getBoards}>Show Boards</button>

            <button
              className="toggle-button"
              onClick={() => {
                toggleSort(sorted);
              }}
            >
              {sorted ? "Ascending Order ▲" : "Descending Order ▼"}
            </button> */}

            {boardList.map((val, key) => {
              return (
                <div className="board">
                  <div>
                    <h3>First name: {val.firstName}</h3>
                    <h3>Last name: {val.lastName}</h3>
                    <h3>Board title: {val.title}</h3>
                    <h3>
                      {val.createdByName
                        ? `Created By: ${val.createdByName}`
                        : null}
                    </h3>
                    <h3>Created: {formateDate(val.createdOn)}</h3>
                  </div>
                  {/* <div>
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
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
