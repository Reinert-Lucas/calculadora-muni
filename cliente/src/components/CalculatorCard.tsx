import Header from "./Header";
import Form from "./Form";

export default function CalculatorCard() {
  return (
    <>
      <div className="card mb-3">
        <div className="card-header p-0 items-center">
          <Header />
        </div>
        <div className="card-body">
          <h5 className="card-title">
            <p className="text-center">
              Valor de la UT correspondiente al año (2026): $1430,00
            </p>
          </h5>
          <Form />
        </div>
      </div>
    </>
  );
}
