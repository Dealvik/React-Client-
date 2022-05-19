import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Navbar = (props) => {
  const history = useHistory();

  const Logout = async () => {
    try {
      await axios.delete("http://localhost:5000/logout");
      history.push("/");
      history.go(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav
      className="navbar has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          {/* <a className="navbar-item" href="/">
            <img
              src="https://cdn.discordapp.com/attachments/542014173719035904/917807875940827156/poker_dude.png"
              width="28"
              height="28"
              alt="logo"
            />
          </a> */}

          <a
            href="/"
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a href="/dashboard" className="navbar-item">
              Home
            </a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {window.location.href ===
                "http://localhost:3000/dashboard" ? null : (
                  <button
                    onClick={() => {
                      if (
                        window.location.href ===
                        "http://localhost:3000/register"
                      ) {
                        history.push("/login");
                      } else if (
                        window.location.href === "http://localhost:3000/"
                      ) {
                        history.push("/register");
                      } else if (
                        window.location.href === "http://localhost:3000/login"
                      ) {
                        history.push("/register");
                      }
                    }}
                    className="button is-light"
                  >
                    {window.location.href === "http://localhost:3000/register"
                      ? "Log in"
                      : null}
                    {window.location.href === "http://localhost:3000/"
                      ? "Register"
                      : null}
                    {window.location.href === "http://localhost:3000/login"
                      ? "Register"
                      : null}
                  </button>
                )}
              </div>
            </div>
            <div className="navbar-item">
              <div className="buttons">
                {props.signedIn === true ? (
                  <button onClick={Logout} className="button is-light">
                    Log Out
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
