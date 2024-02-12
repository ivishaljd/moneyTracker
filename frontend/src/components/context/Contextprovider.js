import React, { useState } from "react";
import App from "../../App";
import { MyContext } from "./Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Contextprovider(props) {
  const [logedin, setlogedin] = useState(false);
  const [getemail, setemail] = useState("");
  const [loading, setloading] = useState(false);
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [monthCycle, setmonthCycle] = useState("");
  const [dailyBudget, setdailyBudget] = useState(0);
  const [wallets, setwallets] = useState([]);
  const [signup, setsignup] = useState(false);
  const [dailyexpense, setdailyexpense] = useState(0);
  const [transactions, settransactions] = useState([]);
  const nav = useNavigate();

  const setdatas = (data) => {
    setemail(data.email);
    setfirstName(data.firstName);
    setlastName(data.lastName);
    setmonthCycle(data.monthCycle.substring(0, 2));
    setwallets(data.Wallets);
    settransactions(data.transactions);
    setdailyBudget(data.budgetOfTheDay);
    setdailyexpense(data.dailyexpense);
  };

  function getCurrentDateTime() {
    const currentDate = new Date();
    const date = currentDate.getDate();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding padding to month.
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    return {
      date: date,
      month: month,
      year: year,
      time: `${hours}:${minutes}:${seconds}`,
    };
  }

  function parseDate(dateStr) {
    const parts = dateStr.split("/");
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }

  function getDateDifference(startDateStr, endDateStr) {
    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);

    const timeDiff = endDate.getTime() - startDate.getTime();

    // Check if the end date is earlier than the start date
    if (timeDiff < 0) {
      return -1;
    }

    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  }

  const verify = async (token, place) => {
    let { data } = await axios.get(process.env.REACT_APP_Backend + "verify", {
      headers: { token: token },
    });

    if (data.stat) {
      setdatas(data.user);
      setlogedin(true);
      return true;
      // nav(place);
    } else {
      localStorage.removeItem("token");
      setlogedin(false);
      nav("/login");
      setemail("");
    }
  };

  return (
    <MyContext.Provider
      value={{
        loading,
        setloading,
        logedin,
        setlogedin,
        getemail,
        setemail,
        signup,
        setsignup,
        verify,
        firstName,
        lastName,
        monthCycle,
        wallets,
        setwallets,
        transactions,
        settransactions,
        getCurrentDateTime,
        getDateDifference,
        dailyBudget,
        dailyexpense,
        setdailyexpense,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
}

export default Contextprovider;
