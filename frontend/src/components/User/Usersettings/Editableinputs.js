import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { MyContext } from "../../context/Context";
import "../../../assets/usersetting.css";
import { Input } from "../../../shadcn/components/ui/input";
import { Button } from "../../../shadcn/components/ui/button";
import { Check } from "lucide-react";
function Editableinputs({ text, field }) {
  const [type, settype] = useState("label");
  const [changes, setchanges] = useState("");
  const { verify, setloading } = useContext(MyContext);

  function handleChange(event) {
    setchanges(event.target.value);
  }

  useEffect(() => {
    setchanges(text);
  }, [text]);

  const saved = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setloading(true);
    let { data } = await axios.get(process.env.REACT_APP_Backend + "update", {
      headers: { token: token, field: field, updates: changes },
    });
    setloading(false);
    if (data.stat) {
      localStorage.removeItem(field);

      verify(token);
      settype("label");
    } else {
      toast.error(data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      verify(token, "/usersettings");
    }
  };

  return (
    <>
      {type === "label" ? (
        <label
          className=" "
          onClick={() => settype("f")}
        >
          {text}
        </label>
      ) : (
        <div className="flex p-0">
          <Input
            type="text"
            defaultValue={text}
            onChange={handleChange}
           className="w-[70%] h-6 pl-1"></Input>
          <button onClick={saved} className="w-[30%] bg-dark text-white">&#10003;</button>
        </div>
      )}
    </>
  );
}

export default Editableinputs;
