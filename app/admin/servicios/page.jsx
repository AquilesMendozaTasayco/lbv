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
import { convertToWebp } from "@/lib/webp";
import {
  Plus, Trash2, X, Save, Upload, Eye, EyeOff,
  ImageIcon, Type, ArrowUp, ArrowDown, Pencil,
  Building, Users, Briefcase, Shield, Scale,
  Gavel, FileText, Landmark, List,
} from "lucide-react";

const ICONS = {
  Building, Users, Briefcase, Shield, Scale,
  Gavel, FileText, Landmark,
};

const ICON_NAMES = Object.keys(ICONS);

const COLORS = [
  { label: "Azul", value: "from-blue-900/80 to-blue-800/40" },
  { label: "Verde", value: "from-emerald-900/80 to-emerald-800/40" },
  { label: "Ámbar", value: "from-amber-900/80 to-amber-800/40" },
  { label: "Rojo", value: "from-red-900/80 to-red-800/40" },
  { label: "Púrpura", value: "from-purple-900/80 to-purple-800/40" },
  { label: "Gris", value: "from-gray-900/80 to-gray-800/40" },
];

const uploadImage = async (file) => {
  const r = ref(storage, `servicios/${Date.now()}_${file.name}`);
  await uploadBytes(r, file);
  return await getDownloadURL(r);
};

const validateImage = (file) => {
  if (!file.type.startsWith("image/")) {
    Swal.fire({ icon: "error", title: "Archivo inválido", text: "Solo se permiten imágenes." });
    return false;
  }
  if (file.size > 8 * 1024 * 1024) {
    Swal.fire({ icon: "error", title: "Imagen muy grande", text: "Máximo 8 MB por servicio." });
    return false;
  }
  return true;
};

const EMPTY = {
  titulo: "",
  tag: "",
  desc: "",
  items: [""],
  imagen: "",
  icono: "Building",
  color: "from-blue-900/80 to-blue-800/40",
  activo: true,
  orden: 0,
};

