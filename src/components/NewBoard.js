const NewBoard = (isActive, toggleClass) => {
  return (
    <button
      className="button is-primary is-pulled-right new-board-btn"
      onClick={(e) => {
        e.preventDefault();
        if (isActive) toggleClass();
      }}
    >
      New Board
    </button>
  );
};

export default NewBoard;
