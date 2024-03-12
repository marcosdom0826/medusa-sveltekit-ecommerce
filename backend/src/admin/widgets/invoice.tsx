import type { WidgetConfig } from '@medusajs/admin';
import { clx } from '@medusajs/ui';


// eslint-disable-next-line @typescript-eslint/naming-convention
const Invoice = ({ order }) => {

    const invoiceNumber = order?.invoice?.invoice_number || order?.metadata?.invoice?.invoice_number || 'System';

    const downloadInvoice = () => {
        const pdf = order?.invoice?.pdf || order?.metadata?.invoice?.pdf;

        const arrayBuffer = new Uint8Array(pdf.data).buffer;

        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
    };

    return (
        <div className={clx(
            'p-4 rounded-lg gap-3',
            'flex items-start shadow-elevation-card-rest',
            'bg-ui-bg-subtle grid grid-cols-2 gap-8 bg-white'
        )}>
            <h2 className='col-span-2 text-2xl font-bold'>Invoice</h2>
            <span className='text-lg'>Invoice Number:</span>
            <span className="font-bold">{order?.invoice?.invoice_number || order?.metadata?.invoice?.invoice_number || 'System'}</span>
            <button
                className='col-span-2 border bg-slate-100 font-bold text-xl rounded-md p-4'
                onClick={downloadInvoice}
            >
                Download invoice
            </button>
        </div>
    );
};

export const config: WidgetConfig = {
    zone: 'order.details.after'
};


export default Invoice;
