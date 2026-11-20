import GopIcon from "../imgs/gop-icon.png";

export default function Header() {
  return (
    <section className="titulo">
      <h1>
        <img src={GopIcon} alt="Gop Icono" className="logo-gop" />
        Cálculos de Derechos Municipales
      </h1>
      <h6>Municipalidad de Posadas</h6>
    </section>
  );
}
