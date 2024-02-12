import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../../../shadcn/components/ui/alert-dialog";
import { Button } from "../../../shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../shadcn/components/ui/card";
import { Label } from "../../../shadcn/components/ui/label";
import { Input } from "../../../shadcn/components/ui/input";
import { useNavigate } from "react-router-dom";

function AddWallet() {
  const { setwallets, verify, setloading, wallets, setlogedin } =
    useContext(MyContext);

  const { register, handleSubmit, setValue, reset } = useForm();
  const nav = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verify(token);
    } else {
      setlogedin(false);
      nav("/login");
    }
  }, []);

  const saved = async (formdata) => {
    let name = formdata.name;
    let amount = formdata.amount;
    const token = localStorage.getItem("token");
    if (name != "" && name != null && amount >= 1) {
      setloading(true);
      let { data } = await axios.get(
        process.env.REACT_APP_Backend + "addwallet",
        { headers: { token: token, walletname: name, amount: amount } }
      );
      setloading(false);

      if (data.stat) {
        setwallets(data.wallets);
        toast.success("Wallet added!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        reset();
        document.getElementById("closetransaction")?.click();
      } else {
        toast.error("Something Went wrong!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      toast.error("Invalid Values!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  return (
    <>
      <div className="form-container wallet text-white dark  overflow-y-scroll max-h-[70vh] no-scrollbar pt-0">
        <AlertDialog>
        <div className="flex justify-around border-b-2 sticky top-0 bg-[#18181b] pt-3">
          <h2 className="inline-block">Wallets</h2>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-white rounded-none">
              Add Wallet
            </Button>
          </AlertDialogTrigger>
          </div>
          <AlertDialogContent className="dark text-white w-[90%] max-w-[425px]">
            <form onSubmit={handleSubmit(saved)}>
              <Card>
                <CardHeader>
                  <CardTitle>Add New Wallet</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="number">Name</Label>
                    <Input id="name" {...register("name")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Initial Amount</Label>
                    <Input
                      type="number"
                      id="amount"
                      {...register("amount")}
                      placeholder="&#8377;"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-around">
                  <Button className=" dark w-[40%]" type="Submit">
                    Submit
                  </Button>
                  <AlertDialogTrigger asChild>
                    <Button
                      id="closetransaction"
                      className="bg-primary w-[40%] "
                      onClick={() => reset()}
                    >
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                </CardFooter>
              </Card>
            </form>
          </AlertDialogContent>
        </AlertDialog>
        {wallets.map((ele, index) => {
          return (
            // <ul>
            //   <li key={index}>{ele.name}</li>
            //   <li>&#8377; {ele.amount}</li>
            // </ul>
            <Card className="flex items-center justify-around m-3 bg-dark border-0">
            <CardHeader className="">
              <CardTitle className="font-bold capitalize">
              {ele.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className=" font-bold">
               &#8377;&nbsp;{ele.amount.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </>
  );
}

export default AddWallet;
// {Active ? (
//   <div className="textfieldcontainer">
//     <div className="walletbox">
//       <input
//         type="text"
//         onChange={handlename}
//         placeholder="enter wallet name"
//       />

//       <input
//         type="text"
//         inputmode="numeric"
//         onChange={handleamount}
//         placeholder="enter initial amount"
//       />
//     </div>
//     <div className="buttoncontainer">
//       <button
//         className="addWalletButton"
//         onClick={() => {
//           saved();
//         }}
//       >
//         Save
//       </button>
//       <button
//         className="addWalletButton"
//         onClick={() => setactive(false)}
//       >
//         Cancel
//       </button>
//     </div>
//   </div>
// ) : (
//   <button onClick={() => setactive(true)} className="addWalletButton">
//     Add wallets
//   </button>
// )}
// {wallets.map((ele, index) => {
//   return (
//     <ul>
//       <li key={index}>{ele.name}</li>
//       <li>&#8377; {ele.amount}</li>
//     </ul>
//   );
// })}
