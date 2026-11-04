import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Le worker pdf.js est servi par Vite (même version que celle embarquée par react-pdf).
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

const toolButton =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40';

/**
 * Visionneuse PDF intégrée (UC-03) : prévisualisation sans téléchargement préalable.
 * `url` pointe vers /documents/{id}/preview (cookie de session envoyé automatiquement).
 */
export default function PdfViewer({ url }) {
    const { t } = useTranslation();
    const boxRef = useRef(null);
    const [numPages, setNumPages] = useState(null);
    const [page, setPage] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [width, setWidth] = useState(640);
    const [failed, setFailed] = useState(false);

    // Largeur disponible : la page PDF s'ajuste au conteneur, le zoom la multiplie.
    useEffect(() => {
        const el = boxRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;
        const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Objets mémorisés : sans cela react-pdf rechargerait le document à chaque rendu.
    const file = useMemo(() => ({ url, withCredentials: true }), [url]);
    const onLoadSuccess = useCallback(({ numPages: n }) => {
        setNumPages(n);
        setPage(1);
        setFailed(false);
    }, []);

    const goTo = (n) => setPage(Math.min(Math.max(1, n), numPages ?? 1));
    const pageWidth = Math.max(200, Math.floor((width - 24) * zoom));

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-1.5">
                <div className="flex items-center gap-1">
                    <button type="button" className={toolButton} onClick={() => goTo(page - 1)} disabled={page <= 1} aria-label={t('viewer.prev')}>
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-24 text-center text-sm text-ink" aria-live="polite">
                        {numPages ? `${t('viewer.page')} ${page} ${t('viewer.of', { total: numPages })}` : '—'}
                    </span>
                    <button type="button" className={toolButton} onClick={() => goTo(page + 1)} disabled={!numPages || page >= numPages} aria-label={t('viewer.next')}>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" className={toolButton} onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))} disabled={zoom <= ZOOM_MIN} aria-label={t('viewer.zoomOut')}>
                        <ZoomOut className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="w-12 text-center text-xs text-ink-muted">{Math.round(zoom * 100)} %</span>
                    <button type="button" className={toolButton} onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))} disabled={zoom >= ZOOM_MAX} aria-label={t('viewer.zoomIn')}>
                        <ZoomIn className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" className={toolButton} onClick={() => setZoom(1)} aria-label={t('viewer.fit')}>
                        <Maximize2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <a href={url} target="_blank" rel="noreferrer" className={toolButton} aria-label={t('viewer.openDirect')}>
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                </div>
            </div>

            <div ref={boxRef} className="max-h-[75vh] overflow-auto rounded-lg border border-border bg-surface-alt p-3">
                {failed ? (
                    <p role="alert" className="py-10 text-center text-sm text-danger-text">{t('viewer.error')}</p>
                ) : (
                    <Document
                        file={file}
                        onLoadSuccess={onLoadSuccess}
                        onLoadError={() => setFailed(true)}
                        loading={
                            <p className="flex items-center justify-center gap-2 py-10 text-sm text-ink-muted">
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                {t('viewer.loading')}
                            </p>
                        }
                        error={<p role="alert" className="py-10 text-center text-sm text-danger-text">{t('viewer.error')}</p>}
                    >
                        <div className="flex justify-center">
                            <Page pageNumber={page} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} className="shadow-md" />
                        </div>
                    </Document>
                )}
            </div>
        </div>
    );
}