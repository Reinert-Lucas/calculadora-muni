import CalculadoraIcon from "../imgs/calculadora-icon.png";

export default function Header() {
  return (
    <div className="header-container">
      <img src={CalculadoraIcon} alt="Calculadora" />
      <h1>Calculadora de Derechos Municipales</h1>
    </div>
  );
}