export default function AdminServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchServicios(); }, []);

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "servicios"), orderBy("orden", "asc"));
      const snap = await getDocs(q);
      setServicios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error al cargar", text: e.message });
    } finally { setLoading(false); }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !validateImage(file)) return;
    try {
      setUploading(true);
      const webpFile = await convertToWebp(file);
      const url = await uploadImage(webpFile);
      setForm(p => ({ ...p, imagen: url }));
    } catch {
      Swal.fire({ icon: "error", title: "Error al subir", text: "Intenta nuevamente." });
    } finally { setUploading(false); }
  };

  const moveItem = async (servicio, dir) => {
    const sorted = [...servicios].sort((a, b) => a.orden - b.orden);
    const idx = sorted.findIndex(s => s.id === servicio.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([
      updateDoc(doc(db, "servicios", a.id), { orden: b.orden, updatedAt: serverTimestamp() }),
      updateDoc(doc(db, "servicios", b.id), { orden: a.orden, updatedAt: serverTimestamp() }),
    ]);
    fetchServicios();
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, orden: servicios.length });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      titulo: s.titulo || "",
      tag: s.tag || "",
      desc: s.desc || "",
      items: s.items?.length ? s.items : [""],
      imagen: s.imagen || "",
      icono: s.icono || "Building",
      color: s.color || "from-blue-900/80 to-blue-800/40",
      activo: s.activo !== false,
      orden: s.orden ?? 0,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      Swal.fire({ icon: "warning", title: "Título requerido", text: "El servicio necesita un título." });
      return;
    }
    try {
      const payload = {
        titulo: form.titulo.trim(),
        tag: form.tag.trim(),
        desc: form.desc.trim(),
        items: form.items.filter(i => i.trim()),
        imagen: form.imagen,
        icono: form.icono,
        color: form.color,
        activo: form.activo,
        orden: form.orden,
      };

      if (editing) {
        await updateDoc(doc(db, "servicios", editing.id), { ...payload, updatedAt: serverTimestamp() });
        Swal.fire({ icon: "success", title: "Servicio actualizado", timer: 1200, showConfirmButton: false });
      } else {
        await addDoc(collection(db, "servicios"), { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        Swal.fire({ icon: "success", title: "Servicio creado", timer: 1200, showConfirmButton: false });
      }

      setShowModal(false);
      fetchServicios();
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error al guardar", text: e.message });
    }
  };

  const handleToggle = async (s) => {
    await updateDoc(doc(db, "servicios", s.id), { activo: !s.activo, updatedAt: serverTimestamp() });
    fetchServicios();
  };

  const handleDelete = async (s) => {
    const result = await Swal.fire({
      title: "¿Eliminar servicio?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar", reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "servicios", s.id));
        Swal.fire({ icon: "success", title: "Eliminado", timer: 1200, showConfirmButton: false });
        fetchServicios();
      } catch (e) {
        Swal.fire({ icon: "error", title: "Error", text: e.message });
      }
    }
  };

  const sorted = [...servicios].sort((a, b) => a.orden - b.orden);
  const activos = servicios.filter(s => s.activo !== false).length;

  const renderIcon = (name, size = 17) => {
    const Icon = ICONS[name];
    return Icon ? <Icon size={size} /> : null;
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-1 bg-accent" />
              <h1 className="font-sans text-3xl font-bold text-primary">Servicios</h1>
            </div>
            <p className="mt-1 ml-4 font-sans text-xs text-text/50 uppercase tracking-wider">
              Áreas de práctica
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-widest text-primary shadow-lg hover:opacity-90 transition-all"
          >
            <Plus size={16} /> Nuevo Servicio
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
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

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-sm border-4 border-accent border-t-transparent" />
        </div>
      ) : sorted.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-sm bg-white p-16 text-center border border-primary/10 shadow-sm">
          <Building size={56} className="mx-auto mb-4 text-text/20" />
          <p className="font-sans text-sm font-bold uppercase tracking-widest text-text/50">No hay servicios registrados</p>
          <p className="mt-2 font-sans text-xs text-text/40">Crea un servicio para que aparezca en el sitio.</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {sorted.map((s, i) => {
            const Icon = ICONS[s.icono] || Building;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`group relative overflow-hidden rounded-sm bg-white border transition-all duration-200 shadow-sm hover:shadow-md ${
                  s.activo !== false ? "border-primary/10" : "border-primary/5 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="relative h-40 sm:h-auto sm:w-64 flex-shrink-0 overflow-hidden bg-bg-alt">
                    {s.imagen ? (
                      <img src={s.imagen} alt={s.titulo || "Servicio"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full min-h-[160px] items-center justify-center">
                        <Icon size={40} className="text-text/20" />
                      </div>
                    )}
                    <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent shadow-lg">
                      <span className="font-sans text-[10px] font-bold text-primary">{i + 1}</span>
                    </div>
                    <div className="absolute right-2 top-2">
                      <span className={`rounded-sm px-2.5 py-1 font-sans text-[9px] font-semibold uppercase ${
                        s.activo !== false ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {s.activo !== false ? "Activo" : "Oculto"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} className="text-accent" />
                        <h3 className="font-sans text-base font-bold text-primary">{s.titulo}</h3>
                      </div>
                      {s.tag && (
                        <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-wider text-accent mb-2">
                          {s.tag}
                        </span>
                      )}
                      {s.desc && (
                        <p className="font-sans text-xs text-text/60 line-clamp-2">{s.desc}</p>
                      )}
                      {s.items?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {s.items.slice(0, 3).map((item, j) => (
                            <span key={j} className="rounded-sm bg-bg-alt px-2 py-0.5 font-sans text-[9px] text-text/50">
                              {item}
                            </span>
                          ))}
                          {s.items.length > 3 && (
                            <span className="rounded-sm bg-bg-alt px-2 py-0.5 font-sans text-[9px] text-text/30">
                              +{s.items.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <div className="flex gap-1 mr-2">
                        <button onClick={() => moveItem(s, "up")} disabled={i === 0}
                          className="flex items-center justify-center rounded-sm border border-primary/10 bg-bg-alt p-2 text-text/40 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                          <ArrowUp size={13} />
                        </button>
                        <button onClick={() => moveItem(s, "down")} disabled={i === sorted.length - 1}
                          className="flex items-center justify-center rounded-sm border border-primary/10 bg-bg-alt p-2 text-text/40 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      <button onClick={() => openEdit(s)}
                        className="flex items-center gap-1 rounded-sm bg-accent/5 px-3 py-2 font-sans text-[9px] font-semibold uppercase text-accent hover:bg-accent/10 transition-colors">
                        <Pencil size={11} /> Editar
                      </button>
                      <button onClick={() => handleToggle(s)}
                        className={`flex items-center gap-1 rounded-sm px-3 py-2 font-sans text-[9px] font-semibold uppercase transition-colors ${
                          s.activo !== false
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}>
                        {s.activo !== false ? <EyeOff size={11} /> : <Eye size={11} />}
                        {s.activo !== false ? "Ocultar" : "Mostrar"}
                      </button>
                      <button onClick={() => handleDelete(s)}
                        className="flex items-center gap-1 rounded-sm bg-red-100 px-3 py-2 font-sans text-[9px] font-semibold uppercase text-red-700 hover:bg-red-200 transition-colors">
                        <Trash2 size={11} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Modal */}
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
              className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sm bg-white shadow-2xl border border-primary/10"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-white px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 bg-accent" />
                  <h2 className="font-sans text-lg font-bold text-primary">
                    {editing ? "Editar Servicio" : "Nuevo Servicio"}
                  </h2>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-sm p-2 text-text/40 hover:bg-bg-alt transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* 1 · IMAGEN */}
                <div>
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <ImageIcon size={15} className="text-accent" />
                    <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Imagen de fondo</h3>
                  </div>
                  <p className="mt-1 font-sans text-[10px] text-text/40">Recomendado: 800×600 px · PNG o JPG · máx. 8 MB</p>
                  <div className="mt-4">
                    {form.imagen ? (
                      <div className="relative">
                        <div className="h-44 overflow-hidden rounded-sm border border-primary/10 bg-bg-alt">
                          <img src={form.imagen} alt="Servicio" className="h-full w-full object-cover" />
                        </div>
                        <button type="button" onClick={() => setForm(p => ({ ...p, imagen: "" }))}
                          className="absolute right-2 top-2 rounded-sm bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-primary/10 bg-bg-alt transition-all hover:border-accent hover:bg-accent/5">
                        {uploading ? (
                          <div className="h-7 w-7 animate-spin rounded-sm border-4 border-accent border-t-transparent" />
                        ) : (
                          <>
                            <Upload size={28} className="mb-2 text-text/30" />
                            <span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-text/40">Subir imagen de fondo</span>
                            <span className="mt-1 font-sans text-[9px] text-text/30">800×600 px recomendado</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
                      </label>
                    )}
                  </div>
                </div>

                {/* 2 · TEXTO */}
                <div>
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <Type size={15} className="text-accent" />
                    <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Información del servicio</h3>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Título *</label>
                      <input type="text" value={form.titulo}
                        onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                        placeholder="Ej: Administrativo"
                        className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Tag / Categoría</label>
                      <input type="text" value={form.tag}
                        onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}
                        placeholder="Ej: Derecho Público"
                        className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-wider text-text/60">Descripción</label>
                      <textarea value={form.desc}
                        onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                        placeholder="Ej: Asesoramos a empresas y particulares..."
                        rows={3}
                        className="w-full rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30 resize-none" />
                    </div>
                  </div>
                </div>

                {/* 3 · ITEMS */}
                <div>
                  <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                    <List size={15} className="text-accent" />
                    <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Lista de servicios</h3>
                  </div>
                  <p className="mt-1 font-sans text-[10px] text-text/40">Elementos que se muestran en la página de servicios.</p>
                  <div className="mt-4 space-y-3">
                    {form.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={item}
                          onChange={e => {
                            const newItems = [...form.items];
                            newItems[i] = e.target.value;
                            setForm(p => ({ ...p, items: newItems }));
                          }}
                          placeholder="Ej: Formalización minera y concesiones"
                          className="flex-1 rounded-sm border border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-sm text-text outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-text/30" />
                        <button type="button" onClick={() => {
                          if (form.items.length <= 1) return;
                          setForm(p => ({ ...p, items: p.items.filter((_, j) => j !== i) }));
                        }} disabled={form.items.length <= 1}
                          className="rounded-sm p-2 text-red-400 hover:bg-red-50 disabled:opacity-30 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setForm(p => ({ ...p, items: [...p.items, ""] }))}
                      className="flex items-center gap-1.5 rounded-sm border border-dashed border-primary/10 bg-bg-alt px-4 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-text/40 hover:border-accent hover:text-accent transition-all w-full justify-center">
                      <Plus size={14} /> Agregar elemento
                    </button>
                  </div>
                </div>

                {/* 4 · ICONO Y COLOR */}
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                      <Building size={15} className="text-accent" />
                      <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Icono</h3>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {ICON_NAMES.map(name => {
                        const active = form.icono === name;
                        return (
                          <button key={name} type="button" onClick={() => setForm(p => ({ ...p, icono: name }))}
                            className={`flex flex-col items-center gap-1 rounded-sm border p-3 transition-all ${
                              active
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-primary/10 bg-bg-alt text-text/40 hover:border-accent/30 hover:text-accent"
                            }`}>
                            {renderIcon(name, 20)}
                            <span className={`font-sans text-[7px] font-semibold uppercase tracking-wider ${active ? "text-accent" : "text-text/30"}`}>
                              {name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
                      <ImageIcon size={15} className="text-accent" />
                      <h3 className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text/60">Color de fondo</h3>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {COLORS.map(c => {
                        const active = form.color === c.value;
                        return (
                          <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, color: c.value }))}
                            className={`flex items-center gap-3 rounded-sm border p-3 transition-all ${
                              active
                                ? "border-accent bg-accent/5"
                                : "border-primary/10 bg-bg-alt hover:border-accent/30"
                            }`}>
                            <div className={`h-8 w-8 rounded-sm bg-gradient-to-br ${c.value}`} />
                            <span className={`font-sans text-[10px] font-semibold ${active ? "text-accent" : "text-text/50"}`}>
                              {c.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 5 · VISIBILIDAD */}
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
                          {form.activo ? "Servicio Activo" : "Servicio Oculto"}
                        </p>
                        <p className="font-sans text-[9px] text-text/40 mt-0.5">
                          {form.activo ? "Visible en el sitio" : "No aparece en el sitio"}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 flex gap-4 border-t border-primary/10 bg-white px-8 py-5">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 rounded-sm border border-primary/10 bg-white px-6 py-3 font-sans text-sm font-semibold text-text/70 hover:bg-bg-alt transition-colors">
                  Cancelar
                </button>
                <button type="button" onClick={handleSave} disabled={uploading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3 font-sans text-sm font-bold text-primary shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <Save size={16} />
                  {editing ? "Actualizar Servicio" : "Crear Servicio"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
