import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../../components/admin/Navigation/Navigation"

const MyAccount = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("currentUser");
    axios
      .get(`https://kinderlink.onrender.com/api/v1/auth/${userId}`, { headers: {
        'Accept': 'application/json'
      }})
      .then((response) => {
        // Check if response data is valid JSON
        try {
          const data = JSON.parse(response.data);
          setUserData(data);
          console.log(userId)
          console.log(data)
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
    <Navigation/>
    <div>
      {userData ? (
        <div>
          <p>School ID: {userData.schoolId}</p>
          <p>User Type: {userData.userType}</p>
          <p>First Name: {userData.firstName}</p>
          <p>Middle Name: {userData.middleName}</p>
          <p>Last Name: {userData.lastName}</p>
          <p>Sex: {userData.sex}</p>
          <p>Email: {userData.email}</p>
          <p>Phone: {userData.phone}</p>
          <p>Password: {userData.password}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </>
  );
};

export default MyAccount;
