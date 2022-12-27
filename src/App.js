import Axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Post from "./components/Post";
import Masonry from "react-masonry-css";
import UnopDropdown from "unop-react-dropdown";
import React from "react";

function App() {
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");

  const [isActive, setActive] = useState(true);
  const [isActivePost, setIsActivePost] = useState(true);

  const [postText, setPostText] = useState("");
  const [boardList, setboardList] = useState([]);
  const [postList, setPostList] = useState([]);

  const [boardId, setBoardId] = useState(0);

  const [sorted, setSorted] = useState(false);
  const [boardIdParam, setBoardIdParam] = useState("");

  const [viewportWidth, setViewportWidth] = useState(getWindowDimensions());
  const [postDropdownActive, setPostDropdownActive] = useState(false);

  const [editPostId, setEditPostId] = useState(0);
  const [newlyUpdatedText, setNewlyUpdatedText] = useState("");

  const [postAreaText, setPostAreaText] = useState("");

  //images
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});

  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return {
      width,
    };
  }

  function toggleClass() {
    setActive(!isActive);
  }

  function togglePost() {
    setIsActivePost(!isActivePost);
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

  const addPost = () => {
    if (postText === "") {
      alert("Post text required");
      return 0;
    }
    if (boardId === null) {
      alert("board id not found");
      return 0;
    }

    Axios.post("http://localhost:5000/createPost", {
      postText: postText,
      boardId: boardId,
      file: file
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
      // console.log(response);
      setboardList(response.data);
    });
  };

  const getPosts = (id) => {
    Axios.get(`http://localhost:5000/boards/${id}`).then((response) => {
      // console.log(response.data);
      setPostList(response.data);
      // setPostList(
      //   response.data.map((val) => {
      //     console.log(val);
      //     return val.id === id
      //       ? {
      //         id: val.id,
      //         text: val.text,
      //         createdBy: val.createdBy,
      //         boardId: val.boardId,
      //         createdOn: val.createdOn,
      //         }
      //       : val;
      //   })
      // );
    });
  };

  const cancelEdit = () => {
    setEditPostId(0);
    setPostAreaText("");
  };

  const editPost = (id, text) => {
    setEditPostId(id);
    setPostAreaText(text);
  };

  const commitPost = (id, newText) => {
    Axios.put(`http://localhost:5000/edit`, { text: newText, id: id })
      .then(() => {
        setPostList(
          postList.map((val) => {
            return val.id === id
              ? {
                  id: val.id,
                  text: newText,
                }
              : val;
          })
        );
      })
      .finally(() => {
        // cancelEdit();
        window.location.reload();
      });
  };

  const deleteBoard = (id) => {
    Axios.delete(`http://localhost:5000/delete/${id}`).then((response) => {
      setboardList(
        boardList.filter((val) => {
          return val.id !== id;
        })
      );
    });
  };

  const deletePost = (id) => {
    Axios.delete(`http://localhost:5000/deletePost/${id}`).then((response) => {
      setPostList(
        postList.filter((val) => {
          return val.id !== id;
        })
      );
    });
  };

  const formateDate = (date) => {
    return date.split("T")[0];
  };

  const getBoardIdParam = () => {
    const myArray = window.location.href.split("/");
    setBoardIdParam(myArray[4]);

  const handlePostChange = (postId, newText) => {
    // let textId = "text" + postId.id;
    // let newText = document.getElementById(textId);
    // console.log("id is " + postId + ", new text is " + newText);
    commitPost(postId, newText);
  }

  const toggleCss = (id) => {
    $('#text' + id).toggleClass("activePost");
    if ($('#text' + id).attr('contenteditable', 'false')) {
      $('#text' + id).attr('contenteditable', 'true');
    } else {
      $('#text' + id).attr('contenteditable', 'false');
    }

    // make the icons appear
    $('#text' + id + "icons").toggleClass("hidden");
  }

    return (
      <div>
        {/* <div className="banner">
          <div className="banner-content">
            Board title here
          </div>
        </div> */}

        {/* <button
            className="button is-info is-rounded"
            onClick={() => {
              if (isActivePost) setIsActivePost(false);
              // setBoardId(val.id);
            }}
          >
            Add to boardsdsd
          </button> */}

        <div className="hero-body">
          <div className="wrap">
            <Masonry
              breakpointCols={viewportWidth.width < 1000 ? 1 : 3}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {postList.map(function (item, i) {
                return (
                  <div className="container">
                    <div className="columns is-centered">
                      <div className="column no-flex">
                        <form onSubmit={null} className="box">
                          <article className="message is-white">
                            <div
                              className="message-header"
                              style={{ padding: "0", wordBreak: "break-all" }}
                            >

                            <div style={{
                              display: "flex",
                              boxShadow: "none",
                              flexDirection: "column", 
                              justifyContent: "center"
                            }}>

                              {/* image display */}
                              {item.imageId !== null ? 
                              <img src={"http://localhost:5000/images/"+item.imageId+"."+item.imageType} alt="test" /> : null}
                              
                              {/* the main div that displays the post text */}
                              <div
                                role={"textbox"}
                                id={"text" + item.id}
                                onClick={e => {
                                  toggleCss(item.id);
                                }}
                                onBlur={e => {
                                  // toggleCss(item.id);
                                }}
                                tabIndex={1}
                                contentEditable={true}
                                onInput={(e) => { 
                                  // handlePostChange(item.id, e.currentTarget.textContent);
                                  console.log(e.currentTarget.textContent);
                                }}
                                suppressContentEditableWarning={true}
                                style={{marginTop: "25px", padding: "15px", paddingLeft: "10px"}}
                                // className={
                                //   item.id === editPostId
                                //     ? "hidden"
                                //     : "post-message-visible"
                                // }
                              >
                                {item.text}
                              </div>
                              </div>
                              
                              <textarea
                                id={"text" + item.id}
                                autoFocus={true}
                                rows={10}
                                defaultValue={item.text}
                                className={
                                  item.id === editPostId
                                    ? "post-text-editable-visiblse"
                                    : "hidden"
                                }
                                onBlur={cancelEdit}
                              ></textarea>
                              </div>
                            
                            {/* these are the buttons (checkmark and X) */}
                            <div
                              id={"text" + item.id + "icons"}
                              className={
                                "hidden"
                                // item.id === editPostId
                                //   ? "post-edit"
                                //   : "post-edit hidden"
                              }
                              style={{
                                float: "right"
                              }}
                            >
                              <button
                                onMouseDown={(e) => {
                                  console.log(item.id, e.currentTarget.textContent);
                                  handlePostChange(item.id, e.currentTarget.textContent);
                                  
                                  commitPost(item.id, e.currentTarget.textContent);
                                  toggleCss(item.id);
                                  // let textId = "text" + item.id;
                                  // let newText = document.getElementById(textId);
                                  // commitPost(item.id, newText.value);
                                }}
                              >
                                <FaCheck />
                              </button>
                              <button onClick={() => cancelEdit()}><FaTimes /></button>
                            </div>

                            <div className="post-lower">
                              <UnopDropdown
                                trigger={
                                  <button
                                    onClick={() => {
                                      setPostDropdownActive(
                                        !postDropdownActive
                                      );
                                    }}
                                    style={{
                                      boxShadow: "none",
                                      backgroundColor: "transparent",
                                      backgroundImage: "none",
                                      borderColor: "transparent",
                                      cursor: "pointer",
                                      color: "#636363",
                                    }}
                                  >
                                    <h1 style={{ fontSize: "28px" }}>...</h1>
                                  </button>
                                }
                              >
                                <div className="dropdown">
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      onClick={() =>
                                        editPost(item.id, item.text)
                                      }
                                    >
                                      <i>Edit Message</i>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      onClick={() => deletePost(item.id)}
                                    >
                                      <i>Delete</i>
                                    </a>
                                  </li>
                                </div>
                              </UnopDropdown>

                              <h1 style={{ marginLeft: "auto" }}>
                                From {item.name}
                              </h1>
                            </div>
                          </article>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Masonry>
          </div>
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(getWindowDimensions());
    };
    window.addEventListener("resize", handleResize);

    if (boardIdParam !== "") {
      getPosts(boardIdParam);
    } else {
      getBoards();
    }
  }, [boardId, boardIdParam]);

  return (
    <div className="app-container" style={{background: "#fbfbfb"}}>
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
          <Route path="/boards/" component={getBoardIdParam}></Route>
        </Switch>
      </BrowserRouter>

      <Post
        // boardId={val.id}
        isActivePost={isActivePost}
        togglePost={togglePost}
        getBoards={getBoards}
        setPostText={setPostText}
        setFile={setFile}
        setFilename={setFilename}
        addPost={addPost}
        boardId={boardId}
      />
      
      <div className={isActive ? "hero-body hide" : "hero-body"}>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-desktop">
              <form onSubmit={null} className="box">
                <article className="newlyUpdatedText is-white">
                  <div
                    className="newlyUpdatedText-header"
                    style={{ padding: "0" }}
                  >
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
                <div
                  className="board box column is-9-desktop"
                  style={{ width: "100%" }}
                >
                  <div className="board-inside">
                    <img
                      className="board-img"
                      src="https://source.unsplash.com/random/175%C3%97175/?calm"
                      alt=""
                    />

                    <div className="board-column">
                      <div className="board-upper">
                        <h1 className="board-title">{val.title}</h1>
                        <a href={`http://localhost:3000/boards/${val.id}`}>
                          <button
                            className="button is-info is-outlined"
                            // onClick={() => {
                            //   getPosts(val.id);
                            //   // history.push(`/boards/${val.id}`);
                            // }}
                          >
                            View
                          </button>
                        </a>
                        <hr />
                        <div className="board-names">
                          <h3 className="board-name-for">For</h3>
                          <h3 className="board-name">
                            {val.firstName} {val.lastName}
                          </h3>
                          {/* <h1>{val.name}</h1> */}
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
                          <h3 className="h3-text">
                            {formateDate(val.createdOn)}
                          </h3>
                        </div>

                        <div className="column sm-5 no-padding">
                          <h3 className="board-name-grey">Posts</h3>
                          <h3 className="h3-text">
                            {val.postCount <= 0 ? "0" : val.postCount}
                          </h3>
                          <h3 className="board-name-grey">Board id</h3>
                          <h3 className="h3-text">{val.id}</h3>
                        </div>
                        <button
                          className="button is-info is-rounded"
                          onClick={() => {
                            // alert(val.id);
                            if (isActivePost) setIsActivePost(false);
                            setBoardId(val.id);
                          }}
                        >
                          Add to board
                        </button>
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
