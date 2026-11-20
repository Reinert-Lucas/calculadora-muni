import { PencilIcon } from "lucide-react";
import "../index.css";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <h6 className="text-center text-muted">
        © {new Date().getFullYear()} - Municipalidad de Posadas | Cálculo
        orientativo. Verifique la normativa vigente.
      </h6>
      <NavLink
        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        to="/login"
      >
        <PencilIcon size={18} />
        Administrar
      </NavLink>
    </footer>
  );
}
