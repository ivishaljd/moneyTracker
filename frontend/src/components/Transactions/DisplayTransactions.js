import React, { useContext } from "react";
import { MyContext } from "../context/Context";
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "../../shadcn/components/ui/table";
import { Skeleton } from "../../shadcn/components/ui/skeleton"

function DisplayTransactions() {
  const { transactions: transactions, wallets } = useContext(MyContext);

  return (
    <div className=" overflow-y-scroll max-h-[44vh] max-w-6xl w-[80%] border no-scrollbar rounded-md">
      <table className="relative w-full">
        <TableHeader className="sticky top-0">
          <tr className="text-white text-center text-lg font-bold bg-primary border-b">
            <TableCell>Date</TableCell>
            {/* <TableCell>Description</TableCell> */}
            <TableCell>Wallet</TableCell>
            <TableCell>Amount</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {transactions.length == 0 ?
            <TableRow>
              <TableCell><Skeleton className="h-4 w-[100%] ps-90" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100%] ps-90" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100%] ps-90" /></TableCell>
            </TableRow>
            :
            <>
              {transactions.map((ele, index) => (
                <TableRow key={index} className="text-center text-white">
                  <TableCell>{ele.date.date + "/" + ele.date.month}</TableCell>
                  {/* <TableCell>{ele.description}</TableCell> */}
                  <TableCell>{wallets[ele.wallet].name}</TableCell>
                  <TableCell className={ele.type}>&#8377;&nbsp;{ele.amount}</TableCell>
                </TableRow>
              ))}</>}
        </TableBody>
        {/* <TableCaption>A list of your recent Transactions.</TableCaption> */}
      </table>
    </div>
  );
}

export default DisplayTransactions;
