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
        <h6 className="text-center text-muted">© {new Date().getFullYear()} - Municipalidad de Posadas | Cálculo orientativo. Verifique la normativa vigente.</h6>
      </footer>
    </div>
  );
}
