import axios from "axios";
import React, { useState } from "react";

const Post = (props) => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [postText, setPostText] = useState("");
  // const [boardId, setBoardId] = useState("");


  const onChange = e => {
    setFile(e.target.files[0]);
    // setFilename(e.target.files[0].name);
    setFilename(e.target.files[0].name);
    props.setFile(e.target.files[0]);
    // props.setFilename(e.target.files[0].name);
    props.setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('postText', postText);
    formData.append('boardId', props.boardId);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setMessage('File uploaded');

    } catch(err) {
      if(err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  }

  return (
    // {/* create a new post */}
    <div
      className={props.isActivePost ? "hero-body hide" : "hero-body post-panel"}
    >
      <div className="mask">
        <form onSubmit={onSubmit} className="box">
          <article className="message is-white">
            <div className="message-header" style={{ padding: "0" }}>
              <h2>Add a post</h2>
              {/* delete button */}
              <button
                className="delete"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(props.isActivePost);
                  props.togglePost();
                }}
              ></button>
            </div>
            
            <div className="custom-file mb-4">

              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={onChange}
                multiple
              />
              <label className='custom-file-label' htmlFor='customFile'>
                {filename}
              </label>
            </div>

            {/* <input
              type="submit"
              value="Upload"
              className="btn btn-primary btn-block mt-4"
            /> */}

            {/* <button
              className="button is-primary"
              onClick={(e) => {
                e.preventDefault();
                props.addPost();
                props.togglePost();
              }}
              >
                Add Image
            </button> */}
          </article>

          
          <p className="has-text-centered">{null}</p>
          <div className="field is-hotizontal mt-5">
            <div className="field-body">
              <div className="field">
                <p className="control is-expanded left">
                  <textarea
                    style={{ height: "250px", width: "400px" }}
                    className="input"
                    placeholder=""
                    onChange={(event) => {
                      props.setPostText(event.target.value);
                      setPostText(event.target.value);
                    }}
                    required
                  />
                </p>
              </div>
            </div>

            {/* Post button */}
            <div className="field mt-4">
              <div className="field-body">
                <div className="field">
                  <div className="control is-expanded">
                    <input
                      type="submit"
                      value="Post"
                      className="button is-fullwidth is-primary"
                      onClick={(e) => {
                        // e.preventDefault();
                        // setBoardId("81");
                        // props.addPost();
                        props.togglePost();
                        // props.getBoards();
                      }}
                    >
                    </input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
