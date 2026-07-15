import React, { useState } from 'react';
import { ArrowLeft, Calendar, FileText, Globe, Mail, MapPin, Building, ShieldAlert, CheckCircle, ExternalLink, Bookmark } from 'lucide-react';
import { Opportunity } from '../data';

interface DetailViewProps {
  opportunity: Opportunity;
  isBookmarked: boolean;
  onToggleBookmark: (id: number, title: string) => void;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  opportunity,
  isBookmarked,
  onToggleBookmark,
  onBack
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Convert amount cents to Millions COP
  const formatMillionsCOP = (cents: number) => {
    const cop = cents / 100;
    const millions = cop / 1000000;
    return `$${millions.toLocaleString('es-CO', { maximumFractionDigits: 1 })} M COP`;
  };

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(opportunity.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans animate-fadeIn" id="opportunity-detail-root">
      
      {/* Return & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gov-border gap-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-gov-primary transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a los Resultados</span>
        </button>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onToggleBookmark(opportunity.id, opportunity.title)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider shadow-2xs ${
              isBookmarked 
                ? 'bg-[#E8F5EE] text-[#1A7A4A] border-[#A8D5B5]' 
                : 'bg-white text-slate-600 border-gov-border hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Seguida ✓' : 'Seguir ★'}</span>
          </button>

          <a 
            href={opportunity.detail_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gov-primary hover:bg-[#003A80] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 uppercase tracking-wider shadow-2xs cursor-pointer"
          >
            <span>Ver en SECOP</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Main Title Banner Card */}
      <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span 
            onClick={copyIdToClipboard}
            className="font-mono text-[10px] font-bold text-slate-400 bg-gov-surface hover:bg-slate-200/50 px-2.5 py-1 rounded-md cursor-pointer transition-colors border border-gov-border"
            title="Haga clic para copiar ID"
          >
            {opportunity.id} {copiedLink ? '✓ Copiado' : ''}
          </span>
          <span className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
          <span className="bg-[#E8F0FE] text-[#1A73E8] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#AECBFC]">
            datos.gov.co
          </span>
          <span className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
            opportunity.status === 'activo' ? 'bg-[#E8F5EE] text-[#1A7A4A] border-[#A8D5B5]' :
            opportunity.status === 'cerrado' ? 'bg-[#F1F3F5] text-[#495057] border-[#CED4DA]' : 
            'bg-[#E8F0FE] text-[#1A73E8] border-[#AECBFC]'
          }`}>
            {opportunity.status}
          </span>
        </div>

        <h1 className="font-display font-bold text-xl md:text-2xl text-gov-primary leading-tight uppercase tracking-wide">
          {opportunity.title}
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center mt-4 text-xs text-slate-500 border-t border-gov-border pt-4 font-medium">
          <div className="flex items-center space-x-1.5">
            <Building className="h-4 w-4 text-slate-400" />
            <span className="font-bold text-slate-700">{opportunity.entity}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center space-x-1.5">
            <Globe className="h-4 w-4 text-slate-400" />
            <span>República de Colombia</span>
          </div>
        </div>
      </div>

      {/* Main Stats Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Budget */}
        <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs hover:shadow-xs transition-shadow duration-300">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Presupuesto Estimado</span>
          <h3 className="text-2xl font-bold font-display text-gov-primary mt-1">{formatMillionsCOP(opportunity.estimated_amount_cents)}</h3>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Formateado bajo Ley 80 de Contratación</p>
        </div>

        {/* Metric 2: Published date */}
        <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs hover:shadow-xs transition-shadow duration-300">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fecha de Publicación</span>
          <h3 className="text-lg font-bold font-display text-slate-700 mt-1 flex items-center">
            <Calendar className="h-4.5 w-4.5 mr-1.5 text-slate-400" />
            {opportunity.published_at}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Sincronizado vía API de SECOP II</p>
        </div>

        {/* Metric 3: Closing Date — closing_at puede ser null (SECOP no provee fecha confiable) */}
        <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs hover:shadow-xs transition-shadow duration-300">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Plazo Máximo de Recepción</span>
          {opportunity.closing_at ? (
            <h3 className="text-lg font-bold font-display text-gov-error mt-1 flex items-center">
              <Calendar className="h-4.5 w-4.5 mr-1.5 text-gov-error" />
              {opportunity.closing_at}
            </h3>
          ) : (
            <h3 className="text-sm font-medium text-slate-400 mt-1 flex items-center">
              <Calendar className="h-4.5 w-4.5 mr-1.5 text-slate-300" />
              No disponible en SECOP II
            </h3>
          )}
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Hora de cierre estándar 17:00 (Bogotá)</p>
        </div>

      </div>

      {/* Detailed Description block */}
      <div className="bg-white p-6 rounded-2xl border border-gov-border shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gov-border">
          <FileText className="h-4.5 w-4.5 text-gov-primary" />
          <h3 className="font-display font-bold text-sm text-gov-primary uppercase tracking-wider">Descripción del Objeto Contractual</h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-gov-surface p-4 rounded-xl border border-gov-border font-medium">
          {opportunity.description}
        </p>

        {/* Integration metadata */}
        <div className="bg-[#E8F0FE] p-4 rounded-xl border border-[#AECBFC] flex items-start space-x-3 text-xs text-slate-700">
          <ShieldAlert className="h-5 w-5 text-gov-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-gov-primary uppercase tracking-wide block">Nota Técnica de Interoperabilidad:</span>
            <p className="text-[11px] leading-normal text-slate-600 font-medium">
              Esta ficha técnica de oportunidad pública proviene de un consumo automatizado diario del backend que analiza las APIs oficiales de Colombia Compra Eficiente (SECOP II). No se requiere validación de tokens o credenciales manuales para la visualización del pliego definitivo. Para presentar ofertas válidas, por favor use el botón superior "Ver en SECOP" para acceder a la plataforma transaccional oficial colombiana.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
