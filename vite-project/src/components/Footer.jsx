import { useEffect, useState } from "react";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (!open || sdkReady) return;
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AabdnAA0ns4WsO7eAYzHwaCjK9eOcMRP_llQqjH22F7-bXWsD4mLHAA1ubAmMq_zYmsIycH2PFxcH9D5&currency=USD&locale=es_ES";
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
  }, [open, sdkReady]);

  useEffect(() => {
    if (!open || !sdkReady || !window.paypal) return;
    try {
      window.paypal.Buttons({
        createOrder: (_, actions) =>
          actions.order.create({
            purchase_units: [
              {
                amount: { value: "5.00" },
              },
            ],
          }),
        onApprove: (_, actions) =>
          actions.order.capture().then((details) => {
            alert(`¡Pago completado por ${details.payer.name.given_name}!`);
            setOpen(false);
          }),
      }).render("#paypal-donate-button");
    } catch (err) {
      console.error("PayPal init error", err);
    }
  }, [open, sdkReady]);

  return (
    <>
      <footer className="bg-light py-4 border-top mt-auto">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <div className="text-center text-md-start">
            <a className="fw-bold text-primary text-decoration-none fs-5" href="#">
              <i className="bi bi-code-square me-2" />
              Mouseflow
            </a>
            <p className="small text-secondary mt-2 mb-0">© 2026 Todos los derechos reservados.</p>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm rounded-pill"
            onClick={() => setOpen(true)}
          >
            Apoya el proyecto
          </button>
        </div>
      </footer>

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        >
          <div
            className="bg-white rounded-4 shadow p-4"
            style={{ minWidth: 360, maxWidth: 520, maxHeight: "80vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Apoya el proyecto</h6>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={() => setOpen(false)}
              />
            </div>
            <p className="text-secondary small mb-3">
              Tu aporte de <strong>$5.00 USD</strong> nos ayuda a mantener la plataforma.
            </p>
            <div id="paypal-donate-button" />
            {!sdkReady && <div className="text-secondary small mt-2">Cargando PayPal...</div>}
          </div>
        </div>
      )}
    </>
  );
}
