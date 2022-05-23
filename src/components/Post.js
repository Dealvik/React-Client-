const Post = (props) => {
  return (
    // {/* create a new post */}
    <div className={props.isActivePost ? "hero-body hide" : "hero-body post-panel"}>
    <div className="mask">

      <form onSubmit={null} className="box">
        <article className="message is-white">
          <div className="message-header" style={{ padding: "0" }}>
            <h2>Add a post</h2>
            <h2>Board id {props.boardId}</h2>
            <button
              className="delete"
              onClick={(e) => {
                e.preventDefault();
                console.log(props.isActivePost);
                props.togglePost();
              }}
            ></button>
          </div>
        </article>
        <p className="has-text-centered">{null}</p>
        <div className="field is-hotizontal mt-5">
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded left">
                <textarea
                  style={{ height: "250px" }}
                  className="input"
                  placeholder=""
                  onChange={(event) => {
                    props.setPostText(event.target.value);
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
                  <button
                    className="button is-fullwidth is-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      props.addPost();
                      props.togglePost();
                    }}
                  >
                    Post
                  </button>
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
