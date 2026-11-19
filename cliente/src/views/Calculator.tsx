import CalculatorCard from "../components/CalculatorCard";
import Footer from "../components/Footer";
import GopIcon from "../imgs/gop-icon.png";

export default function Calculator() {
  return (
    <div className="main-container">
      <section className="titulo">
        <h1>
          <img src={GopIcon} alt="Gop Icono" className="logo-gop" />
          Cálculos de Derechos Municipales
        </h1>
        <h6>Municipalidad de Posadas</h6>
      </section>
      <CalculatorCard />
      <Footer />
    </div>
  );
}
