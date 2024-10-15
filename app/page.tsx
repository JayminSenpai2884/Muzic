import Image from "next/image";
import Appbar from "./components/Appbar";
import LandingPage from "./components/LandingPage";
import Page from "./dashboard/page"

export default function Home() {
  return (
    <div>
      <Appbar></Appbar>
      <LandingPage></LandingPage>
    </div>
  );
}
