import React, { forwardRef } from 'react';
import Image from 'next/image';

type BillReceiptProps = {
  bill: any;
  student: any;
};

const formatCurrency = (value: number | undefined | null) => {
  if (value === undefined || value === null) return '₹0';
  return `₹${Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value: string | Date | undefined | null) => {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const BillReceipt = forwardRef<HTMLDivElement, BillReceiptProps>(({ bill, student }, ref) => {
  if (!bill || !student) return null;

  const outstanding = Math.max(
    Number(bill.amountDue || 0) - Number(bill.amountPaid || 0),
    0
  );

  const receiptNumber = bill._id ? String(bill._id).slice(-8).toUpperCase() : 'N/A';

  return (
    <div
      ref={ref}
      style={{
        width: '794px', // A4 width at 96dpi approx
        minHeight: '1123px', // A4 height at 96dpi approx
        backgroundColor: '#ffffff',
        padding: '24px 32px 16px 32px',
        boxSizing: 'border-box',
        color: '#111827',
        fontFamily:
          "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <Image
          src="/assets/bill/header.jpg"
          alt="Edurizon Header"
          width={1200}
          height={200}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </div>

      {/* Title & Meta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Payment Receipt
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#6B7280' }}>
            This is a computer generated receipt for your records.
          </div>
        </div>

        <table
          style={{
            fontSize: '12px',
            borderCollapse: 'collapse',
            minWidth: '220px',
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: '4px 8px',
                  border: '1px solid #E5E7EB',
                  fontWeight: 600,
                  backgroundColor: '#F9FAFB',
                }}
              >
                Receipt No.
              </td>
              <td
                style={{
                  padding: '4px 8px',
                  border: '1px solid #E5E7EB',
                  textAlign: 'right',
                }}
              >
                {receiptNumber}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '4px 8px',
                  border: '1px solid #E5E7EB',
                  fontWeight: 600,
                  backgroundColor: '#F9FAFB',
                }}
              >
                Issue Date
              </td>
              <td
                style={{
                  padding: '4px 8px',
                  border: '1px solid #E5E7EB',
                  textAlign: 'right',
                }}
              >
                {formatDate(bill.issueDate || bill.createdAt)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '4px 8px',
                  border: '1px solid #E5E7EB',
                  fontWeight: 600,
                  backgroundColor: '#F9FAFB',
                }}
              >
                Due Date
              </td>
              <td
                style={{
                  padding: '4px 8px',
                  border: '1px solid #E5E7EB',
                  textAlign: 'right',
                }}
              >
                {formatDate(bill.dueDate)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Student Details */}
      <div
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          padding: '12px 16px',
          marginBottom: '16px',
          fontSize: '12px',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>
          Student Details
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '2px' }}>
              <span style={{ fontWeight: 600 }}>Name: </span>
              <span>{student.name || '-'}</span>
            </div>
            <div style={{ marginBottom: '2px' }}>
              <span style={{ fontWeight: 600 }}>Email: </span>
              <span>{student.email || '-'}</span>
            </div>
            <div>
              <span style={{ fontWeight: 600 }}>Phone: </span>
              <span>{student.phone || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '12px',
          marginBottom: '12px',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: '1px solid #E5E7EB',
                padding: '8px',
                backgroundColor: '#F3F4F6',
                textAlign: 'left',
                fontWeight: 600,
              }}
            >
              Description
            </th>
            <th
              style={{
                border: '1px solid #E5E7EB',
                padding: '8px',
                backgroundColor: '#F3F4F6',
                textAlign: 'right',
                fontWeight: 600,
                width: '140px',
              }}
            >
              Amount (INR)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                border: '1px solid #E5E7EB',
                padding: '8px',
                verticalAlign: 'top',
              }}
            >
              {bill.description || '-'}
            </td>
            <td
              style={{
                border: '1px solid #E5E7EB',
                padding: '8px',
                textAlign: 'right',
                verticalAlign: 'top',
              }}
            >
              {formatCurrency(bill.amountDue)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '24px',
        }}
      >
        <table
          style={{
            fontSize: '12px',
            borderCollapse: 'collapse',
            minWidth: '260px',
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: '6px 10px',
                  border: '1px solid #E5E7EB',
                  fontWeight: 600,
                  backgroundColor: '#F9FAFB',
                }}
              >
                Total Billed
              </td>
              <td
                style={{
                  padding: '6px 10px',
                  border: '1px solid #E5E7EB',
                  textAlign: 'right',
                }}
              >
                {formatCurrency(bill.amountDue)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '6px 10px',
                  border: '1px solid #E5E7EB',
                  fontWeight: 600,
                  backgroundColor: '#F9FAFB',
                }}
              >
                Amount Paid
              </td>
              <td
                style={{
                  padding: '6px 10px',
                  border: '1px solid #E5E7EB',
                  textAlign: 'right',
                }}
              >
                {formatCurrency(bill.amountPaid)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '6px 10px',
                  border: '1px solid #E5E7EB',
                  fontWeight: 700,
                  backgroundColor: '#111827',
                  color: '#F9FAFB',
                }}
              >
                Outstanding Balance
              </td>
              <td
                style={{
                  padding: '6px 10px',
                  border: '1px solid #E5E7EB',
                  textAlign: 'right',
                  fontWeight: 700,
                  backgroundColor: '#111827',
                  color: '#F9FAFB',
                }}
              >
                {formatCurrency(outstanding)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div style={{ fontSize: '11px', color: '#4B5563', marginBottom: '40px' }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Notes:</div>
        <ol style={{ margin: 0, paddingLeft: '18px' }}>
          <li>This receipt is valid only after the realization of the payment.</li>
          <li>Please retain this document for your financial and academic records.</li>
        </ol>
      </div>

      {/* Footer image fixed at bottom */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Image
          src="/assets/bill/bill%20format%20footer.png"
          alt="Edurizon Footer"
          width={1200}
          height={200}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
});

BillReceipt.displayName = 'BillReceipt';

export default BillReceipt;



