import CalculatorCard from "./components/CalculatorCard";
import GopIcon from "./imgs/gop-icon.png";
import "./index.css";

export default function App() {
  return (
    <div className="main-container">
      <section className="titulo">
        <h1><img src={GopIcon} alt="Gop Icono" className="logo-gop" />Cálculos de Derechos Municipales</h1>
        <h6>Municipalidad de Posadas</h6>
      </section>
      <CalculatorCard />
      <footer>
        © {new Date().getFullYear()} - Municipalidad de Posadas | Cálculo orientativo. Verifique la normativa vigente.
      </footer>
    </div>
  );
}
