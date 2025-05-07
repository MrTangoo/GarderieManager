'use client'

import { useEffect, useRef } from 'react'

export default function PrintLayout({ children, onDone }) {
    const hasPrintedRef = useRef(false)

    useEffect(() => {
        if (hasPrintedRef.current) return
        hasPrintedRef.current = true

        const handleAfterPrint = () => {
            onDone?.()
            window.removeEventListener('afterprint', handleAfterPrint)
        }

        window.addEventListener('afterprint', handleAfterPrint)
        window.print()

        return () => {
            window.removeEventListener('afterprint', handleAfterPrint)
        }
    }, [onDone])

    return (
        <>
            <style>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }

                    html, body, #print-container {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    body * {
                        visibility: hidden;
                    }

                    #print-container,
                    #print-container * {
                        visibility: visible;
                    }

                    #print-container {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                    }

                    .print-page {
                        break-after: page;
                    }
                }
            `}</style>

            <div id="print-container" className="hidden print:block">
                {children}
            </div>
        </>
    )
}
