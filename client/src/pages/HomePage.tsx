import About from "../components/layout/About";
import Callout from "../components/layout/Callout";
import Footer from "../components/layout/Footer";
import Hero from "../components/layout/Hero";
import Navbar from "../components/layout/Navbar";
import Pricing from "../components/layout/Pricing";
import { useEffect } from "react";
import { me } from "../services/userService";

const HomePage = () => {
  useEffect(() => {
    // fetch me
    const fetchMe = async () => {
      await me();
    };
    fetchMe();
  }, []);

  return (
    <div className="">
      <Navbar />
      <Hero />
      <About />
      <Pricing />
      <Callout />
      <Footer />
    </div>
  );
};

export default HomePage;
