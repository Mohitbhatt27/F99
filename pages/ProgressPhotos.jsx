import { useState, useEffect, useRef } from "react";
import { api } from "../src/utils/api";

export default function ProgressPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [lightbox, setLightbox] = useState(null); // photo object to show fullscreen
  const fileRef = useRef();

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    setLoading(true);
    try {
      const data = await api.get("/progress-photo/photo");
      setPhotos(data);
    } catch (err) {
      setError("Failed to load photos.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setSelectedFile(file);
    setError("");

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a photo first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", selectedFile);
      if (note.trim()) formData.append("note", note.trim());

      // Must use raw fetch here — api.js sets Content-Type: application/json
      // which breaks multipart/form-data uploads
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL ?? "http://localhost:5000"}/api/v1/progress-photo/photo`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed.");

      setPhotos([data.photo, ...photos]);
      setSuccess("Photo uploaded successfully!");
      setSelectedFile(null);
      setPreview(null);
      setNote("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  }

  // Group photos by month for timeline view
  const grouped = photos.reduce((acc, photo) => {
    const date = new Date(photo.date ?? photo.createdAt);
    const key = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(photo);
    return acc;
  }, {});

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] px-6 md:px-12 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Progress Photos</h1>
        <p className="text-[var(--text-sub)] mt-1">
          Track your physical transformation over time.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--text-sub)]/20 space-y-4">
        <h2 className="text-lg font-semibold">Upload New Photo</h2>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[var(--text-sub)]/30 rounded-xl p-8 text-center cursor-pointer hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all duration-200"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
          ) : (
            <div className="space-y-2">
              <p className="text-4xl">📸</p>
              <p className="text-[var(--text-sub)] text-sm">
                Drag and drop a photo here, or click to select
              </p>
              <p className="text-[var(--text-sub)] text-xs">
                JPG, PNG, WEBP — max 10MB
              </p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Note input */}
        <input
          type="text"
          placeholder="Add a note (optional) — e.g. Week 4, after cut"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
        />

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
            {success}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="bg-[var(--primary)] text-black px-6 py-2.5 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>

          {preview && (
            <button
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
                setNote("");
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="px-6 py-2.5 rounded-lg border border-[var(--text-sub)]/30 hover:bg-[var(--bg)] transition text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-sub)]">
          <p className="text-5xl mb-4">🏋️</p>
          <p className="text-lg font-medium">No photos yet</p>
          <p className="text-sm mt-1">
            Upload your first progress photo to start tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([month, monthPhotos]) => (
            <div key={month}>
              <h3 className="text-sm font-semibold text-[var(--text-sub)] uppercase tracking-widest mb-4">
                {month}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {monthPhotos.map((photo, i) => (
                  <div
                    key={photo._id ?? i}
                    onClick={() => setLightbox(photo)}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-[var(--text-sub)]/20 hover:border-[var(--primary)]/40 transition"
                  >
                    <img
                      src={photo.photoUrl}
                      alt={photo.note || "Progress photo"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                      {photo.note && (
                        <p className="text-white text-xs font-medium truncate">
                          {photo.note}
                        </p>
                      )}
                      <p className="text-white/70 text-xs">
                        {new Date(
                          photo.date ?? photo.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
            >
              ✕ Close
            </button>
            <img
              src={lightbox.photoUrl}
              alt={lightbox.note || "Progress photo"}
              className="w-full rounded-xl object-contain max-h-[80vh]"
            />
            <div className="mt-3 text-center">
              {lightbox.note && (
                <p className="text-white font-medium">{lightbox.note}</p>
              )}
              <p className="text-white/50 text-sm mt-1">
                {new Date(
                  lightbox.date ?? lightbox.createdAt,
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
