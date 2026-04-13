import { useEffect, useMemo, useState } from "react";

const cardData = [
  { id: 1, matchId: 1, text: "Variable" },
  { id: 2, matchId: 1, text: "Espacio en memoria" },
  { id: 3, matchId: 2, text: "Bucle For" },
  { id: 4, matchId: 2, text: "Itera un número de veces" },
  { id: 5, matchId: 3, text: "Función" },
  { id: 6, matchId: 3, text: "Bloque de código reutilizable" },
  { id: 7, matchId: 4, text: "Array" },
  { id: 8, matchId: 4, text: "Lista de elementos" },
];

function shuffleCards() {
  return [...cardData]
    .sort(() => Math.random() - 0.5)
    .map((card) => ({ ...card, isFlipped: false, isMatched: false }));
}

export default function MemoryGame() {
  const [cards, setCards] = useState(() => shuffleCards());
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const matchedPairs = useMemo(
    () => cards.filter((card) => card.isMatched).length / 2,
    [cards]
  );
  const totalPairs = cardData.length / 2;
  const isComplete = matchedPairs === totalPairs;

  useEffect(() => {
    if (flippedIndexes.length !== 2) return undefined;

    const [firstIndex, secondIndex] = flippedIndexes;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (!firstCard || !secondCard) {
      setFlippedIndexes([]);
      setLocked(false);
      return undefined;
    }

    const isMatch = firstCard.matchId === secondCard.matchId;
    const timeout = window.setTimeout(() => {
      setCards((prev) =>
        prev.map((card, index) => {
          if (index !== firstIndex && index !== secondIndex) return card;
          return isMatch
            ? { ...card, isMatched: true }
            : { ...card, isFlipped: false };
        })
      );
      setFlippedIndexes([]);
      setLocked(false);
    }, isMatch ? 350 : 900);

    return () => window.clearTimeout(timeout);
  }, [cards, flippedIndexes]);

  const restartGame = () => {
    setCards(shuffleCards());
    setFlippedIndexes([]);
    setMoves(0);
    setLocked(false);
  };

  const handleCardClick = (index) => {
    const selectedCard = cards[index];
    if (!selectedCard || locked || selectedCard.isFlipped || selectedCard.isMatched) {
      return;
    }

    setCards((prev) =>
      prev.map((card, cardIndex) =>
        cardIndex === index ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedIndexes((prev) => {
      const next = [...prev, index];
      if (next.length === 2) {
        setLocked(true);
        setMoves((current) => current + 1);
      }
      return next;
    });
  };

  return (
    <div className="memory-game-container">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold text-dark mb-1">Minijuego: empareja los conceptos</h5>
          <p className="text-secondary mb-0 small">
            Une cada término de programación con su definición correcta.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <span className="badge rounded-pill bg-primary-subtle text-primary memory-chip">
            {matchedPairs}/{totalPairs} pares
          </span>
          <span className="badge rounded-pill bg-secondary memory-chip">
            Movimientos: {moves}
          </span>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm rounded-pill px-3"
            onClick={restartGame}
          >
            Reiniciar
          </button>
        </div>
      </div>

      {isComplete && (
        <div className="memory-victory mb-4">
          <p className="mb-2 fw-bold">¡Excelente! Has emparejado todos los conceptos.</p>
          <button
            type="button"
            className="btn btn-success rounded-pill px-4"
            onClick={restartGame}
          >
            Jugar de nuevo
          </button>
        </div>
      )}

      <div className="memory-card-grid">
        {cards.map((card, index) => (
          <button
            type="button"
            key={`${card.id}-${index}`}
            className={`memory-card-button ${card.isFlipped || card.isMatched ? "is-flipped" : ""}`}
            onClick={() => handleCardClick(index)}
            disabled={locked && !card.isFlipped}
            aria-label={`Carta ${index + 1}`}
          >
            <span className="memory-card-inner">
              <span className="memory-card-face memory-card-front">?</span>
              <span className="memory-card-face memory-card-back">{card.text}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
