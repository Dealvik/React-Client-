/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";

const Dashboard = props => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    refreshToken();
    getUsers();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      // @ts-ignore
      setName(decoded.name);
      // @ts-ignore
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        history.push("/");
        history.go(0);
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      // @ts-ignore
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        // @ts-ignore
        setName(decoded.name);
        // @ts-ignore
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    const response = await axiosJWT.get("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  };

  return (
    <div className="container mt-6">
      <div className="columns is-vcentered">
        <div className="column is-8">
          <h1>Welcome Back: {name}</h1>
        </div>
        <div className="column is-right">
          <button
            className="button is-primary is-pulled-right new-board-btn"
            onClick={(e) => {
              e.preventDefault();
              if (props.isActive) props.setActive(!props.isActive);
            }}
          >
            New Board
          </button>
        </div>
      </div>

      {/* <button onClick={getUsers} classNameName="button is-info">Get Users</button>
            <table classNameName="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}

                </tbody>
            </table> */}
    </div>
  );
};

export default Dashboard;
