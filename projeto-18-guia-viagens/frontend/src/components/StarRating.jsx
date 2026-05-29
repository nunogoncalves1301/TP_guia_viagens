export default function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className={`star-rating ${readonly ? "readonly" : ""}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? "star filled" : "star"}
          onClick={() => !readonly && onChange?.(n)}
          disabled={readonly}
          aria-label={`${n} estrelas`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
