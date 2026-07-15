// NOTA PARA HERMES: estos tipos reflejan exactamente lo que el backend real retorna.
// id: number (bigint de PostgreSQL serializado como JSON number)
// closing_at: string | null (null cuando SECOP no provee fecha de cierre confiable)
// entity: string libre — el backend normaliza desde SECOP, no hay listado de entidades
// full_name en el API de registro — ver LoginRegisterView.tsx

export interface Opportunity {
  id: number; // backend retorna bigint como number
  title: string;
  entity: string; // texto libre normalizado desde SECOP
  status: 'activo' | 'cerrado' | 'adjudicado';
  estimated_amount_cents: number; // centavos COP — mostrar como /100/1_000_000 M
  published_at: string; // DD/MM/YYYY
  closing_at: string | null; // null cuando SECOP no provee fecha confiable
  description: string;
  detail_url: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: { key: string; value: string }[]; // coincide con POST /api/v1/saved-searches
  created_at: string; // DD/MM/YYYY
}

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Implementación del Sistema Unificado de Gestión de Trámites Ciudadanos para Entidades de Orden Nacional",
    entity: "Ministerio de Tecnologías de la Información y las Comunicaciones (MinTIC)",
    status: "activo",
    estimated_amount_cents: 450000000000, // $4.500 M COP
    published_at: "12/09/2026",
    closing_at: null, // SECOP no provee fecha de cierre confiable
    description: "Desarrollo, implantación, soporte y mantenimiento de la plataforma interoperable para la unificación de trámites del Estado de acuerdo con los lineamientos de la Estrategia de Gobierno Digital de Colombia. El proveedor deberá garantizar la integración segura mediante APIs, accesibilidad para personas con discapacidad, resguardo seguro de datos en nube gubernamental y alta disponibilidad.",
    detail_url: "https://www.colombiacompra.gov.co/secop-ii"
  },
  {
    id: 2,
    title: "Optimización y Ampliación de la Red de Monitoreo de Calidad del Aire en la Sabana de Bogotá",
    entity: "Secretaría Distrital de Ambiente",
    status: "activo",
    estimated_amount_cents: 280000000000, // $2.800 M COP
    published_at: "10/09/2026",
    closing_at: null,
    description: "Suministro, instalación, calibración técnica e integración de nuevas estaciones de medición de material particulado PM2.5 y PM10 en puntos estratégicos del perímetro urbano, con transmisión de reportes automáticos en tiempo real al servidor central de Colombia Compra Eficiente.",
    detail_url: "https://www.colombiacompra.gov.co/secop-ii"
  },
  {
    id: 3,
    title: "Modernización Tecnológica de Aulas de Aprendizaje en Instituciones Educativas Rurales",
    entity: "Gobernación Departamental",
    status: "activo",
    estimated_amount_cents: 620000000000, // $6.200 M COP
    published_at: "05/09/2026",
    closing_at: null,
    description: "Dotación de equipos de cómputo portátiles de alto rendimiento, tabletas interactivas con software de aprendizaje sin conexión a internet y sistemas solares fotovoltaicos autónomos para escuelas rurales sin acceso estable a energía de red.",
    detail_url: "https://www.colombiacompra.gov.co/secop-ii"
  },
  {
    id: 4,
    title: "Consultoría para la Estructuración del Plan de Desarrollo Urbano Sostenible de la Comuna 13",
    entity: "Alcaldía Municipal",
    status: "cerrado",
    estimated_amount_cents: 95000000000, // $950 M COP
    published_at: "01/09/2026",
    closing_at: null,
    description: "Estudios técnicos de viabilidad, diseño participativo comunitario y modelamiento territorial para la implementación de corredores verdes urbanos, mejoramiento integral de vivienda y movilidad peatonal accesible.",
    detail_url: "https://www.colombiacompra.gov.co/secop-ii"
  },
  {
    id: 5,
    title: "Mantenimiento Preventivo e Intervención de Vías Terciarias para la Reactivación Agrícola",
    entity: "Agencia Pública de Infraestructura",
    status: "adjudicado",
    estimated_amount_cents: 875000000000, // $8.750 M COP
    published_at: "15/08/2026",
    closing_at: null,
    description: "Obras de arte, bacheo de afirmado, remoción de derrumbes, limpieza de alcantarillas e intervención general de la red vial secundaria y terciaria de los municipios priorizados de acuerdo con los estándares de Colombia Compra Eficiente.",
    detail_url: "https://www.colombiacompra.gov.co/secop-ii"
  }
];

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: "search-1",
    name: "Sistemas de Información y Desarrollo de Software",
    filters: [
      { key: "keyword", value: "Software" },
      { key: "entity", value: "Ministerio de Tecnologías" }
    ],
    created_at: "12/06/2026"
  },
  {
    id: "search-2",
    name: "Infraestructura Física y Mantenimiento de Vías",
    filters: [
      { key: "keyword", value: "Vías" },
      { key: "status", value: "activo" }
    ],
    created_at: "01/07/2026"
  }
];
