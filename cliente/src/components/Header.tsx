import { Calculator } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-[#58be69] text-white px-4 py-3 flex items-center gap-2">
      <Calculator size={20} />

      <h1 className="text-[32px] md:text-[18px] font-medium">
        Calculadora de Derechos Municipales
      </h1>
    </div>
  );
}
