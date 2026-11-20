import CalculatorCard from "../components/CalculatorCard";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Calculator() {
  return (
    <div className="main-container">
      <Header />
      <CalculatorCard />
      <Footer />
    </div>
  );
}
