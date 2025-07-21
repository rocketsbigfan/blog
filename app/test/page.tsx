import Header from "./header";
import Test from "./test";
import { SWRProvider } from "../providers/swr-provider";
import SwrComponent from "./swr";

export default function TestPage() {
  return (
    <SWRProvider>
      <div className="p-20">
        <Header />
        <Test />
        <SwrComponent />
      </div>
    </SWRProvider>
  );
}