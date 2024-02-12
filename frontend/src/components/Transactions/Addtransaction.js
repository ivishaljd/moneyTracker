import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../shadcn/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadcn/components/ui/card";
import { Textarea } from "../../shadcn/components/ui/textarea";
import { Input } from "../../shadcn/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/components/ui/select";
import { Label } from "../../shadcn/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../shadcn/components/ui/radio-group";

import { Switch } from "../../shadcn/components/ui/switch";

import { Button } from "../../shadcn/components/ui/button";
import { Separator } from "../../shadcn/components/ui/separator"
import { useForm } from "react-hook-form";

function Addtransaction() {
  const {
    setwallets,
    verify,
    transactions,
    settransactions,
    wallets,
    getCurrentDateTime,
    datetime,
    setdailyexpense,
    setloading,
  } = useContext(MyContext);

  const { register, handleSubmit, setValue,reset } = useForm();
  // const isMobile = useMediaQuery({ query: '(max-width: 775px)' })
  function handlewallet(event) {
    console.log(event.target.value);
    setValue("wallet", event.target.value);
  }

  function handelTransaction(event) {
    console.log(event);
    if (event) {
      setValue("transactionType", "expense");
    } else {
      setValue("transactionType", "income");
    }
  }

  const saved = async (formdata) => {
    if (formdata.description !== "" && formdata.amount !== 0) {
      const token = localStorage.getItem("token");
      const datetime = await getCurrentDateTime();
      // const transactiondate = datetime.date +'/'+ datetime.month;
      const bag = {
        amount: formdata.amount,
        wallet: formdata.wallet,
        type:
          formdata.transactionType == "on"
            ? "income"
            : formdata.transactionType,
        description: formdata.description,
        date: datetime,
      };
      setloading(true);
      let { data } = await axios.post(
        process.env.REACT_APP_Backend + "addtransaction",
        bag,
        { headers: { token: token } }
      );
      setloading(false);
      if (data.stat) {
        settransactions(data.transactions);
        setdailyexpense(data.dailyexpense);
        toast.success("Transaction added!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        document.getElementById('closetransaction')?.click();
        reset()
      } else {
        toast.error(data.message, {
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
      toast.error("fields can be empty", {
        position: "top-right",
        autoClose: 1000,
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
    <div className="dark text-white">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="border-white rounded-none">
            Add Transactions
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="dark text-white w-[90%] max-w-[425px]">
          <form onSubmit={handleSubmit(saved)}>
            <Card>
              <CardHeader>
                <CardTitle>Add Transactions</CardTitle>
                <CardDescription>Select Your Wallet</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <RadioGroup
                  className="grid grid-cols-3 gap-4 capitalize max-h-[70px] overflow-y-scroll shadow-xl"
                  onChange={handlewallet}
                >
                  {wallets?.map((ele, index) => (
                    <div>
                      <RadioGroupItem
                        {...register("wallet")}
                        value={index}
                        id={ele.name}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={ele.name}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        {ele.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex items-center space-x-2 justify-around">
                  <Label className=" font-bold text-base">Income</Label>
                  <Switch
                    className="data-[state=checked]:bg-[#e11d48] data-[state=unchecked]:bg-[#22c55e]"
                    id="airplane-mode"
                    onCheckedChange={handelTransaction}
                    {...register("transactionType")}
                  />
                  <Label className="font-bold text-base">Expenses</Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Amount</Label>
                  <Input
                    type="number"
                    id="name"
                    {...register("amount")}
                    placeholder="&#8377;"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number">Discription</Label>
                  <Textarea
                    placeholder="Transaction Discription"
                    {...register("description")}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-around">
                <Button className=" dark w-[40%]" type="Submit">
                  Submit
                </Button>
                <AlertDialogTrigger asChild>
                  <Button id="closetransaction" className="bg-primary w-[40%] " onClick={()=>reset()}>
                    Cancel
                  </Button>
                </AlertDialogTrigger>
              </CardFooter>
            </Card>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Addtransaction;
