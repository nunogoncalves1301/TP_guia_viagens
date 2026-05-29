import { photoUrl } from "../api";

export default function PhotoGallery({ photos, onDelete, editable = false }) {
  if (!photos?.length) {
    return <p className="empty-msg">Sem fotografias ainda.</p>;
  }

  return (
    <div className="photo-gallery">
      {photos.map((photo) => (
        <figure key={photo.id} className="photo-item">
          <img src={photoUrl(photo.filename)} alt={photo.original_name || "Foto"} loading="lazy" />
          {editable && onDelete && (
            <button
              type="button"
              className="photo-delete"
              onClick={() => onDelete(photo.id)}
              title="Eliminar foto"
            >
              ×
            </button>
          )}
        </figure>
      ))}
    </div>
  );
}
