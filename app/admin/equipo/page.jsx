"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Swal from "sweetalert2";
import {
  Plus, Trash2, X, Save, Upload, Eye, EyeOff,
  ImageIcon, ArrowUp, ArrowDown, Pencil,
  Users, Link as LinkIcon, Plus as PlusIcon, FileText,
} from "lucide-react";

const uploadImage = async (file) => {
  const r = ref(storage, `equipo/${Date.now()}_${file.name}`);
  await uploadBytes(r, file);
  return await getDownloadURL(r);
};

const validateImage = (file) => {
  if (!file.type.startsWith("image/")) {
    Swal.fire({ icon: "error", title: "Archivo inválido", text: "Solo se permiten imágenes." });
    return false;
  }
  if (file.size > 8 * 1024 * 1024) {
    Swal.fire({ icon: "error", title: "Imagen muy grande", text: "Máximo 8 MB." });
    return false;
  }
  return true;
};

const EMPTY = {
  nombre: "",
  cargo: "",
  email: "",
  ciudad: "",
  cv: "",
  foto: "",
  descripcion: "",
  habilidades: [""],
  especialidades: [],
  activo: true,
  orden: 0,
};

export default function AdminEquipoPage() {
  const [items, setItems] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eqSnap, espSnap] = await Promise.all([
        getDocs(query(collection(db, "equipo"), orderBy("orden", "asc"))),
        getDocs(query(collection(db, "servicios"), orderBy("orden", "asc"))),
      ]);
      setItems(eqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setEspecialidades(espSnap.docs.map(d => ({ id: d.id, titulo: d.data().titulo })));
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error al cargar", text: e.message });
    } finally { setLoading(false); }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !validateImage(file)) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setForm(p => ({ ...p, foto: url }));
    } catch {
      Swal.fire({ icon: "error", title: "Error al subir", text: "Intenta nuevamente." });
    } finally { setUploading(false); }
  };

  const handleCv = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "Archivo muy grande", text: "Máximo 20 MB." });
      return;
    }
    try {
      setUploadingCv(true);
      const r = ref(storage, `equipo/cv/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      setForm(p => ({ ...p, cv: url }));
    } catch {
      Swal.fire({ icon: "error", title: "Error al subir", text: "Intenta nuevamente." });
    } finally { setUploadingCv(false); }
  };

  const moveItem = async (item, dir) => {
    const sorted = [...items].sort((a, b) => a.orden - b.orden);
    const idx = sorted.findIndex(x => x.id === item.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([
      updateDoc(doc(db, "equipo", a.id), { orden: b.orden, updatedAt: serverTimestamp() }),
      updateDoc(doc(db, "equipo", b.id), { orden: a.orden, updatedAt: serverTimestamp() }),
    ]);
    fetchData();
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, orden: items.length });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      nombre: item.nombre || "",
      cargo: item.cargo || "",
      email: item.email || "",
      ciudad: item.ciudad || "",
      cv: item.cv || "",
      foto: item.foto || "",
      descripcion: item.descripcion || "",
      habilidades: item.habilidades?.length ? item.habilidades : [""],
      especialidades: item.especialidades || [],
      activo: item.activo !== false,
      orden: item.orden ?? 0,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      Swal.fire({ icon: "warning", title: "Nombre requerido", text: "El abogado necesita un nombre." });
      return;
    }
    try {
      const payload = {
        nombre: form.nombre.trim(),
        cargo: form.cargo.trim(),
        email: form.email.trim(),
        ciudad: form.ciudad.trim(),
        cv: form.cv.trim(),
        foto: form.foto,
        descripcion: form.descripcion.trim(),
        habilidades: form.habilidades.filter(h => h.trim()),
        especialidades: form.especialidades,
        activo: form.activo,
        orden: form.orden,
      };

      if (editing) {
        await updateDoc(doc(db, "equipo", editing.id), { ...payload, updatedAt: serverTimestamp() });
        Swal.fire({ icon: "success", title: "Actualizado", timer: 1200, showConfirmButton: false });
      } else {
        await addDoc(collection(db, "equipo"), { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        Swal.fire({ icon: "success", title: "Creado", timer: 1200, showConfirmButton: false });
      }

      setShowModal(false);
      fetchData();
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error al guardar", text: e.message });
    }
  };

  const handleToggle = async (item) => {
    await updateDoc(doc(db, "equipo", item.id), { activo: !item.activo, updatedAt: serverTimestamp() });
    fetchData();
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar", reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "equipo", item.id));
        Swal.fire({ icon: "success", title: "Eliminado", timer: 1200, showConfirmButton: false });
        fetchData();
      } catch (e) {
        Swal.fire({ icon: "error", title: "Error", text: e.message });
      }
    }
  };

  const sorted = [...items].sort((a, b) => a.orden - b.orden);
  const activos = items.filter(i => i.activo !== false).length;

  const getEspNombres = (ids) => ids?.map(id => especialidades.find(e => e.id === id)?.titulo).filter(Boolean) || [];

  const toggleEsp = (id) => {
    setForm(p => ({
      ...p,
      especialidades: p.especialidades.includes(id)
        ? p.especialidades.filter(e => e !== id)
        : [...p.especialidades, id],
    }));
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-1 bg-accent" />
              <h1 className="font-sans text-3xl font-bold text-primary">Equipo</h1>
            </div>
            <p className="mt-1 ml-4 font-sans text-xs text-text/50 uppercase tracking-wider">
              Abogados del estudio
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-primary shadow-lg hover:opacity-90 transition-all"
          >
            <Plus size={16} /> Nuevo Abogado
          </motion.button>
        </div>
      </motion.div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: sorted.length, color: "text-primary" },
          { label: "Activos", value: activos, color: "text-green-700" },
          { label: "Ocultos", value: sorted.length - activos, color: "text-text/50" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-sm border border-primary/10 bg-white p-4 shadow-sm">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-widest text-text/50">{s.label}</p>
            <p className={`mt-1 font-sans text-3xl font-bold ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-sm border-4 border-accent border-t-transparent" />
        </div>
      ) : sorted.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-sm bg-white p-16 text-center border border-primary/10 shadow-sm">
          <Users size={56} className="mx-auto mb-4 text-text/20" />
          <p className="font-sans text-sm font-bold uppercase tracking-widest text-text/50">No hay miembros</p>
          <p className="mt-2 font-sans text-xs text-text/40">Añade el primer abogado al equipo.</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {sorted.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`group relative overflow-hidden rounded-sm bg-white border transition-all duration-200 shadow-sm hover:shadow-md ${
                item.activo !== false ? "border-primary/10" : "border-primary/5 opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-40 sm:h-auto sm:w-40 flex-shrink-0 overflow-hidden bg-bg-alt">
                  {item.foto ? (
                    <img src={item.foto} alt={item.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full min-h-[160px] items-center justify-center">
                      <Users size={32} className="text-text/20" />
                    </div>
                  )}
                  <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent shadow-lg">
                    <span className="font-sans text-[10px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <div className="absolute right-2 top-2">
                    <span className={`rounded-sm px-2.5 py-1 font-sans text-[9px] font-semibold uppercase ${
                      item.activo !== false ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"
                    }`}>
                      {item.activo !== false ? "Activo" : "Oculto"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={16} className="text-accent shrink-0" />
                      <h3 className="font-sans text-base font-bold text-primary">{item.nombre}</h3>
                    </div>
                    {item.cargo && (
                      <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 font-sans text-[8px] font-semibold uppercase tracking-wider text-accent mb-1">
                        {item.cargo}
                      </span>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getEspNombres(item.especialidades).map((e, j) => (
                        <span key={j} className="rounded-sm bg-bg-alt px-2 py-0.5 font-sans text-[8px] text-text/50">{e}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className="flex gap-1 mr-2">
                      <button onClick={() => moveItem(item, "up")} disabled={i === 0}
                        className="flex items-center justify-center rounded-sm border border-primary/10 bg-bg-alt p-2 text-text/40 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ArrowUp size={13} />
                      </button>
                      <button onClick={() => moveItem(item, "down")} disabled={i === sorted.length - 1}
                        className="flex items-center justify-center rounded-sm border border-primary/10 bg-bg-alt p-2 text-text/40 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <button onClick={() => openEdit(item)}
                      className="flex items-center gap-1 rounded-sm bg-accent/5 px-3 py-2 font-sans text-[9px] font-semibold uppercase text-accent hover:bg-accent/10 transition-colors">
                      <Pencil size={11} /> Editar
                    </button>
                    <button onClick={() => handleToggle(item)}
                      className={`flex items-center gap-1 rounded-sm px-3 py-2 font-sans text-[9px] font-semibold uppercase transition-colors ${
                        item.activo !== false
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}>
                      {item.activo !== false ? <EyeOff size={11} /> : <Eye size={11} />}
                      {item.activo !== false ? "Ocultar" : "Mostrar"}
                    </button>
                    <button onClick={() => handleDelete(item)}
                      className="flex items-center gap-1 rounded-sm bg-red-100 px-3 py-2 font-sans text-[9px] font-semibold uppercase text-red-700 hover:bg-red-200 transition-colors">
                      <Trash2 size={11} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 max-h-[94vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sm bg-white shadow-2xl border border-primary/10"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-white px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-accent" />
                  <h2 className="font-sans text-lg font-bold text-primary">
                    {editing ? "Editar Abogado" : "Nuevo Abogado"}
                  </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-sm p-2 text-text/40 hover:bg-bg-alt transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <ImageIcon size={15} className="text-accent" />
                    <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Foto principal</h3>
                  </div>
                  <p className="mt-1 font-sans text-[10px] text-text/40">Recomendado: 400×400 px · PNG o JPG · máx. 8 MB</p>
                  <div className="mt-4">
                    {form.foto ? (
                      <div className="relative inline-block">
                        <div className="h-44 w-44 overflow-hidden rounded-sm border border-primary/10 bg-bg-alt">
                          <img src={form.foto} alt="Foto" className="h-full w-full object-cover" />
                        </div>
                        <button type="button" onClick={() => setForm(p => ({ ...p, foto: "" }))}
                          className="absolute right-1 top-1 rounded-sm bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-44 w-44 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-primary/10 bg-bg-alt transition-all hover:border-accent hover:bg-accent/5">
                        {uploading ? (
                          <div className="h-7 w-7 animate-spin rounded-sm border-4 border-accent border-t-transparent" />
                        ) : (
                          <>
                            <Upload size={28} className="mb-2 text-text/30" />
                            <span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-text/40">Subir foto</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <Users size={15} className="text-accent" />
                    <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Datos personales</h3>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Nombre *</label>
                        <input type="text" value={form.nombre}
                          onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                          placeholder="Ej: Dr. Carlos López"
                          className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                      </div>
                      <div>
                        <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Cargo</label>
                        <input type="text" value={form.cargo}
                          onChange={e => setForm(p => ({ ...p, cargo: e.target.value }))}
                          placeholder="Ej: Socio Fundador"
                          className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Email</label>
                        <input type="email" value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="Ej: clopez@lbvabogados.pe"
                          className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                      </div>
                      <div>
                        <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Ciudad</label>
                        <input type="text" value={form.ciudad}
                          onChange={e => setForm(p => ({ ...p, ciudad: e.target.value }))}
                          placeholder="Ej: Lima, Perú"
                          className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">CV (PDF)</label>
                      <p className="mb-2 font-sans text-[10px] text-text/40">Sube el CV en formato PDF (máx. 20 MB).</p>
                      {form.cv ? (
                        <div className="flex items-center gap-3 rounded-sm border border-primary/10 bg-bg-alt p-3">
                          <FileText size={16} className="text-accent shrink-0" />
                          <a href={form.cv} target="_blank" rel="noopener noreferrer"
                            className="flex-1 font-sans text-xs text-accent hover:underline truncate">
                            {form.cv.split("/").pop() || "Ver CV"}
                          </a>
                          <button type="button" onClick={() => setForm(p => ({ ...p, cv: "" }))}
                            className="rounded-sm bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors shrink-0">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex cursor-pointer items-center gap-3 rounded-sm border-2 border-dashed border-primary/10 bg-bg-alt px-4 py-3 transition-all hover:border-accent">
                          {uploadingCv ? (
                            <div className="h-5 w-5 animate-spin rounded-sm border-[3px] border-accent border-t-transparent" />
                          ) : (
                            <Upload size={16} className="text-accent" />
                          )}
                          <span className="font-sans text-[10px] text-text/60">
                            {uploadingCv ? "Subiendo..." : "Seleccionar PDF"}
                          </span>
                          <input type="file" accept=".pdf" onChange={handleCv} className="hidden" disabled={uploadingCv} />
                        </label>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Descripción</label>
                      <textarea value={form.descripcion}
                        onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                        placeholder="Trayectoria, experiencia, etc."
                        rows={4}
                        className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30 resize-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <PlusIcon size={15} className="text-accent" />
                    <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Habilidades</h3>
                  </div>
                  <div className="mt-4 space-y-3">
                    {form.habilidades.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={h}
                          onChange={e => {
                            const newH = [...form.habilidades];
                            newH[i] = e.target.value;
                            setForm(p => ({ ...p, habilidades: newH }));
                          }}
                          placeholder="Ej: Litigios corporativos"
                          className="flex-1 rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                        <button type="button" onClick={() => {
                          if (form.habilidades.length <= 1) return;
                          setForm(p => ({ ...p, habilidades: p.habilidades.filter((_, j) => j !== i) }));
                        }} disabled={form.habilidades.length <= 1}
                          className="rounded-sm p-2 text-red-400 hover:bg-red-50 disabled:opacity-30 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm(p => ({ ...p, habilidades: [...p.habilidades, ""] }))}
                      className="flex items-center gap-1.5 rounded-sm border border-dashed border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-text/40 hover:border-accent hover:text-accent transition-all w-full justify-center">
                      <Plus size={14} /> Agregar habilidad
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <LinkIcon size={15} className="text-accent" />
                    <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Especialidades</h3>
                  </div>
                  <p className="mt-1 font-sans text-[10px] text-text/40 mb-4">Selecciona las áreas de práctica del abogado.</p>
                  <div className="flex flex-wrap gap-2">
                    {especialidades.map(esp => {
                      const active = form.especialidades.includes(esp.id);
                      return (
                        <button key={esp.id} type="button" onClick={() => toggleEsp(esp.id)}
                          className={`px-4 py-2 rounded-sm font-sans text-[9px] font-bold uppercase tracking-wider transition-all ${
                            active
                              ? "bg-accent text-primary"
                              : "bg-bg-alt text-text/50 hover:text-accent border border-primary/10"
                          }`}>
                          {esp.titulo}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <Eye size={15} className="text-accent" />
                    <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Visibilidad</h3>
                  </div>
                  <div className="mt-4">
                    <label className={`flex cursor-pointer items-center gap-4 rounded-sm border-2 p-4 transition-all ${
                      form.activo ? "border-green-200 bg-green-50" : "border-primary/10 bg-bg-alt"
                    }`}>
                      <input type="checkbox" checked={form.activo}
                        onChange={e => setForm(p => ({ ...p, activo: e.target.checked }))}
                        className="h-4 w-4 accent-accent" />
                      <div>
                        <p className={`font-sans text-[9px] font-semibold uppercase tracking-wider ${form.activo ? "text-green-700" : "text-text/50"}`}>
                          {form.activo ? "Activo" : "Oculto"}
                        </p>
                        <p className="font-sans text-[9px] text-text/40 mt-0.5">
                          {form.activo ? "Visible en el sitio" : "No aparece en el sitio"}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 flex gap-4 border-t border-primary/10 bg-white px-8 py-5">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 rounded-sm border border-primary/10 bg-white px-6 py-3 font-sans text-sm font-semibold text-text/70 hover:bg-bg-alt transition-colors">
                  Cancelar
                </button>
                <button type="button" onClick={handleSave} disabled={uploading || uploadingCv}
                  className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3 font-sans text-sm font-bold text-primary shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <Save size={16} />
                  {editing ? "Actualizar" : "Crear"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
