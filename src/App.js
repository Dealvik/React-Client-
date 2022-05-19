import Axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");

  const [isActive, setActive] = useState(true);

  const [boardList, setboardList] = useState([]);

  const [sorted, setSorted] = useState(false);

  function toggleClass() {
    setActive(!isActive);
  }

  const addBoard = () => {
    if (firstName === "") {
      alert("Name required");
      return 0;
    } else if (title === "") {
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

  useEffect(() => {
    getBoards();
  });

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
            <Dashboard isActive={isActive} setActive={setActive} />
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
                              toggleClass();
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
          <hr />
          <div className="boards">
            {boardList.map((val, key) => {
              return (
                <div className="board box column is-9-desktop">
                  <div className="board-inside">
                    <img
                      className="board-img"
                      src="https://source.unsplash.com/random/175%C3%97175/?calm"
                      alt=""
                    />

                    <div className="board-column">
                      <div className="board-upper">
                        <h1 className="board-title">{val.title}</h1>
                        <button className="button is-info is-outlined">
                          View
                        </button>
                        <hr />
                        <div className="board-names">
                          <h3 className="board-name-for">For</h3>
                          <h3 className="board-name">
                            {val.firstName} {val.lastName}
                          </h3>
                        </div>
                      </div>
                      <div className="board-lower">
                        <div className="column sm-5 no-padding">
                          <h3 className="board-name-grey">
                            {val.createdByName ? `Creator` : null}
                          </h3>
                          <h3 className="h3-text">
                            {val.createdByName ? val.createdByName : null}
                          </h3>
                        </div>

                        <div className="column sm-5 no-padding">
                          <h3 className="board-name-grey">Created</h3>
                          <h3 className="h3-text">{formateDate(val.createdOn)}</h3>
                        </div>

                      </div>
                    </div>
                  </div>
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
