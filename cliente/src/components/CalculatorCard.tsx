import Header from "./Header";
import Form from "./Form";
import Resultados from "./ResultadosDetalle";

export default function CalculatorCard() {
  return (
    <div className="mx-auto max-w-6xl rounded-md bg-[#f7f7f7] shadow-sm border border-gray-200 overflow-hidden">
      <Header />
      <div className="p-4">
        <p className="font-bold text-[28px] md:text-[18px] mb-8">
          Valor de la UT correspondiente al año (2026): 1430
        </p>
      </div>
      <Form />
      <Resultados />
    </div>
  );
}
