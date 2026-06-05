const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs } = require("firebase/firestore");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.local") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const servicios = [
  {
    titulo: "Administrativo",
    tag: "Derecho Público",
    desc: "Asesoramos a empresas y particulares en procedimientos ante entidades públicas, con un enfoque estratégico y de cumplimiento normativo.",
    items: [
      "Formalización minera y concesiones",
      "Derecho ambiental y evaluación de impacto",
      "Saneamiento físico legal de predios",
      "Procedimientos ante Indecopi",
      "Contratos y concesiones públicas",
    ],
    icono: "Building",
    color: "from-blue-900/80 to-blue-800/40",
    activo: true,
  },
  {
    titulo: "Civil",
    tag: "Derecho Privado",
    desc: "Brindamos asesoría integral en derecho civil y familiar, protegiendo los intereses patrimoniales y personales de nuestros clientes.",
    items: [
      "Derecho de familia: divorcios, tenencia, alimentos",
      "Derecho registral y notarial",
      "Obligaciones y contratos civiles",
      "Nulidad de actos jurídicos",
      "Procesos civiles en general",
    ],
    icono: "Users",
    color: "from-emerald-900/80 to-emerald-800/40",
    activo: true,
  },
  {
    titulo: "Laboral",
    tag: "Derecho del Trabajo",
    desc: "Ofrecemos asesoría laboral preventiva y defensa en litigios, velando por el cumplimiento de los derechos de trabajadores y empleadores.",
    items: [
      "Asesoría en contratación laboral",
      "Seguridad social y pensiones",
      "Procesos laborales y despidos",
      "Negociación colectiva",
      "Cumplimiento normativo laboral",
    ],
    icono: "Briefcase",
    color: "from-amber-900/80 to-amber-800/40",
    activo: true,
  },
  {
    titulo: "Penal",
    tag: "Derecho Penal",
    desc: "Defensa penal estratégica con un enfoque corporativo, protegiendo a personas y empresas en todas las etapas del proceso penal.",
    items: [
      "Defensa penal estratégica",
      "Derecho penal corporativo",
      "Litigios y juicios orales",
      "Asesoría en compliance penal",
      "Recursos y casaciones",
    ],
    icono: "Shield",
    color: "from-red-900/80 to-red-800/40",
    activo: true,
  },
];

async function seed() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const q = query(collection(db, "servicios"), orderBy("orden", "asc"));
  const snap = await getDocs(q);

  if (!snap.empty) {
    console.log("Ya existen servicios en Firestore. Elimínalos manualmente si quieres volver a seedear.");
    return;
  }

  for (let i = 0; i < servicios.length; i++) {
    const s = servicios[i];
    await addDoc(collection(db, "servicios"), {
      ...s,
      orden: i,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`✓ Creado: ${s.titulo}`);
  }

  console.log("Seed completado exitosamente.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error al seedear:", err);
  process.exit(1);
});
