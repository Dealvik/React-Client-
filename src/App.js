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
import { FaTimesCircle } from 'react-icons/fa';

var editId;

function App() {
  // @ts-ignore
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");

  const [isActive, setActive] = useState(true);
  const [isActivePost, setIsActivePost] = useState(true);

  const [postId, setPostId] = useState("");

  const [postText, setPostText] = useState("");
  const [boardList, setboardList] = useState([]);
  const [postList, setPostList] = useState([]);
  const [imageList, setImageList] = useState([{}]);

  const [boardId, setBoardId] = useState(0);

  // @ts-ignore
  const [sorted, setSorted] = useState(false);
  const [boardIdParam, setBoardIdParam] = useState("");

  const [viewportWidth, setViewportWidth] = useState(getWindowDimensions());
  const [postDropdownActive, setPostDropdownActive] = useState(false);

  // const [editPostId, setEditPostId] = useState(0);
  // @ts-ignore
  const [newlyUpdatedText, setNewlyUpdatedText] = useState("");

  // @ts-ignore
  const [postAreaText, setPostAreaText] = useState("");

  //images
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  // @ts-ignore
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

  // @ts-ignore
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
    Axios.get(`http://localhost:5000/boards/${id}?v=2`).then((response) => {
      setPostList(response.data);
    });
  };

  const cancelEdit = () => {
    editId = 0;
    // setEditPostId(0);
    setPostAreaText("");
  };

  const editPost = (id, text) => {
    editId = id;
    // alert(editId);
    setPostAreaText(text);
  };

  function addMedia(postId) {
    setPostId(postId);
  }

  const commitPost = (id, newText) => {
    Axios.put(`http://localhost:5000/edit`, { text: newText, id: id })
      .then(() => {
        setPostList(
          // @ts-ignore
          postList.map((val) => {
            // @ts-ignore
            return val.id === id
              ? {
                  // @ts-ignore
                  id: val.id,
                  text: newText,
                }
              : val;
          })
        );
      })
      .finally(() => {
        cancelEdit();
      });
  };

  const onChangeFile = (e) => {
      setFile(e.target.files[0]);
      // setFilename(e.target.files[0].name);
      setFilename(e.target.files[0].name);
      // props.setFile(e.target.files[0]);
      // props.setFilename(e.target.files[0].name);
      // props.setFilename(e.target.files[0].name);
  };

  // @ts-ignore
  const deleteBoard = (id) => {
    // @ts-ignore
    Axios.delete(`http://localhost:5000/delete/${id}`).then((response) => {
      setboardList(
        boardList.filter((val) => {
          // @ts-ignore
          return val.id !== id;
        })
      );
    });
  };

  function removePostWithId(arr, id) {
    return arr.filter((obj) => obj.id !== id);
  }

  function removeImageWithId(arr, imageId) {
    var newArray = [];
    arr.forEach((element) => {
      // add an altered type
      let id = element.id;
      let text = element.text;
      let createdOn = element.createdOn;
      let createdBy = element.createdBy;
      let name = element.name;
      let images = element.images.filter(
        (image) => image.imageId !== imageId
      );

      let newElement = { id, text, createdOn, createdBy, name, images };
      console.log(newElement);
      newArray.push(newElement);
    });
    return newArray;
  }

  const deletePost = (id) => {
    // @ts-ignore
    Axios.delete(`http://localhost:5000/deletePost/${id}`).then(() => {
     var updatedList = removePostWithId(postList, id);
      setPostList(updatedList);
    });
  };

  const deleteImage = (imageId) => {
    Axios.delete(`http://localhost:5000/deleteImage/${imageId}`).then(() => {
      var updatedList = removeImageWithId(postList, imageId);
      updatedList.forEach((element) => {
        console.log(element);
      });
      setPostList(updatedList);
    });
  }

  async function onSubmit(e) {
    e.preventDefault();    
    const formData = new FormData();
    formData.append('file', file);
    // formData.append('postText', postText);
    // @ts-ignore
    formData.append('postId', postId); 

    try {
      const res = await Axios.post('http://localhost:5000/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // @ts-ignore
        onUploadProgress: progressEvent => {
          var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
          console.log(percentCompleted);

          if (percentCompleted >= 100) {
            setPostId("");
            getPosts(boardIdParam);
          } 
          // setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
          // setTimeout(() => setUploadPercentage(0), 10000);
        }
      })

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      // setMessage('File uploaded');

    } catch(err) {
      if(err.response.status === 500) {
        // setMessage('There was a problem with the server');
      } else {
        // setMessage(err.response.data.msg);
      }
    }
  }

  const formateDate = (date) => {
    return date.split("T")[0];
  };

  const getBoardIdParam = () => {
    const myArray = window.location.href.split("/");
    setBoardIdParam(myArray[4]);

    return (
      <div>
         <div className="banner">
            <div className="banner-content">
              {boardList.map((val, 
// @ts-ignore
              key) => {
                return (
                  <div className="board-inside">
                    <div className="board-column">
                      <div className="board-upper">
                        {(window.location.href === ("http://localhost:3000/boards/" + val
// @ts-ignore
                        .boardId)) ? (
                        <h1 className="board-title">{val
// @ts-ignore
                        .title}</h1>) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* add media option */}
          {(postId !== "" ? <div className="mask">
          <form onSubmit={onSubmit} className="box">
          <article className="message is-white">
          <div className="message-header" style={{ padding: "0" }}>
          <h2>Add media for post {}</h2>
          {/* delete button */}
          <button
            className="delete"
            onClick={(e) => {
              e.preventDefault();
              // console.log(props.isActivePost);
              setPostId("");
            }}
          ></button>
          </div>
            <div className="custom-file mb-4">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={onChangeFile}
                // multiple
              />
              <label className='custom-file-label' htmlFor='customFile'>
                {filename}
              </label>
            </div>
          </article>

          <p className="has-text-centered">{null}</p>
          <div className="field is-hotizontal mt-5">

          {/* Upload button */}
          <div className="field mt-4">
            <div className="field-body">
              <div className="field">
                <div className="control is-expanded">
                  <input
                    type="submit"
                    value="Upload"
                    className="button is-fullwidth is-primary"
                    // @ts-ignore
                    onClick={(e) => {
                      // e.preventDefault();
                      // todo start spining
                      // text uploading
                    }}
                  >
                  </input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      </div> : null)}
          
        
        {/* <button
            className="button is-info is-rounded"
            onClick={() => {
              if (isActivePost) setIsActivePost(false);
              // setBoardId(val.id);
            }}
          >
            Add to boardsdsd
          </button> */}
        
        <div className="hero-body hello">
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
                        <form onSubmit={null} className="postBox">
                          <article className="message is-white">
                            <div
                              className="message-header"
                              style={{ padding: "0", wordBreak: "break-all", display: "flex", flexDirection: "column", }}
                            >
                              {
                                item.images.map(image => 
                                  <div>
                                  {image.imageId !== null ? 
                                    <div style={{marginBottom: "-25px"}}>
                                      <div className="xButton">
                                        <button 
                                          style={{
                                            position: "absolute",
                                            all: "unset",
                                            cursor: "pointer",
                                            float: "right"
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            deleteImage(image.imageId);
                                          }}
                                        >
                                        <FaTimesCircle />
                                        </button>
                                      </div>
                                        
                                        <img className="postImage" src={"http://localhost:5000/images/"+image.imageId+"."+image.imageType} alt="test" /> 
                                      </div>
                                    :null}
                                  </div>
                                )
                              }
                              {/* {item.imageId !== (null || undefined) ? 
                              // @ts-ignore
                              <img style={{marginBottom: "20px"}} src={"http://localhost:5000/images/"+item.imageId+"."+item.imageType} alt="test" width="300" height="300" /> 
                              : null} */}
                              <div
                                className={
                                  // @ts-ignore
                                  item.id === editId
                                    ? "hidden"
                                    : "post-message-visible"
                                }
                              >
                                {item.text}
                              </div>
                              <textarea
                                // @ts-ignore
                                id={"text" + item.id}
                                autoFocus={true}
                                rows={10}
                                // @ts-ignore
                                defaultValue={item.text}
                                className={
                                  // @ts-ignore
                                  item.id === editId
                                    ? "post-text-editable-visible"
                                    : "hidden"
                                }
                                onBlur={cancelEdit}
                              ></textarea>
                            </div>

                            <div
                              // @ts-ignore
                              id={item.id}
                              className={
                                // @ts-ignore
                                item.id === editId
                                  ? "post-edit"
                                  : "post-edit hidden"
                              }
                            >
                              <button
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  // @ts-ignore
                                  let textId = "text" + item.id;
                                  let newText = document.getElementById(textId);
                                  // @ts-ignore
                                  commitPost(item.id, newText.value);
                                }}
                              >
                                ✓
                              </button>
                              <button onClick={() => cancelEdit()}>X</button>
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
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                      className="dropdown-item"
                                      onClick={() =>
                                        // @ts-ignore
                                        editPost(item.id, item.text)
                                      }
                                    >
                                      Edit message
                                    </a>
                                  </li>
                                  <li>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                      className="dropdown-item"
                                      onClick={() => {
                                        // @ts-ignore
                                        addMedia(item.id)
                                      }}
                                    >
                                      Add media
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      // @ts-ignore
                                      onClick={() => deletePost(item.id)}
                                    >
                                      Delete
                                    </a>
                                  </li>
                                </div>
                              </UnopDropdown>

                              <h1 style={{ marginLeft: "auto" }}>
                                From {item
// @ts-ignore
                                .name}
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
    <div style={{ 
      backgroundImage: `url("https://source.unsplash.com/random/1920x1080/?pattern,calm,hq")`,
      backgroundSize: `cover`,
      backgroundRepeat: `no-repeat`
    }}>
     
      <div className="app-container">
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
                <form 
// @ts-ignore
                onSubmit={null} className="box">
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
              {boardList.map((val, 
// @ts-ignore
              key) => {
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
                          <h1 className="board-title">{val
// @ts-ignore
                          .title}</h1>
                          <a href={`http://localhost:3000/boards/${val
// @ts-ignore
                          .id}`}>
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
                              {val
// @ts-ignore
                              .firstName} {val.lastName}
                            </h3>
                            {/* <h1>{val.name}</h1> */}
                          </div>
                        </div>
                        <div className="board-lower">
                          <div className="column sm-5 no-padding">
                            <h3 className="board-name-grey">
                              {val
// @ts-ignore
                              .createdByName ? `Creator` : null}
                            </h3>
                            <h3 className="h3-text">
                              {val
// @ts-ignore
                              .createdByName ? val.createdByName : null}
                            </h3>
                          </div>

                          <div className="column sm-5 no-padding">
                            <h3 className="board-name-grey">Created</h3>
                            <h3 className="h3-text">
                              {formateDate(val
// @ts-ignore
                              .createdOn)}
                            </h3>
                          </div>

                          <div className="column sm-5 no-padding">
                            <h3 className="board-name-grey">Posts</h3>
                            <h3 className="h3-text">
                              {val
// @ts-ignore
                              .postCount <= 0 ? "0" : val.postCount}
                            </h3>
                            <h3 className="board-name-grey">Board id</h3>
                            <h3 className="h3-text">{val
// @ts-ignore
                            .id}</h3>
                          </div>
                          <button
                            className="button is-info is-rounded"
                            onClick={() => {
                              if (isActivePost) setIsActivePost(false);
                              // @ts-ignore
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
    </div>
  );
}

export default App;